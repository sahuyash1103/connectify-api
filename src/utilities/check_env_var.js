const { JWT_PRIVATE_KEY, MONGO_URI } = require("./get_env");

function checkEnvironmentVariable() {
  if (!JWT_PRIVATE_KEY) {
    console.log("ERROR: jwtPrivate key is not defined.");
    return "ERROR: jwtPrivate key is not defined."
  }

  if (!MONGO_URI) {
    console.log("ERROR: mongo url is not defined.");
    return "ERROR: mongo url is not defined."
  }
}

module.exports = { checkEnvironmentVariable };
