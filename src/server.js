import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import fileUpload from 'express-fileupload';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import errorHandler from "./middleware/error-handler.js";
import prismaService from "./config/prisma.js";
import socketService from "./config/socket.js"
import PassportUtil from "./config/passport.js";
import department_route from "./features/department/presentation/routes/departmentRoute.js"

dotenv.config({ path: ".env" });

class App {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);

        this.prisma = prismaService;
        this.port = process.env.PORT || 5000;

        this.initializeDatabase();
        this.initializeMiddlewares();
        this.initializeSwagger();
        this.initializeRoutes();
        this.initializeErrorHandler();
    }

    async initializeDatabase() {
        await this.prisma.connect();
    }

    initializeMiddlewares() {
        new PassportUtil(this.app)
        this.app.use(morgan("dev"));
        this.app.use(cors({
            origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
            methods: "GET, POST, PATCH, DELETE, PUT",
            credentials: true,
        }));
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
        this.app.use(fileUpload());
    }

    initializeSwagger() {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    initializeRoutes() {
        this.app.use("/api/v1/department", department_route);
    }

    initializeErrorHandler() {
        this.app.use(errorHandler.handleError);
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${this.port}`);

            socketService.init(this.server);
            console.log("✅ WebSocket initialized");
        });
    }
}

const appInstance = new App();
appInstance.start();