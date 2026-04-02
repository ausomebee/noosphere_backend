import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
// import errorHandler from "./middleware/error-handler.js";
import cache_route from "./routes/cacheRoute.js"
import RedisConfig from "./config/redis.js";
dotenv.config({ path: ".env" });

class App {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);

    this.redis = RedisConfig;
    this.port = process.env.PORT || 3333;

    this.initializeMiddlewares();
    this.initializeRoutes();
    // this.initializeErrorHandler();
  }

  initializeMiddlewares() {
    this.app.use(morgan("dev"));
    this.app.use(cors({
      origin: [""],
      methods: "GET, POST, PATCH, DELETE, PUT",
      credentials: true,
    }));
    this.app.use(express.json({ limit: "50mb" }));
  }

  initializeRoutes() {
    this.app.use("/cache", cache_route);
  }

  // initializeErrorHandler() {
  //   this.app.use(errorHandler.handleError);
  // }

  start() {
    this.server.listen(this.port, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${this.port}`);
    });
  }
}

const appInstance = new App();
appInstance.start();