require("dotenv").config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

module.exports = { PORT, MONGO_URI, JWT_PRIVATE_KEY };
