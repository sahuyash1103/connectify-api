const User = require("../mongo/models");
const { createClient } = require("redis");
const { REDIS_EXP_TIME, REDIS_URL } = require("./get_env");

const redisClient = createClient({ url: REDIS_URL });

async function initRedis() {
    redisClient.on('error', err => console.log('Redis Client Error: ', err));
    redisClient.on('connect', () => {
        if (REDIS_URL)
            console.log('connected to Redis Server...[CLOUD]');
        else
            console.log('connected to Redis Server... [LOCAL]');
    })
    redisClient.on('disconnect', () => console.log('disconnected to Redis Server...'))

    await redisClient.connect();
}


const getKey = async (key) => {
    const value = await redisClient.get(key);
    return JSON.parse(value);
}

const setExKey = async (key, value) => {
    await deleteKey(key);
    const res = await redisClient.setEx(key, REDIS_EXP_TIME, JSON.stringify(value));
    return res;
}

const deleteKey = async (key) => {
    const res = await redisClient.del(key);
    return res;
}

async function getUserData(email) {
    let data;
    let isCached = false;
    let error = '';
    try {
        const cacheResults = await getKey(email);

        if (cacheResults) {
            isCached = true;
            data = User(cacheResults);

            if (
                data?.name !== undefined ||
                data?.email !== undefined ||
                data?.password !== undefined ||
                data?.phone !== undefined
            ) {
                deleteKey(email);
                isCached = false;
                data = await User.findOne({ email: email });
                if (data) {
                    setExKey(email, data);
                }
            }
        } else {
            data = await User.findOne({ email: email });
            if (data) {
                setExKey(email, data);
            }
        }

    } catch (e) {
        console.log(e);
        error = e;
    }
    return { data: data, isCached: isCached, error: error };
}

async function updateUserData(email, dataToUpdate) {
    let error = '';
    let message = '';
    try {
        data = await User.updateOne({ email: email }, dataToUpdate);
        let user = await getKey(email);
        if (user)
            setExKey(email, { ...user, ...dataToUpdate });
        message = 'user data updated';
    } catch (e) {
        console.log("[MONGO]: no updation performed");
        error = e;
    }
    return { message: message, error: error };
}


module.exports = { getUserData, updateUserData, setExKey, initRedis }