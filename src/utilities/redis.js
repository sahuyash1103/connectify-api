const redis = require("redis");

const { REDIS_URI, REDIS_EXP_TIME } = require("./get_env");
const User = require("../mongo/models");

const redisClient = redis.createClient(REDIS_URI);

function initRedis() {
  redisClient.connect();
  redisClient.on("connect", () => {
    console.log("Connected to redis...");
  });
}

function getORsetRedis(key, cb) {
  if (!redisClient) return cb();
  return new Promise(async (resolve, reject) => {
    let value = await redisClient.get(key);

    // ! redis is not working
    if (value != null) {
      return resolve(User(JSON.parse(value)));
    }

    const newData = await cb();
    redisClient.setEx(key, REDIS_EXP_TIME, JSON.stringify(newData));
    return resolve(newData);
  });
}

function setExRedis(key, value, time) {
  if (!redisClient) return;
  redisClient.setEx(key, time || REDIS_EXP_TIME, JSON.stringify(value));
  console.log("redis set");
}

function getExRedis(key) {
  if (!redisClient) return;
  return JSON.parse(redisClient.get(key));
}

module.exports = { getORsetRedis, initRedis, setExRedis, getExRedis, redisClient };
