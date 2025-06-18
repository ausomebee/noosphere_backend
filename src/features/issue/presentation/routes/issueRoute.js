import express from "express";
import IssueController from "../controller/issueController.js";
import IssueDto from "../dto/issueDto.js";
import S3Service from "../../../../utilities/s3.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateIssueDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - title
 *         - description
 *         - category
 *         - priority
 *         - adminId
 *         - resolutionDeadline
 *         - attachment
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *           description: Unique identifier of the tenant
 *         title:
 *           type: string
 *           example: "Payment Gateway Timeout"
 *           description: Title of the issue
 *         description:
 *           type: string
 *           example: "Users are experiencing delays during checkout."
 *           description: Detailed description of the issue
 *         category:
 *           type: string
 *           example: "Payment"
 *           description: Category of the issue
 *         priority:
 *           type: string
 *           enum: [P1, P2, P3, P4, EP1, EP2]
 *           example: "P1"
 *           description: Priority level of the issue
 *         adminId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *           description: UUID of the admin assigned to the issue
 *         resolutionDeadline:
 *           type: string
 *           format: date-time
 *           example: "2025-06-20T23:59:59Z"
 *           description: Deadline by which the issue should be resolved
 *         tenantStaffId:
 *           type: string
 *           format: uuid
 *           example: "9f1c2a34-5d11-4a66-bf88-b1a5a93b3f8c"
 *           description: Optional UUID of the tenant staff who logged the issue
 *         attachment:
 *           type: string
 *           format: binary
 */

class IssueRoutes {
    constructor() {
        this.controller = new IssueController();
        this.router = express.Router();
        this.S3Service = new S3Service().getUploadMiddleware()
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/issue/:
         *   post:
         *     summary: Create issue
         *     tags: [Issue]
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             $ref: '#/components/schemas/CreateIssueDto'
         *     responses:
         *       201:
         *         description: Issue created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", IssueDto.createIssueDto, this.controller.createIssue);

        /**
        * @swagger
        * /api/v1/issue/{id}:
        *   get:
        *     summary: gets single issue
        *     tags: [Issue]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the issue
        *     responses:
        *       200:
        *         description: issue fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/:id", IssueDto.checkIdDto, this.controller.getSingleIssue);

        /**
        * @swagger
        * /api/v1/issue/resolution/time:
        *   get:
        *     summary: gets issue resolution time
        *     tags: [Issue]
        *     responses:
        *       200:
        *         description: issue resolution time fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/resolution/time", this.controller.getAverageDurationInHours);

        /**
        * @swagger
        * /api/v1/issue/count/status:
        *   get:
        *     summary: count issue by status
        *     tags: [Issue]
        *     responses:
        *       200:
        *         description: issue counted successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/count/status", this.controller.getTotalByStatus);

        /**
        * @swagger
        * /api/v1/issue/percent/status:
        *   get:
        *     summary: get issue status percentage
        *     tags: [Issue]
        *     responses:
        *       200:
        *         description: issue status percentage fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/percent/status", this.controller.getStatusPercentages);

        /**
        * @swagger
        * /api/v1/issue/percent/category:
        *   get:
        *     summary: get issue category percentage
        *     tags: [Issue]
        *     responses:
        *       200:
        *         description: issue category percentage fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/percent/category", this.controller.getCategoriesPercentages);

        /**
        * @swagger
        * /api/v1/issue/percent/time:
        *   get:
        *     summary: get issue time percentage
        *     tags: [Issue]
        *     responses:
        *       200:
        *         description: issue time percentage fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/percent/time", this.controller.getCreatedAtPercentages);

        /**
        * @swagger
        * /api/v1/issue/percent/assignee:
        *   get:
        *     summary: get issue assignee percentage
        *     tags: [Issue]
        *     responses:
        *       200:
        *         description: issue assignee percentage fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/percent/assignee", this.controller.getAssigneePercentages);

    }

    getRouter() {
        return this.router;
    }
}

export default new IssueRoutes().getRouter();