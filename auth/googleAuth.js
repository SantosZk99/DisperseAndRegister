const fs = require("fs").promises;
const { google } = require("googleapis");
const { authenticate } = require("@google-cloud/local-auth");
const { TOKEN_PATH, CREDENTIALS_PATH } = require("../config/paths");
const SCOPES = require("../config/scopes");

async function loadToken() {
  try {
    const raw = await fs.readFile(TOKEN_PATH, "utf8");
    return google.auth.fromJSON(JSON.parse(raw));
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

module.exports = authorize;
