const path = require("path");

const ROOT = process.cwd(); // project root
const TOKEN_PATH = path.join(ROOT, "token.json");
const CREDENTIALS_PATH = path.join(ROOT, "test", "credentials.json");

module.exports = { TOKEN_PATH, CREDENTIALS_PATH };
