const express = require("express");
const router = express.Router();
const User = require("../mongo/models");
const { auth } = require("../middlewares/authenticate");
const { updateUserData, getUserData } = require("../utilities/redis-service");
const _ = require("lodash");

router.get("/all", auth, async (req, res) => {
  let users = await User.find({});
  res.json([...users]).status(200);
});

router.get("/my", auth, async (req, res) => {
  let result = await getUserData(req.user.email);

  if (result.error) return res.status(400).send("error from server side");

  let user = result.data;
  if (!user) return res.status(400).send("User not found.");

  res.json([...user?.connections]).status(200);
});

router.put("/connect/", auth, async (req, res) => {
  let result = await getUserData(req.user.email);

  if (result.error) return res.status(400).send("error from server side");

  let user = result.data;
  if (!user) return res.status(400).send("User not found.");

  const emailToConnect = req.body.emailToConnect;

  if (emailToConnect === user.email)
    return res.status(400).send("You can't connect to yourself.");

  if (user.connections.includes(emailToConnect))
    return res.status(400).send("You are already connected to this user.");

  result = await getUserData(emailToConnect);

  if (result.error) return res.status(400).send("error from server side");

  let userToConnect = result.data;

  if (!userToConnect) return res.status(400).send("User not found.");

  user.connections.push(emailToConnect);

  await updateUserData(user.email,
    { connections: user.connections }
  );

  res.json([...user?.connections]).status(200);
});

router.delete("/disconnect/", auth, async (req, res) => {
  let result = await getUserData(req.user.email);

  if (result.error) return res.status(400).send("error from server side");

  let user = result.data;
  if (!user) return res.status(400).send("User not found.");

  const emailToDisconnect = req.body.emailToDisconnect;

  if (emailToDisconnect === user.email)
    return res.status(400).send("You can't diconnect to yourself.");

  if (!user.connections.includes(emailToDisconnect))
    return res.status(400).send("You are already disconnected to this user.");

  result = await getUserData(emailToDisconnect);

  if (result.error) return res.status(400).send("error from server side");

  let userToDisconnect = result.data;

  if (!userToDisconnect) return res.status(400).send("User not found.");

  let index = user.connections.indexOf(emailToDisconnect);
  user.connections.splice(index, 1);

  await updateUserData(user.email,
    { connections: user.connections }
  );

  res.json([...user?.connections]).status(200);
});

module.exports = router;
