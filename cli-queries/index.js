const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

const startQuery = () => {
  const sheetOptions = ["create sheet", "update sheet", "sed funds"];
  const initialOptions = ["create sheet", "update sheet", "send funds"];

  prompt({
    type: "list",
    name: "Sheet Selection",
    message: "What sheet do you want to edit?",
    choices: ["Mars", "Oh Henry", "Hershey"],
  }).then(() => {
    prompt({
      type: "list",
      name: "beverage",
      message: "And your favorite beverage?",
      choices: ["Pepsi", "Coke", "7up", "Mountain Dew", "Red Bull"],
    });
  });
};

startQuery();
