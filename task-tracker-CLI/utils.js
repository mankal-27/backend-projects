const path = require("path");
const fs = require("node:fs/promises");
const cliProgress = require("cli-progress");

const filePath = path.join(__dirname, "tasks.json");

//Function to read tasks from file asyncronously
const readTasks = async () => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

//saveTasks function to save tasks in file
const saveTasks = async (tasks) => {
  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  progressBar.start(1, 0); // Start progress bar
  try {
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf-8");
    progressBar.update(1); // Update progress bar to complete
    progressBar.stop(); // Stop progress bar
    console.log("Tasks saved successfully");
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
};

//Function to add new task with an increment id

const addTask = async (name, task) => {
  const tasks = await readTasks();

  const lastTaskId = tasks.length > 0 ? tasks[tasks.length - 1].id : 0;
  const newTask = {
    id: lastTaskId + 1,
    name: name,
    task: task,
    status: "pending",
  };

  tasks.push(newTask);
  await saveTasks(tasks);

  console.log("Task added successfully");
};

// Display all tasks
const displayTasks = async () => {
  const tasks = await readTasks();
  console.log("All Tasks:", tasks);
};

const updateTask = async (id, task) => {
  const tasks = await readTasks();
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      task: task,
    };
    await saveTasks(tasks);
    console.log("Task updated successfully");
  } else {
    console.log("Task not found");
  }
};

// Delete a task
const deleteTask = async (id) => {
  const tasks = await readTasks();
  const newTasks = tasks.filter((taskItem) => taskItem.id !== id);
  await saveTasks(newTasks);
  console.log("Task deleted successfully");
};

const markInProgress = async (id) => {
  const tasks = await readTasks();
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      status: "in-progress",
    };
    await saveTasks(tasks);
    console.log("Task updated successfully");
  } else {
    console.log("Task not found");
  }
};

// Mark a task as done
const markDone = async (id) => {
  const tasks = await readTasks();
  const index = tasks.findIndex((taskItem) => taskItem.id === id);
  if (index !== -1) {
    tasks[index].status = "done";
    await saveTasks(tasks);
    console.log("Task marked as done");
  } else {
    console.log("Task not found");
  }
};

// List tasks based on status
const listTasksByStatus = async (status) => {
  const tasks = await readTasks();
  const filteredTasks = tasks.filter((taskItem) => taskItem.status === status);
  console.log(
    `${status.charAt(0).toUpperCase() + status.slice(1)} Tasks:`,
    filteredTasks
  );
};

module.exports = {
  addTask: addTask,
  updateTask: updateTask,
  deleteTask: deleteTask,
  displayTasks: displayTasks,
  markInProgress: markInProgress,
  markDone: markDone,
  listTasksByStatus: listTasksByStatus,
};
