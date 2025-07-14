#!/usr/bin/env node
const authorize = require("./auth/googleAuth");
const readSample = require("./sheets/read");
const createSheet = require("./sheets/create");
const writeData = require("./sheets/write");
const getValues = require("./sheets/getValues");

(async () => {
  const auth = await authorize();

  // 1. pull rows from public demo sheet
  const rows = await readSample(auth);
  console.log(`Fetched ${rows.length} demo rows.`);

  // 2. create a new sheet
  const newId = await createSheet(auth, "Test read");
  console.log("Created spreadsheet:", newId);

  // 3. write the demo rows
  await writeData(auth, newId, rows);
  console.log("Data written successfully!");

  // 4. verify
  const data = await getValues(auth, newId, "A1:A20");
  console.log("First 20 rows:", data);
})().catch(console.error);
