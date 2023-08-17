const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authenticate");
const { validateUserUpdateData } = require("../utilities/validators");
const { getUserData, updateUserData } = require("../utilities/redis-service");
const _ = require("lodash");

router.get("/", auth, async (req, res) => {
  let result = await getUserData(req.user.email);

  if (result.error) return res.status(400).send("error from server side");

  let user = result.data;
  res
    .json(
      _.pick(user, ["name", "email", "phone", "skills", "education", "about"])
    )
    .status(200);
});

router.put("/update", auth, async (req, res) => {
  const error = await validateUserUpdateData(req.body);
  if (error) return res.status(400).send(error);

  const toUpdate = _.pick(req.body, ["name", "phone", "skills", "education", "about"]);
  await updateUserData(req.user.email, toUpdate);

  let result = await getUserData(req.user.email);

  if (result.error) return res.status(400).send("error from server side");

  let user = result.data;
  res
    .json(
      _.pick(user, ["name", "email", "phone", "skills", "education", "about"])
    )
    .status(200);
});

module.exports = router;
