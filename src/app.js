//-------------------------IMPORTS
const express = require("express");
const cors = require("cors");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const myConnectionsRouter = require("./routes/my_connections");
const mongoose = require("mongoose");
const { PORT, MONGO_URI, JWT_PRIVATE_KEY } = require("./utilities/get_env");

//-----------------------------------CHECKING ENV VARIABLES
if (!JWT_PRIVATE_KEY) {
  console.log("FATAL ERROR: jwtPrivate key is not defined.");
  process.exit(1);
}

if (!MONGO_URI) {
  console.log("FATAL ERROR: mongo url is not defined.");
  process.exit(1);
}

// -------------------------MIDDLEWARES
const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/auth/login", loginRouter);
app.use("/api/auth/signup", signupRouter);
app.use("/api/myConnections", myConnectionsRouter);

// -------------------------MONGO DB CONNECTION
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to mongoDB..."))
  .catch((err) => console.log(`Error while connecting to mongoDB: ${err}`));


// -------------------------API CONNECTION CHECK
app.get("/api/", (req, res) => {
  res.send("connecto api is working fine").status(200);
  // console.log("connection check");
});

// -------------------------PORT LISTENING
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
