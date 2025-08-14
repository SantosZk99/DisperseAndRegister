const { authorize } = require("../auth/index.js");
const { google } = require("googleapis");

/**
 * Create a google spreadsheet
 * @param {string} title Spreadsheets title
 * @return {string} Created spreadsheets ID
 */
const createSheet = async (title) => {
  const auth = await authorize();

  const service = google.sheets({ version: "v4", auth });

  const resource = {
    properties: {
      title,
    },
  };

  try {
    const spreadsheet = await service.spreadsheets.create({
      resource,
      fields: "spreadsheetId",
    });

    console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
    return spreadsheet.data.spreadsheetId;
  } catch (err) {
    throw err;
  }
};

module.exports = { createSheet };
