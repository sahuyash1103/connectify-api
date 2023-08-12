const mongoose = require("mongoose");

const userScema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  about: String,
  skills: [String],
  education: [
    {
        institute: String,
        startYear: Number,
        endYear: Number,
        degree: String,
        about: String
    }
  ],
});

const User = mongoose.model("User", userScema);

module.exports = User;
