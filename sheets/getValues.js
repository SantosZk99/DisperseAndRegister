const { google } = require("googleapis");

module.exports = async function getValues(auth, spreadsheetId, range) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const numRows = res.data.values ? res.data.values.length : 0;
  console.log(`${numRows} rows retrieved.`);
  return res.data;
};
