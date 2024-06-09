const getAllTasks = (req, res) => {
  res.send("All Items");
};
const createTask = (req, res) => {
  res.send(req.body);
};
const getTask = (req, res) => {
  res.send({ id: req.params.id });
};
const updateTask = (req, res) => {
  res.send("update task");
};
const deleteTask = (req, res) => {
  res.send("del task");
};

module.exports = { getAllTasks, createTask, getTask, updateTask, deleteTask };
