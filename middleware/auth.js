const jwt = require("jsonwebtoken");

const authenticationMiddleware = async (req, res, next) => {
  try {
    //✨2. Get Authenticate header
    const authHeader = req.cookies.token;
    console.log("Auth Header: " + authHeader);

    if (!authHeader) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET); //✨4. Decode to verify
    const { userId, name } = decoded;
    req.user = { userId, name };
    console.log(`▶️▶️UserID: ${userId} Name:${name}`);
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ error: "Not authorized to access this route" });
  }
};

module.exports = authenticationMiddleware;
