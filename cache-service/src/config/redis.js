import { createClient } from "redis";

class RedisConfig {
    constructor() {
        this.client = null;
        this.initialize();
    }

    async initialize() {
        if (!this.client) {
            this.client = createClient();
            this.client.on("error", (err) => console.log("Error creating Redis client:", err));
        }
        try {
            await this.client.connect();
            console.log("✅ Redis client connected successfully");
        } catch (error) {
            console.log("Error occurred while initializing Redis:", error);
            throw error;
        }
    }

    getClient() {
        if (!this.client) {
            throw new Error("Redis client not initialized.");
        }
        return this.client;
    }
}

const redisConfig = new RedisConfig();
export default redisConfig;