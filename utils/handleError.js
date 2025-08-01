const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authorize } = require("../auth");

const tokenFilePath = path.join(process.cwd(), "/tokens/token.json");
console.log("token path", tokenFilePath);

const handleError = (error, retry) => {
  console.log("Handling Error...");
  console.log(error.response);

  try {
    if (
      error.response.data.error_description ===
        "Token has been expired or revoked." ||
      error.response.data.error_description === "Bad Request"
    ) {
      console.log("Invalid Token: Expired or revoked.");

      fs.unlink(tokenFilePath, (error) => {
        if (error) {
          console.error("Error Deleting Auth Token");
        } else {
          console.log("Auth Token Deleted");
          authorize();
          retry();
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleError };
