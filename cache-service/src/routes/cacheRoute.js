import express from "express";
import CacheController from "../controllers/cacheController.js";

class CacheRoutes {
    constructor() {
        this.controller = new CacheController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post("/", this.controller.createCache);

        this.router.get("/:key", this.controller.getCache);

        this.router.delete("/:key", this.controller.deleteCache);
    }

    getRouter() {
        return this.router;
    }
}

export default new CacheRoutes().getRouter();