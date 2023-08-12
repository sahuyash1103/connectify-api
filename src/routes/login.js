const express = require("express");
const bcrypt = require("bcrypt");
const joi = require("joi");
const _ = require("lodash");
const { getORsetRedis } = require("../utilities/redis");
const User = require("../mongo/models");
const router = express.Router();

router.post("/", async (req, res) => {
  const error = await validateLoginBody(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await getORsetRedis(req.body.email, () => {
    return User.findOne({ email: req.body.email });
  });

  user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.genrateAuthToken();
  res
    .header("x-auth-token", token)
    .json(_.pick(user, ["name", "email", "phone", "skills", "education"]))
    .status(200);
});

async function validateLoginBody(user) {
  maxYear = new Date().getFullYear();

  const schema = joi.object({
    email: joi.string().min(10).max(255).required().email(),
    password: joi.string().min(8).max(255).required(),
  });

  try {
    await schema.validateAsync(user);
  } catch (err) {
    return err;
  }
}

module.exports = router;
