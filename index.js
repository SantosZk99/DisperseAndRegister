const { google } = require("googleapis");
const { authorize } = require("./auth");
const path = require("path");

const fs = require("fs").promises;

// Utils imports
const { handleError } = require("./utils/handleError");

const readData = async () => {
  try {
    const auth = await authorize();

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      range: "Class Data!A1:F5",
    });

    console.log("this is res");
    console.log("after res");
    console.log(res.data.values);
  } catch (error) {
    handleError(error, readData);
  }
};

/*
 * updateSheet
 * Updates the Spreadsheet title. Finds and replaces a string in the sheets.
 * @param {string} spreadsheetId The Spreadsheet to update
 * @param {string} title The new Spreadsheet title
 * @param {string} find The text to find
 * @param {string} replacement The text to replace @return {obj} holding the information regarding the replacement of strings */

async function updateSheet(spreadsheetId, title, find, replacement) {
  const { google } = require("googleapis");

  const auth = await authorize();

  const service = google.sheets({ version: "v4", auth });
  const requests = [];

  // Change the spreadsheet's title.
  requests.push({
    updateSpreadsheetProperties: {
      properties: {
        title,
      },
      fields: "title",
    },
  });

  // Find and replace text.
  requests.push({
    findReplace: {
      find,
      replacement,
      allSheets: true,
    },
  });
  // Add additional requests (operations) ...
  const batchUpdateRequest = { requests };

  try {
    const response = await service.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: batchUpdateRequest,
    });
    const findReplaceResponse = response.data.replies[1].findReplace;
    console.log(`${findReplaceResponse.occurrencesChanged} replacements made.`);
    return response;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}

/*
 * appendValues
 * Batch Updates values in a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The range of values to update.
 * @param {object} valueInputOption Value update options.
 * @param {(string[])[]} _values A 2d array of values to update.
 * @return {obj} spreadsheet information
 */
async function appendValues(spreadsheetId, range, valueInputOption, values) {
  const { GoogleAuth } = require("google-auth-library");
  const { google } = require("googleapis");

  const auth = await authorize();

  const service = google.sheets({ version: "v4", auth });

  try {
    const result = await service.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      resource: {
        values,
      },
    });

    console.log("cells updated.", result.config.data);
    console.log("cells.", result.data.updates);
    return result;
  } catch (err) {
    console.error("appendValues", err);
    throw err;
  }
}

// readData();
// create("FreshSheet");

// updateSheet(
//"1ayibLD7MVoiOQUMdCiyGl5ObarsIYGzx57umUWH3HG0",
//"RegistryNew",
//"test",
//"this is a test",
//
//);

appendValues("1ayibLD7MVoiOQUMdCiyGl5ObarsIYGzx57umUWH3HG0", "A:A", "RAW", [
  [23, "new"],
  [23, "test"],
  [23, "work"],
  [23, "tuxedok"],
]);
//
//
//
//
//
// .
