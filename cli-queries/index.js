const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

const startQuery = () => {
  const questions = ["test"];
  prompt(questions).then(/* ... */);
};

startQuery();
