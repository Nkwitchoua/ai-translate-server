import { Redis } from "ioredis";

const LIMIT_KEY = "user:limits:";
const BLOCKED_KEY = "user:blocked:";
const LANG_KEY = "user:lang:";
const REDIS_URL = process.env.REDIS_URL;

const client = new Redis(REDIS_URL);

export const exists = async (key) => await client.exists(key);
export const get = async (key) => await client.get(key);
export const set = async (key, value) => await client.set(key, value);

export const getLimit = async (userId) => await client.hgetall(LIMIT_KEY + userId);
export const setLimit = async (userId, value) => {
    await client.hset(LIMIT_KEY + userId, {
        text: String(value.text),
        audio: String(value.audio),
        photos: String(value.photos),
    });
}
export const hincrbyLimit = async (userId, field, value) => await client.hincrby(LIMIT_KEY + userId, field, value);

export const setHm = async (key, value) => await client.hmset(key, value);
export const incrHm = async (key, field, value) => await client.hincrby(key, field, value);

export const isBlocked = async (userId) => await client.exists(`${BLOCKED_KEY}${userId}`) == 1;
export const hasLimit = async (userId) => await client.exists(`${LIMIT_KEY}${userId}`) == 1;
export const hasLang = async (userId) => await client.exists(`${LANG_KEY}${userId}`) == 1;