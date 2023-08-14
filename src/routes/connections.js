const express = require("express");
const router = express.Router();
const User = require("../mongo/models");
const { getORsetRedis } = require("../utilities/redis");
const { auth } = require("../middlewares/authenticate");
const { setExRedis } = require("../utilities/redis");
const _ = require("lodash");

router.get("/all", auth, async (req, res) => {
  let users = await User.find({});

  res.json(users).status(200);
});

router.get("/my", auth, async (req, res) => {
  let user = await getORsetRedis(req.user.email, () => {
    return User.findOne({ email: req.user.email });
  });
  let connections = [];
  user.connections.map(async (email) => {
    let connection = await getORsetRedis(email, () => {
      return User.findOne({ email: email });
    });
    // ! connections are not showing up in time
    console.log(connection);
    connections.push(connection);
  });

  console.log("CONNECTIONS", connections);
  res.json(user.connections).status(200);
});

router.put("/connect/", auth, async (req, res) => {
  let user = await getORsetRedis(req.user.email, () => {
    return User.findOne({ email: req.user.email });
  });

  const emailToConnect = req.body.emailToConnect;

  let userToConnect = await getORsetRedis(emailToConnect, () => {
    return User.findOne({ email: emailToConnect });
  });

  if (!userToConnect) return res.status(400).send("User not found.");

  if (userToConnect.email === user.email)
    return res.status(400).send("You can't connect to yourself.");

  if (user.connections.includes(userToConnect.email))
    return res.status(400).send("You are already connected to this user.");

  user.connections.push(userToConnect.email);

  await user.save();
  user.setRedis();

  res.json(user.connections).status(200);
});

module.exports = router;
