const express = require("express");
const app = express();
const path = require("path");
const tasks = require("./routes/tasks");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticationMiddleware = require("./middleware/auth");
const notFound = require("./middleware/not-found");
const port = process.env.PORT || 3000;
require("dotenv").config();

// Middleware to serve static files
app.use(express.static("./public"));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Define routes
app.use("/api/v1/tasks", tasks);
app.use(authenticationMiddleware);

app.get("/mainPage", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mainPage.html"));
});

// Middleware for handling 404 errors
app.use(notFound);

// Error handling middleware
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

start();
