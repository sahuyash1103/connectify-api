//-------------------------IMPORTS
const express = require("express");
const cors = require("cors");

const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const connectionsRouter = require("./routes/connections");
const profileRouter = require("./routes/profile");

const { PORT } = require("./utilities/get_env");
const { initRedis } = require("./utilities/redis");
const { checkEnvironmentVariable } = require("./utilities/check_env_var");
const { initMongo } = require("./mongo/mongo");

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
app.get("/api/", (req, res) => {
  res.send("connectify api is working fine").status(200);
});

// -------------------------PORT LISTENING
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
