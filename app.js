const express = require("express");
const app = express();
const tasks = require("./routes/tasks");
const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");
const port = process.env.PORT || 3000;
require("dotenv").config();

// Middleware to serve static files
app.use(express.static("./public"));

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.use("/api/v1/tasks", tasks);

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
