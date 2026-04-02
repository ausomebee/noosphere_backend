import express from "express";
import ServerRequestDto from "../dto/serverRequestDto.js";
import ServerRequestController from "../controllers/serverRequestController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateServerRequestDto:
 *       type: object
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Optional Tenant ID
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         adminId:
 *           type: string
 *           format: uuid
 *           description: Optional Admin ID
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         tenantStaffId:
 *           type: string
 *           format: uuid
 *           description: Optional Tenant Staff ID
 *           example: "550e8400-e29b-41d4-a716-446655440004"
 *         tenantClientId:
 *           type: string
 *           format: uuid
 *           description: Optional Tenant Client ID
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         method:
 *           type: string
 *           description: HTTP method of the request
 *           example: "POST"
 *         endpoint:
 *           type: string
 *           description: API endpoint called
 *           example: "/api/v1/login"
 *         statusCode:
 *           type: integer
 *           description: Response status code
 *           example: 200
 *         durationMs:
 *           type: integer
 *           description: Duration of request in milliseconds
 *           example: 123
 *         ipAddress:
 *           type: string
 *           description: IP address of the requester
 *           example: "192.168.1.100"
 *         userAgent:
 *           type: string
 *           description: User agent string
 *           example: "Mozilla/5.0"
 *         errorMessage:
 *           type: string
 *           description: Optional error message if request failed
 *           example: "Unauthorized"
 *       required:
 *         - method
 *         - endpoint
 *         - statusCode
 *         - durationMs
 */

class ServerRequestRoutes {
    constructor() {
        this.controller = new ServerRequestController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/server-requests:
         *   post:
         *     summary: Create server request log
         *     tags: [ServerRequest]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateServerRequestDto'
         *     responses:
         *       201:
         *         description: Server request log created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", ServerRequestDto.createRequestDto, this.controller.createRequest);

        /**
         * @swagger
         * /api/v1/server-requests/{id}:
         *   get:
         *     summary: Get a single server request log by ID
         *     tags: [ServerRequest]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the server request log
         *     responses:
         *       200:
         *         description: Server request log fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/:id", ServerRequestDto.checkIdDto, this.controller.getSingleRequest);

        /**
         * @swagger
         * /api/v1/server-requests/tenant/activity:
         *   get:
         *     summary: Get tenant server request logs
         *     tags: [ServerRequest]
         *     parameters:
         *       - in: query
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the tenant
         *       - in: query
         *         name: statusCodes
         *         required: false
         *         schema:
         *           type: array
         *           items:
         *             type: integer
         *         description: Optional list of status codes to filter
         *       - in: query
         *         name: page
         *         required: false
         *         schema:
         *           type: integer
         *           default: 1
         *         description: Page number for pagination
         *       - in: query
         *         name: limit
         *         required: false
         *         schema:
         *           type: integer
         *           default: 20
         *         description: Number of logs per page
         *     responses:
         *       200:
         *         description: Server request logs fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/tenant/activity", this.controller.getTenantRequests);

        /**
         * @swagger
         * /api/v1/server-requests/tenant/activity/date-range:
         *   get:
         *     summary: Get tenant server request logs by date range
         *     tags: [ServerRequest]
         *     parameters:
         *       - in: query
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *       - in: query
         *         name: startDate
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *       - in: query
         *         name: endDate
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *       - in: query
         *         name: page
         *         required: false
         *         schema:
         *           type: integer
         *           default: 1
         *       - in: query
         *         name: limit
         *         required: false
         *         schema:
         *           type: integer
         *           default: 20
         *     responses:
         *       200:
         *         description: Server request logs fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/tenant/activity/date-range", this.controller.getRequestsByDateRange);
    }

    getRouter() {
        return this.router;
    }
}

export default new ServerRequestRoutes().getRouter();