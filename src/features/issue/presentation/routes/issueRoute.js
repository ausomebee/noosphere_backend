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
        this.router.post("/", IssueDto.createIssueDto, this.S3Service.single("attachment"), this.controller.createIssue);

    }

    getRouter() {
        return this.router;
    }
}

export default new IssueRoutes().getRouter();