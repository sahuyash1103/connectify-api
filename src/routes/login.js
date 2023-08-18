const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { validateLoginData } = require("../utilities/validators");
const { getUserData } = require("../utilities/redis-service");
const _ = require("lodash");

router.post("/", async (req, res) => {
  const error = await validateLoginData(req.body);
  if (error) return res.status(401).send(error.details[0].message);

  let result = await getUserData(req.body.email);

  if (result.error) return res.status(500).send(result.error);

  user = result.data;
  if (!user) return res.status(401).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(401).send("Invalid email or password.");

  const token = user.genrateAuthToken();
  res
    .header("x-auth-token", token)
    .json(
      _.pick(user, ["name", "email", "phone", "skills", "education", "about"])
    )
    .status(200);
});

module.exports = router;
