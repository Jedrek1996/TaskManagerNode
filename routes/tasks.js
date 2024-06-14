const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const authenticationMiddleware = require("../middleware/auth");
const { googleLogin, googleGetUserData } = require("../controller/googleLogin");

const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controller/tasks");

// Routes for Google OAuth2 login
router.get("/login", googleLogin);
router.get("/mainPage", googleGetUserData);

// Routes for tasks
router
  .route("/main")
  .get(authenticationMiddleware, getAllTasks)
  .post(authenticationMiddleware, createTask);
router
  .route("/main/:id")
  .get(authenticationMiddleware, getTask)
  .patch(authenticationMiddleware, updateTask)
  .delete(authenticationMiddleware, deleteTask);

module.exports = router;
