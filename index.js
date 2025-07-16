const authorize = require("./auth/googleAuth");
const readSample = require("./sheets/read");
const createSheet = require("./sheets/create");
const writeData = require("./sheets/write");
const getValues = require("./sheets/getValues");

(async () => {
  const auth = await authorize();

  const rows = await readSample(auth);
  console.log(`Fetched ${rows.length} demo rows.`);

  const newId = await createSheet(auth, "Test read");
  console.log("Created spreadsheet:", newId);

  await writeData(auth, newId, rows);
  console.log("Data written successfully!");

  const data = await getValues(auth, newId, "A1:A20");
  console.log("First 20 rows:", data);
})().catch(console.error);
