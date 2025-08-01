const { google } = require("googleapis");
const { authorize } = require("./auth");
const path = require("path");
const { auth } = require("google-auth-library");

const fs = require("fs").promises;

// Utils imports
const { handleError } = require("./utils/handleError");

const initAuth = async () => {
  try {
    return await authorize();
  } catch (error) {
    console.error("init auth error", error);
  }
};


/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listMajors(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    range: "Class Data!A2:E",
  });
  const rows = res.data.values;

  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }

  console.log("Name, Major:");

  rows.forEach((row) => {
    // Print columns A and E, which correspond to indices 0 and 4.
    console.log(`${row[0]}, ${row[4]}`);
  });
}

const readData = async () => {
  try {
    const auth = await initAuth();

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      range: "Class Data!A1:F5",

    });
console.log("this is res")
console.log("after res")
	console.log(res.data.values);

  } catch (error) {
    handleError(error, readData);
  }
};

const writeData = async () => {
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.create({
     spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  });

  console.log(res.data.values);
};

/**
 * Create a google spreadsheet
 * @param {string} title Spreadsheets title
 * @return {string} Created spreadsheets ID
 */
async function create(title) {
  const { google } = require("googleapis");
 const auth = await initAuth();
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
    const sheetData = { name: title, id: spreadsheet.data.spreadsheetId };

    await fs.writeFile(
      path.join(process.cwd(), `${title}.json`),
      JSON.stringify(sheetData, null, 2)
    );

    return spreadsheet.data.spreadsheetId;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}

initAuth();
// readData();
writeData();
// create("Registry 5");
// authorize().then(listMajors).catch(console.error);




