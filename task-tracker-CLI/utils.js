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

const addTask = async (task) => {
  const tasks = await readTasks();

  const lastTaskId = tasks.length > 0 ? tasks[tasks.length - 1].id : 0;
  const newTask = {
    id: lastTaskId + 1,
    task: task,
    createdAt: new Date().toISOString(), // Add createdAt timestamp
    updatedAt: new Date().toISOString(), // Add updatedAt timestamp (same as createdAt initially)
    status: "pending"
  };

  tasks.push(newTask);
  await saveTasks(tasks);

  console.log("Task added successfully");
};

// Display all tasks
const displayTasks = async () => {
  const tasks = await readTasks();
  
  const formattedTasks = tasks.map(({ id, task, createdAt, updatedAt, status }) => ({
    ID: id,
    Task: task,
    CreatedAt: new Date(createdAt).toLocaleString(), // Format the date
    UpdatedAt: new Date(updatedAt).toLocaleString(), // Format the date
    Status: status,
  }));

  console.table(formattedTasks); // Display the tasks in table format
};


const updateTask = async (id, task) => {
  const tasks = await readTasks();
  const index = tasks.findIndex((taskItem) => taskItem.id === id);

  if (index !== -1) {
    tasks[index].task = task;
    tasks[index].updatedAt = new Date().toISOString(); // Update the updatedAt timestamp
    await saveTasks(tasks);
    console.log('Task updated successfully');
  } else {
    console.log('Task not found');
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

    if (filteredTasks.length > 0) {
        // Format the filtered tasks for display
        const formattedTasks = filteredTasks.map(({ id, task,status, createdAt, updatedAt }) => ({
            ID: id,
            Task: task,
            CreatedAt: new Date(createdAt).toLocaleString(), // Format the date
            UpdatedAt: new Date(updatedAt).toLocaleString(), // Format the date
            Status: status,
        }));

        console.log(
            `${status.charAt(0).toUpperCase() + status.slice(1)} Tasks:`
        );
        console.table(formattedTasks); // Display the filtered tasks in table format
    } else {
        console.log(`No tasks found with status: ${status}`);
    }
};

async function commonlyUsedFunctions(taskCall) {
  await displayTasks();
  const id = await askQuestion("Enter task id: ");
  await taskCall(parseInt(id));
  await displayTasks();
}

module.exports = {
  addTask: addTask,
  updateTask: updateTask,
  deleteTask: deleteTask,
  displayTasks: displayTasks,
  markInProgress: markInProgress,
  markDone: markDone,
  listTasksByStatus: listTasksByStatus,
  commonlyUsedFunctions: commonlyUsedFunctions
};
