require("dotenv").config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const REDIS_CLOUD_PASSWORD = process.env.REDIS_CLOUD_PASSWORD;
const REDIS_URL = process.env.REDIS_URL;
const IS_REDIS_CLOUD = process.env.IS_REDIS_CLOUD;
const REDIS_EXP_TIME = process.env.REDIS_EXP_TIME || 60 * 10; //IN SEC*NUMBER OF MIN

module.exports = { PORT, MONGO_URI, JWT_PRIVATE_KEY, REDIS_EXP_TIME, REDIS_CLOUD_PASSWORD, REDIS_URL, IS_REDIS_CLOUD };
