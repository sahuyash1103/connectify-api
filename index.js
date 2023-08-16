//-------------------------IMPORTS
const express = require("express");
const cors = require("cors");

const loginRouter = require("./src/routes/login");
const signupRouter = require("./src/routes/signup");
const connectionsRouter = require("./src/routes/connections");
const profileRouter = require("./src/routes/profile");

const { PORT } = require("./src/utilities/get_env");
const { initRedis } = require("./src/utilities/redis");
const { checkEnvironmentVariable } = require("./src/utilities/check_env_var");
const { initMongo } = require("./src/mongo/mongo");

// -----------------------------------REDIS CONNECTION
initRedis();

//-----------------------------------CHECKING ENV VARIABLES
checkEnvironmentVariable();

// -------------------------MIDDLEWARES
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(header);

// -------------------------CORS
app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
    exposedHeaders: "*",
  })
);

// -------------------------ROUTES
app.use("/api/auth/login/", loginRouter);
app.use("/api/auth/signup/", signupRouter);
app.use("/api/connections/", connectionsRouter);
app.use("/api/profile/", profileRouter);

// -------------------------MONGO DB CONNECTION
initMongo();

// -------------------------API CONNECTION CHECK
app.get("/", (req, res) => {
  res.send("connectify api is runing...").status(200);
});

app.get("/api/", (req, res) => {
  res.send("connectify api is runing...").status(200);
});

// -------------------------PORT LISTENING
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
