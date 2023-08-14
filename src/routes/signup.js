// ---------------------------------IMPORTS
const express = require("express");
const joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { getORsetRedis } = require("../utilities/redis");

const User = require("../mongo/models");
const router = express.Router();

router.post("/", async (req, res) => {
  const error = await validateSignupBody(req.body);
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
    .json(_.pick(user, ["name", "email", "phone", "skills", "education", "about"]))
    .status(200);
});

async function validateSignupBody(user) {
  maxYear = new Date().getFullYear();

  const schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().min(10).max(255).required().email(),
    password: joi.string().min(8).max(255).required(),
    phone: joi.string().min(10).max(10).required(),
    about: joi.string().min(3).max(255),
    skills: joi.array().items(joi.string().min(3).max(10)),
    education: joi.array().items(
      joi.object({
        institute: joi.string().min(3).max(50).required(),
        startYear: joi.number().min(1900).max(maxYear).required(),
        endYear: joi.number().min(1900).max(maxYear).required(),
        degree: joi.string().min(3).max(50).required(),
      })
    ),
  });

  try {
    await schema.validateAsync(user);
  } catch (err) {
    return err;
  }
}

module.exports = router;
