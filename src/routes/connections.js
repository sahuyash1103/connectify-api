const express = require("express");
const router = express.Router();
const User = require("../mongo/models");
const { auth } = require("../middlewares/authenticate");
const _ = require("lodash");

router.get("/all", auth, async (req, res) => {
  let users = await User.find({});

  res.json(users).status(200);
});

router.get("/my", auth, async (req, res) => {
  let user = User.findOne({ email: req.user.email });
  if (!user) return res.status(400).send("User not found.");

  res.json(user.connections).status(200);
});

router.put("/connect/", auth, async (req, res) => {
  let user = await User.findOne({ email: req.user.email });
  if (!user) return res.status(400).send("User not found.");

  const emailToConnect = req.body.emailToConnect;

  let userToConnect = await User.findOne({ email: emailToConnect });

  if (!userToConnect) return res.status(400).send("User not found.");

  if (emailToConnect === user.email)
    return res.status(400).send("You can't connect to yourself.");

  if (user.connections.includes(emailToConnect))
    return res.status(400).send("You are already connected to this user.");

  user.connections.push(emailToConnect);

  await User.updateOne(
    { email: user.email },
    { connections: user.connections }
  );

  user = await User.findOne({ email: req.user.email });

  res.json(user.connections).status(200);
});

router.delete("/disconnect/", auth, async (req, res) => {
  let user = await User.findOne({ email: req.user.email });
  if (!user) return res.status(400).send("User not found.");

  const emailToDisconnect = req.body.emailToDisconnect;

  let userToDisconnect = await User.findOne({ email: emailToDisconnect });

  if (!userToDisconnect) return res.status(400).send("User not found.");

  if (emailToDisconnect === user.email)
    return res.status(400).send("You can't connect to yourself.");

  if (!user.connections.includes(emailToDisconnect))
    return res.status(400).send("You are already disconnected to this user.");

  let index = user.connections.indexOf(emailToDisconnect);
  user.connections.splice(index, 1);

  await User.updateOne(
    { email: user.email },
    { connections: user.connections }
  );

  res.json(user.connections).status(200);
});

module.exports = router;
