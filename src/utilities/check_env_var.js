const { JWT_PRIVATE_KEY, MONGO_URI } = require("./get_env");

function checkEnvironmentVariable() {
  if (!JWT_PRIVATE_KEY) {
    console.log("FATAL ERROR: jwtPrivate key is not defined.");
    return "FATAL ERROR: jwtPrivate key is not defined."
  }

  if (!MONGO_URI) {
    console.log("FATAL ERROR: mongo url is not defined.");
    return "FATAL ERROR: mongo url is not defined."
  }
}

module.exports = { checkEnvironmentVariable };
