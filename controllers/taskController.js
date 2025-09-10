const Task = require("../models/Task");
const router = require("../routes/taskRoutes");
const mongoose = require("mongoose");

//Get User's tasks
exports.GetTasks = async (req, res) => {
  try {
    if (!req.userId) return res.redirect("/login");

    // only fetch tasks of this logged-in user
    const tasks = await Task.find({ user: req.userId });

    res.render("index", {
      tasks,
      username: req.username || null,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).send("Error fetching tasks");
  }
};

//Completed task
exports.CompletedTask = async (req, res) => {
  const todo = new Task();
  const data = await todo.completedMethod();
  try {
    res.status(200).json({
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while completing the task.",
      error: err.message, // optional: show error details
    });
  }
};

//CompleteTaskByStatics with static method

exports.complete = async (req, res) => {
  try {
    const tasks = await Task.CompleteTaskByStatics(); // call static method
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// alias to match route name '/completed' -> taskController.CompleteTaskByStatics
exports.CompleteTaskByStatics = exports.complete;

//Add a task
exports.addTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.userId) return res.status(401).send("Login required");

    // save task with user reference
    await Task.create({
      title,
      description,
      user: req.userId,
    });

    res.redirect("/");
  } catch (e) {
    console.error("Error adding task:", e.message);
    res.status(500).send("Error adding task");
  }
};

// Mark a task as completed
exports.completedTask = async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, { completed: true });
  res.redirect("/");
};

//Delete Task
exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect("/");
};

//Task Stats with mongoDB aggregation
exports.getTaskStats = async (req, res) => {
  try {
    if (!req.userId) return res.redirect("/login");

    const userId = new mongoose.Types.ObjectId(req.userId);

    const stats = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$completed", count: { $sum: 1 } } },
    ]);

    let completed = 0,
      pending = 0;
    stats.forEach((s) => {
      if (s._id === true) completed = s.count;
      if (s._id === false) pending = s.count;
    });

    res.render("stats", {
      username: req.username || "User",
      completed,
      pending,
    });
  } catch (err) {
    console.error("Error generating stats:", err);
    res.status(500).send("Error generating stats");
  }
};
