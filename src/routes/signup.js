// ---------------------------------IMPORTS
const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { getORsetRedis } = require("../utilities/redis");
const { validateSignupData } = require("../utilities/validators");
const User = require("../mongo/models");
const router = express.Router();

router.post("/", async (req, res) => {
  const error = await validateSignupData(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await getORsetRedis(req.body.email, () => {
    return User.findOne({ email: req.body.email });
  });

  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    skills: req.body.skills,
    education: req.body.education,
  });

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(req.body.password, salt);

  await user.save();

  const token = user.genrateAuthToken();
  res
    .header("x-auth-token", token)
    .json(
      _.pick(user, ["name", "email", "phone", "skills", "education", "about"])
    )
    .status(200);
});

module.exports = router;
