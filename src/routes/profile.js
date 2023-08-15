const express = require("express");
const router = express.Router();
const User = require("../mongo/models");
const { getORsetRedis, setExRedis } = require("../utilities/redis");
const { auth } = require("../middlewares/authenticate");
const joi = require("joi");
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

async function validateUserUpdateData(dataToUpdate) {
  let maxYear = new Date().getFullYear();

  const schema = joi.object({
    name: joi.string().min(3).max(50),
    email: joi.string().min(10).max(255).email(),
    password: joi.string().min(8).max(255),
    phone: joi.string().min(10).max(10),
    skills: joi.array().items(joi.string().min(3).max(10)),
    about: joi.string().max(255),
    education: joi.array().items(
      joi.object({
        institute: joi.string().min(3).max(50),
        startYear: joi.number().min(1900).max(maxYear),
        endYear: joi.number().min(1900).max(maxYear),
        degree: joi.string().min(3).max(50),
      })
    ),
  });

  try {
    await schema.validateAsync(dataToUpdate);
  } catch (err) {
    return err;
  }
}

module.exports = router;
