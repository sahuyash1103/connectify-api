const express = require("express");
const router = express.Router();
const User = require("../mongo/models");
const { getORsetRedis, setExRedis } = require("../utilities/redis");
const { auth } = require("../middlewares/authenticate");

router.get("/", auth, async (req, res) => {
  let user = await getORsetRedis(req.user.email, () => {
    return User.findOne({ email: req.user.email });
  });

  res.json(user).status(200);
});

router.put("/update", auth, async (req, res) => {
  const error = validateUpdateBody(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await getORsetRedis(req.user.email, () => {
    return User.findOne({ email: req.user.email });
  });

  const toUpdate = req.body;

  await User.updateOne({ email: req.user.email }, toUpdate);

  user = await User.findOne({ email: req.user.email });
  user.setRedis();

  res.json(user).status(200);
});

async function validateUpdateBody(user) {
  maxYear = new Date().getFullYear();

  const schema = joi.object({
    name: joi.string().min(3).max(50),
    email: joi.string().min(10).max(255).email(),
    password: joi.string().min(8).max(255),
    phone: joi.string().min(10).max(10),
    skills: joi.array().items(joi.string().min(3).max(10)),
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
    await schema.validateAsync(user);
  } catch (err) {
    return err;
  }
}

module.exports = router;
