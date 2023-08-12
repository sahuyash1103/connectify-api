const redis = require("redis");

const { REDIS_URI, REDIS_EXP_TIME } = require("./get_env");

const redisClient = redis.createClient(REDIS_URI);

function getORsetRedis(key, cb) {
  if (!redisClient) return cb();
  return new Promise(async (resolve, reject) => {
    let value = await redisClient.get(key);

    if (value) {
      return resolve(JSON.parse(value));
    }

    const newData = await cb();
    redisClient.setEx(key, REDIS_EXP_TIME, JSON.stringify(newData));
    return resolve(newData);
  });
}

function initRedis() {
  redisClient.connect();
  redisClient.on("connect", () => {
    console.log("Connected to redis...");
  });
}

module.exports = { getORsetRedis, initRedis };
