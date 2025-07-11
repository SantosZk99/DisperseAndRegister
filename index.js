/**
 * index.js — read, create, and write to Google Sheets
 *
 *  pnpm add @google-cloud/local-auth googleapis
 *  Place credentials.json (Desktop-app OAuth) alongside this file.
 */

const fs = require("fs").promises;
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// ---------- paths ---------- //
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

// ---------- scopes ---------- //
// One combined scope is simpler: full Sheets access
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// ---------- auth helpers ---------- //
async function loadToken() {
  try {
    return google.auth.fromJSON(
      JSON.parse(await fs.readFile(TOKEN_PATH, "utf8"))
    );
  } catch {
    return null;
  }
}

async function saveToken(oAuthClient) {
  const { installed } = JSON.parse(await fs.readFile(CREDENTIALS_PATH, "utf8"));
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: installed.client_id,
    client_secret: installed.client_secret,
    refresh_token: oAuthClient.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadToken();
  if (client) return client;
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) await saveToken(client);
  return client;
}

// ---------- Sheets helpers ---------- //
async function readSample(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    range: "Class Data!A2:E",
  });
  return data.values ?? [];
}

async function createSpreadsheet(auth, title) {
  const sheets = google.sheets({ version: "v4", auth });
  const { data } = await sheets.spreadsheets.create({
    resource: { properties: { title } },
    fields: "spreadsheetId",
  });
  return data.spreadsheetId;
}

async function writeData(auth, spreadsheetId, rows) {
  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Sheet1!A1", // top-left corner of destination
    valueInputOption: "RAW",
    requestBody: { values: rows }, // rows is an array of arrays
  });
}

/**
 * Gets cell values from a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The sheet range.
 * @return {obj} spreadsheet information
 */
async function getValues(auth, spreadsheetId, range) {
  //   const { GoogleAuth } = require("google-auth-library");
  //   const { google } = require("googleapis");

  //   const auth = new GoogleAuth({
  //     scopes: "https://www.googleapis.com/auth/spreadsheets",
  //   });

  const service = google.sheets({ version: "v4", auth });
  try {
    const result = await service.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const numRows = result.data.values ? result.data.values.length : 0;
    console.log(`${numRows} rows retrieved.`);
    return result;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
// ---------- run ---------- //
(async () => {
  const auth = await authorize();

  // 1. Read rows from public sample
  const rows = await readSample(auth);
  console.log(`Fetched ${rows.length} rows from sample sheet.`);

  // 2. Create a new spreadsheet
  const newId = await createSpreadsheet(auth, "Test read");

  console.log("Created spreadsheet:", newId);

  // 3. Write the rows into the new spreadsheet
  await writeData(auth, newId, rows);
  console.log("Data written successfully!");

  const val = await getValues(auth, newId, "A1:A20");
  console.log("those are the values", val.data);
})().catch(console.error);
