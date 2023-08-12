const { JWT_PRIVATE_KEY, MONGO_URI } = process.env;

function checkEnvironmentVariable() {
  if (!JWT_PRIVATE_KEY) {
    console.log("FATAL ERROR: jwtPrivate key is not defined.");
    process.exit(1);
  }

  if (!MONGO_URI) {
    console.log("FATAL ERROR: mongo url is not defined.");
    process.exit(1);
  }
}

module.exports = { checkEnvironmentVariable };
