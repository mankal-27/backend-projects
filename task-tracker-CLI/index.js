const readline = require("node:readline");
const {
  addTask,
  updateTask,
  deleteTask,
  displayTasks,
  markInProgress,
  markDone,
  listTasksByStatus,
  commonlyUsedFunctions,
} = require("./utils");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const createTask = async () => {
  const task = await askQuestion("Enter task: ");
  await addTask(task);
  await displayTasks();
};

const updateTaskDetails = async () => {
  await displayTasks();
  const id = await askQuestion("Enter task id: ");
  const task = await askQuestion("Update task: ");
  await updateTask(parseInt(id), task);
  await displayTasks();
};

const listTasksWithStatus = async () => {
  const status = await askQuestion(
    "Enter status to list (pending, in progress, done): "
  );
  await listTasksByStatus(status);
};

const main = async () => {
  while (true) {
    const input = await askQuestion(`
Choose an option:
1: Add task
2: Update task
3: Delete task
4: Mark task as in progress
5: Mark task as done
6: List tasks by status
7: Display tasks
8: Exit
`);

    switch (input) {
      case "1":
        await createTask(); // Add Task
        break;
      case "2":
        await updateTaskDetails(); // Update Task
        break;
      case "3":
        await commonlyUsedFunctions(deleteTask); // Delete Task
        break;
      case "4":
        await commonlyUsedFunctions(markInProgress); // Mark in progress
        break;
      case "5":
        await commonlyUsedFunctions(markDone); // Mark done
        break;
      case "6":
        await listTasksWithStatus(); // List tasks by status
        break;
      case "7":
        await displayTasks(); // Display tasks
        break;
      case "8":
        console.log("Exiting...");
        rl.close();
        return; // Exit the loop and function
      default:
        console.log("Invalid input. Please try again.");
        break;
    }
  }
};

main();
