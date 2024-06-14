const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must provide Name"],
    trim: true,
    maxlength: [20, " Name cannot be more than 20"],
  },
  completed: { type: Boolean, default: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Task", TaskSchema);
