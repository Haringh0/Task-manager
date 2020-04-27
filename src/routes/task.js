const express = require("express");
const authenticate = require("../middleware/authenticate");

const router = new express.Router();

const Task = require("../models/tasks");

// Make a new task
router.post("/task/new", authenticate, async (request, response) => {
  const task = new Task({ ...request.body, authorID: request.user._id });

  try {
    await task.save();

    response.status(201).send(task);
  } catch (error) {
    response.sendStatus(400);
  }
});

//Get all the tasks in the database.
router.get("/task/all", authenticate, async (request, response) => {
  const match = {};

  const sort = {};

  if (request.query.completed) {
    match.completed = request.query.completed === "true";
  }

  if (request.query.sort) {
    const query = request.query.sort.split("_");

    sort[query[0]] = query[1] === "desc" ? -1 : 1;
  }

  try {
    await request.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: 3,
          skip: parseInt(request.query.skip),
          sort,
        },
      })
      .execPopulate();

    if (request.user.tasks.length === 0) {
      response.status(404).send("No tasks found.");
    } else {
      response.status(200).send(request.user.tasks);
    }
  } catch (error) {
    response.sendStatus(500);
  }
});

//Get individual task by its description.
router.get("/task/:description", authenticate, async (request, response) => {
  const description = request.params.description;

  try {
    const task = await Task.findOne({
      description,
      authorID: request.user._id,
    });

    const taskObject = await task.toObject();

    if (task) {
      response.status(200).send(taskObject);
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    response.status(500).send();
  }
});

//Update individual task searching by its name.
router.patch(
  "/task/update/:description",
  authenticate,
  async (request, response) => {
    try {
      const description = request.params.description;

      const updates = Object.keys(request.body);

      const allowedUpdates = ["description", "completed"];

      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return response.status(400).send("Invalid Updates!");
      }

      const task = await Task.findOne({
        description,
        authorID: request.user._id,
      });

      if (!task) {
        return response.status(404).send("Invalid task!");
      }

      updates.forEach((update) => (task[update] = request.body[update]));

      await task.save();

      response.status(200).send(task);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

//Delete a task searching by its name.
router.delete(
  "/task/delete/:description",
  authenticate,
  async (request, response) => {
    try {
      const description = request.params.description;

      const task = await Task.findOneAndRemove({
        description,
        authorID: request.user._id,
      });

      if (!task) {
        return response.status(404).send("Task Not Found!");
      }

      const taskObject = await task.toObject();

      response.status(200).send(taskObject);
    } catch (error) {
      response.status(400).send("Invalid task!");
    }
  }
);

module.exports = router;
