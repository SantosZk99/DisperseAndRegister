const inquirer = require("inquirer");
const { createSheet } = require("../sheet-create/index.js");

const prompt = inquirer.createPromptModule();
const startQuery = () => {
  const sheetOptions = ["create sheet", "update sheet", "send funds"];
  const initialOptions = ["create sheet", "update sheet", "send funds"];
  let bufferName;
  prompt({
    type: "input",
    name: "sheet_name",
    message: "Choose a name for your sheet",
  })
    .then((name) => {
      prompt({
        type: "input",
        name: "name",
        message: `Confirm name == ${name.sheet_name} == for sheet`,
      });
      bufferName = name.sheet_name;
    })
    .then((name) => {
      createSheet(bufferName);
    });
};

startQuery();
