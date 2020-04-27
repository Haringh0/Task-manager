const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    completed: {
      lowercase: true,
      type: Boolean,
      trim: true,
      default: false,
    },
    authorID: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  { timestamps: true }
);

taskSchema.set("toJSON", {
  transform: function (taskDocument, taskObject, options) {
    delete taskObject.authorID;

    delete taskObject._id;

    delete taskObject.__v;

    return taskObject;
  },
});

const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;
