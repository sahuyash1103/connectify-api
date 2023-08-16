const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../mongo/models");
const router = express.Router();
const { validateLoginData } = require("../utilities/validators");
const _ = require("lodash");

router.post("/", async (req, res) => {
  const error = await validateLoginData(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.genrateAuthToken();
  res
    .header("x-auth-token", token)
    .json(
      _.pick(user, ["name", "email", "phone", "skills", "education", "about"])
    )
    .status(200);
});

module.exports = router;
