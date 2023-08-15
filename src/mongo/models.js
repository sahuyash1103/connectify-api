const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../utilities/get_env");

const educationSchema = new mongoose.Schema({
  institute: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  startYear: {
    type: Number,
    required: true,
    minlength: 4,
    maxlength: 4,
  },
  endYear: {
    type: Number,
    required: true,
    minlength: 4,
    maxlength: 4,
  },
  degree: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: { type: String, required: true, minlength: 5, maxlength: 1024 },
  phone: { type: String, required: true, minlength: 10, maxlength: 10 },
  skills: { type: [String], required: false },
  about: { type: String, required: false, maxlength: 255 },
  education: {
    type: [educationSchema],
    required: false,
  },

  connections: {
    type: [String],
    required: false,
    ref: "Users",
  },
});

userSchema.methods.genrateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, phone: this.phone },
    JWT_PRIVATE_KEY,
    { expiresIn: "24h" }
  );
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
