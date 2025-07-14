const { google } = require("googleapis");

module.exports = async function createSpreadsheet(auth, title) {
  const sheets = google.sheets({ version: "v4", auth });
  const { data } = await sheets.spreadsheets.create({
    resource: { properties: { title } },
    fields: "spreadsheetId",
  });
  return data.spreadsheetId;
};
