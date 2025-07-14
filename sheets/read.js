const { google } = require("googleapis");

module.exports = async function readSample(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    range: "Class Data!A2:E",
  });
  return data.values ?? [];
};
