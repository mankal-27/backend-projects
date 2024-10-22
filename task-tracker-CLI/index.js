const readline = require("node:readline");
const {
  addTask,
  updateTask,
  deleteTask,
  displayTasks,
  markInProgress,
  markDone,
  listTasksByStatus,
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

const getTaskDetails = async () => {
  const name = await askQuestion("Enter task name: ");
  const task = await askQuestion("Enter task: ");
  await addTask(name, task);
  await displayTasks();
};

const updateTaskDetails = async () => {
  await displayTasks();
  const id = await askQuestion("Enter task id: ");
  const task = await askQuestion("Update task: ");
  await updateTask(parseInt(id), task);
  await displayTasks();
};

const deleteTaskDetails = async () => {
  await displayTasks();
  const id = await askQuestion("Enter task id: ");
  await deleteTask(parseInt(id));
  await displayTasks();
};

const markTaskAsInProgress = async () => {
  await displayTasks();
  const id = await askQuestion("Enter task id: ");
  await markInProgress(parseInt(id));
  await displayTasks();
};

const markTaskAsDone = async () => {
  await displayTasks();
  const id = await askQuestion("Enter task id: ");
  await markDone(parseInt(id));
  await displayTasks();
};

const listTasks = async () => {
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
7: Exit
`);

    switch (input) {
      case "1":
        await getTaskDetails();
        break;
      case "2":
        await updateTaskDetails();
        break;
      case "3":
        await deleteTaskDetails();
        break;
      case "4":
        await markTaskAsInProgress();
        break;
      case "5":
        await markTaskAsDone();
        break;
      case "6":
        await listTasks();
        break;
      case "7":
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
