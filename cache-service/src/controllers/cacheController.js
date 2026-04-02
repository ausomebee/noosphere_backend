import redisConfig from "../config/redis.js";

class CacheController {
    constructor() {
        this.cacheService = redisConfig.getClient();
    }

    createCache = async (req, res) => {
        try {
            const { key, value, ttl } = req.body;

            if (!key || value === undefined) {
                return res.status(400).json({
                    error: 'Key and value are required'
                });
            }

            await this.cacheService.set(key, value, ttl);
            res.status(201).json({ message: 'cached' });
        } catch (error) {
            res.status(500).json({
                error: 'Failed to cache data',
                details: error.message
            });
        }
    }

    getCache = async (req, res) => {
        try {
            const { key } = req.params;
            const value = await this.cacheService.get(key);

            if (!value) {
                return res.status(404).json({ error: 'not found' });
            }

            res.json({ value });
        } catch (error) {
            res.status(500).json({
                error: 'Failed to retrieve cache',
                details: error.message
            });
        }
    }

    deleteCache = async (req, res) => {
        try {
            const { key } = req.params;
            await this.cacheService.del(key);
            res.json({ message: 'deleted' });
        } catch (error) {
            res.status(500).json({
                error: 'Failed to delete cache',
                details: error.message
            });
        }
    }
}

export default CacheController;