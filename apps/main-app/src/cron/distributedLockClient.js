import { randomUUID } from "node:crypto";

const DEFAULT_TTL_MS = 120_000;

class DistributedLockClient {
    constructor({
        baseUrl = process.env.CACHE_SERVICE_URL,
        serviceToken = process.env.CACHE_SERVICE_TOKEN,
        ttlMs = Number(process.env.CRON_LOCK_TTL_MS || DEFAULT_TTL_MS),
        fetchImpl = fetch,
    } = {}) {
        this.baseUrl = baseUrl?.replace(/\/$/, "");
        this.serviceToken = serviceToken;
        this.ttlMs = ttlMs;
        this.fetch = fetchImpl;
    }

    async request(path, payload) {
        if (!this.baseUrl || !this.serviceToken) {
            throw new Error("CACHE_SERVICE_URL and CACHE_SERVICE_TOKEN are required for cron locking");
        }

        const response = await this.fetch(`${this.baseUrl}${path}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${this.serviceToken}`,
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10_000),
        });
        if (!response.ok) throw new Error(`Cache service returned HTTP ${response.status}`);
        return response.json();
    }

    async withLock(name, task) {
        const token = randomUUID();
        const payload = { name, token, ttlMs: this.ttlMs };
        const { acquired } = await this.request("/internal/locks/acquire", payload);
        if (!acquired) {
            console.log(`Cron job skipped; another worker owns lock ${name}`);
            return { acquired: false };
        }

        let lockLost = false;
        let renewing = false;
        const heartbeat = setInterval(async () => {
            if (renewing || lockLost) return;
            renewing = true;
            try {
                const result = await this.request("/internal/locks/renew", payload);
                if (!result.renewed) {
                    lockLost = true;
                    console.error(`Cron lock ${name} was lost; job may overlap another worker`);
                }
            } catch (error) {
                lockLost = true;
                console.error(`Could not renew cron lock ${name}; job may overlap another worker:`, error);
            } finally {
                renewing = false;
            }
        }, Math.max(1000, Math.floor(this.ttlMs / 3)));
        heartbeat.unref?.();

        try {
            const result = await task();
            if (lockLost) {
                console.error(`Cron job ${name} finished after losing its distributed lock`);
            }
            return { acquired: true, result, lockLost };
        } finally {
            clearInterval(heartbeat);
            try {
                const { released } = await this.request("/internal/locks/release", { name, token });
                if (!released) console.warn(`Cron lock ${name} had already expired or changed owners`);
            } catch (error) {
                console.error(`Could not release cron lock ${name}; it will expire automatically:`, error);
            }
        }
    }
}

export default DistributedLockClient;
