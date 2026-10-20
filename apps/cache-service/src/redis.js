import { createClient } from "redis";

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.on("error", (error) => {
    console.error("Redis connection error:", error);
});

const renewLockScript = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("PEXPIRE", KEYS[1], ARGV[2])
    end
    return 0
`;

const releaseLockScript = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
    end
    return 0
`;

function lockKey(name) {
    return `noosphere:cron-lock:${name}`;
}

export async function connectRedis() {
    if (!process.env.REDIS_URL) throw new Error("REDIS_URL is required");
    await redisClient.connect();
}

export async function acquireLock({ name, token, ttlMs }) {
    const result = await redisClient.set(lockKey(name), token, { NX: true, PX: ttlMs });
    return result === "OK";
}

export async function renewLock({ name, token, ttlMs }) {
    const result = await redisClient.eval(renewLockScript, {
        keys: [lockKey(name)],
        arguments: [token, String(ttlMs)],
    });
    return Number(result) === 1;
}

export async function releaseLock({ name, token }) {
    const result = await redisClient.eval(releaseLockScript, {
        keys: [lockKey(name)],
        arguments: [token],
    });
    return Number(result) === 1;
}

export async function disconnectRedis() {
    if (redisClient.isOpen) await redisClient.quit();
}
