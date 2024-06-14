const Task = require("../models/task");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");

const getAllTasks = asyncWrapper(async (req, res) => {
  try {
    const { userId, name } = req.user;
    console.log(`😁 UserId: ${userId} Name: ${name}`);
    const tasks = await Task.find({ userId });
    console.log("▶️▶️▶️▶️▶️▶️" + tasks);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

const createTask = asyncWrapper(async (req, res) => {
  console.log("Creating task");
  const { userId, name } = req.user;
  const task = await Task.create({ ...req.body, userId });
  res.status(201).json({ task });
});

const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID });
  console.log("GETTASK💵💵💵💵💵💵💵" + taskID);
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }
  res.status(200).json({ task });
});

const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  console.log("🍕🍕🍕🍕🍕🍕🍕🍕Delete task" + taskID);
  const task = await Task.findOneAndDelete({ _id: taskID });
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }
  res.status(200).json({ task });
});

const updateTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }

  res.status(200).json({ task });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
