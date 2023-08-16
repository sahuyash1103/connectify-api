const express = require("express");
const router = express.Router();
const User = require("../mongo/models");
const { getORsetRedis, setExRedis } = require("../utilities/redis");
const { auth } = require("../middlewares/authenticate");
const { validateUserUpdateData } = require("../utilities/validators");
const _ = require("lodash");

router.get("/", auth, async (req, res) => {
  let user = await getORsetRedis(req.user.email, () => {
    return User.findOne({ email: req.user.email });
  });

  res
    .json(
      _.pick(user, ["name", "email", "phone", "skills", "education", "about"])
    )
    .status(200);
});

router.put("/update", auth, async (req, res) => {
  const error = await validateUserUpdateData(req.body);
  if (error) return res.status(400).send(error);

  const toUpdate = req.body;

  await User.updateOne({ email: req.user.email }, toUpdate);

  let user = await User.findOne({ email: req.user.email });
  setExRedis(user.email, user);

  res
    .json(
      _.pick(user, ["name", "email", "phone", "skills", "education", "about"])
    )
    .status(200);
});

module.exports = router;
