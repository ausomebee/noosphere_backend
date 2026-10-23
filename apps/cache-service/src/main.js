import "dotenv/config";
import crypto from "node:crypto";
import express from "express";
import {
    acquireLock,
    connectRedis,
    disconnectRedis,
    releaseLock,
    renewLock,
} from "./redis.js";

const app = express();
const port = Number(process.env.CACHE_SERVICE_PORT || process.env.PORT || 3333);
const serviceToken = process.env.CACHE_SERVICE_TOKEN;
const maxTtlMs = 10 * 60 * 1000;

app.disable("x-powered-by");
app.use(express.json({ limit: "8kb" }));

function isAuthorized(req) {
    const authorization = req.get("authorization") || "";
    if (!serviceToken || !authorization.startsWith("Bearer ")) return false;
    const supplied = Buffer.from(authorization.slice(7));
    const expected = Buffer.from(serviceToken);
    if (supplied.length !== expected.length) return false;
    return crypto.timingSafeEqual(supplied, expected);
}

function requireServiceAuth(req, res, next) {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    next();
}

function validLockRequest({ name, token, ttlMs }, needsTtl = true) {
    return typeof name === "string"
        && /^[a-z0-9:_-]{1,100}$/i.test(name)
        && typeof token === "string"
        && token.length >= 16
        && token.length <= 200
        && (!needsTtl || Number.isInteger(ttlMs) && ttlMs >= 30_000 && ttlMs <= maxTtlMs);
}

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.post("/internal/locks/acquire", requireServiceAuth, async (req, res, next) => {
    try {
        const { name, token, ttlMs } = req.body || {};
        if (!validLockRequest({ name, token, ttlMs })) {
            return res.status(400).json({ error: "Invalid lock request" });
        }
        const acquired = await acquireLock({ name, token, ttlMs });
        res.json({ acquired });
    } catch (error) {
        next(error);
    }
});

app.post("/internal/locks/renew", requireServiceAuth, async (req, res, next) => {
    try {
        const { name, token, ttlMs } = req.body || {};
        if (!validLockRequest({ name, token, ttlMs })) {
            return res.status(400).json({ error: "Invalid lock request" });
        }
        const renewed = await renewLock({ name, token, ttlMs });
        res.json({ renewed });
    } catch (error) {
        next(error);
    }
});

app.post("/internal/locks/release", requireServiceAuth, async (req, res, next) => {
    try {
        const { name, token } = req.body || {};
        if (!validLockRequest({ name, token }, false)) {
            return res.status(400).json({ error: "Invalid lock request" });
        }
        const released = await releaseLock({ name, token });
        res.json({ released });
    } catch (error) {
        next(error);
    }
});

app.use((error, _req, res, _next) => {
    console.error("Cache service request failed:", error);
    res.status(503).json({ error: "Cache service unavailable" });
});

if (!serviceToken || serviceToken.length < 32) {
    throw new Error("CACHE_SERVICE_TOKEN must be set to a random value of at least 32 characters");
}

await connectRedis();
const server = app.listen(port, process.env.HOST || "0.0.0.0", () => {
    console.log(`Cache service listening on port ${port}`);
});

async function shutdown() {
    server.close(async () => {
        await disconnectRedis();
        process.exit(0);
    });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
