const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const asyncWrapper = require("../middleware/async");
dotenv.config();
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");

const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL;

const googleLogin = asyncWrapper(async function (req, res, next) {
  console.log("google login");

  const currentHost = req.hostname; // Get the current host
  const protocol = req.protocol; // Get the current protocol (http or https)
  const redirectUrl = `${baseUrl}/api/v1/tasks/mainPage`;

  res.header(
    "Access-Control-Allow-Origin",
    `${protocol}://${currentHost}:${port}`
  );
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline", // force refresh token to be created
    scope: "https://www.googleapis.com/auth/userinfo.profile openid",
    prompt: "consent",
  });
  res.json({ url: authorizeUrl });
});

async function getUserData(access_token) {
  console.log("Get user data");
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );

  const data = await response.json();
  return data;
}

const googleGetUserData = asyncWrapper(async function (req, res, next) {
  const code = req.query.code;
  console.log("POSTING GOOGLE");

  console.log(code);
  try {
    const redirectURL = `${baseUrl}/api/v1/tasks/mainPage`;

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURL
    );
    const r = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(r.tokens);
    const userData = await getUserData(oAuth2Client.credentials.access_token);

    // Find and create a user
    let existingUser = await User.findOne({ googleId: userData.sub });
    if (!existingUser) {
      existingUser = new User({
        googleId: userData.sub,
        name: userData.name,
      });
      await existingUser.save();
    }
    const token = jwt.sign(
      { userId: existingUser._id, name: existingUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { httpOnly: false });
  } catch (err) {
    console.log("Error logging in with OAuth2 user", err);
  }
  res.redirect(303, `${baseUrl}/mainPage`);
});

module.exports = { googleLogin, googleGetUserData };
