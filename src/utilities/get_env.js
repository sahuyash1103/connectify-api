require("dotenv").config();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const REDIS_URI = process.env.REDIS_URI;
const REDIS_EXP_TIME = process.env.REDIS_EXP_TIME || 60*2;

module.exports = { PORT, MONGO_URI, JWT_PRIVATE_KEY, REDIS_URI, REDIS_EXP_TIME };
