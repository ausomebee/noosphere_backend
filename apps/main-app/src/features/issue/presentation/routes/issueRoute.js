import express from "express";
import IssueController from "../controller/issueController.js";
import IssueDto from "../dto/issueDto.js";
import S3Service from "../../../../utilities/s3.js";
import { adminProtect, staffProtect } from "../../../../middleware/auth_handlers.js";

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
 *         adminLoggedById:
 *           type: string
 *           format: uuid
 *           example: "9f1c2a34-5d11-4a66-bf88-b1a5a93b3f8c"
 *           description: Optional UUID of the tenant staff who logged the issue
 *         attachment:
 *           type: string
 *           format: binary
 *     CreateIssueCommentDto:
 *       type: object
 *       required:
 *         - issueId
 *         - comment
 *         - adminId
 *       properties:
 *         issueId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *           description: The unique ID of the issue.
 *         comment:
 *           type: string
 *           example: "This issue has been escalated to the engineering team."
 *           description: The comment to be added to the issue.
 *         adminId:
 *           type: string
 *           format: uuid
 *           example: "9f1c2b5a-9a6c-4f8c-b0e5-821a212f80de"
 *           description: The ID of the admin adding the comment.
 *     EditIssueDto:
 *       type: object
 *       required:
 *         - updatedBy
 *         - title
 *         - description
 *         - id
 *       properties:
 *         updatedBy:
 *           type: string
 *           format: uuid
 *           description: ID of the admin making the update
 *           example: "b12d5a5a-0c41-4f5b-8f5a-3a2e62fce312"
 *         title:
 *           type: string
 *           description: New title of the issue
 *           example: "Database crash on login"
 *         description:
 *           type: string
 *           description: Updated issue description
 *           example: "The issue occurs when a user logs in with an invalid token."
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID of the issue being updated
 *           example: "9c481d4e-1c9b-4e4e-9e9f-74284a9b2a62"

 *     ChangeCategoryDto:
 *       type: object
 *       required:
 *         - updatedBy
 *         - category
 *         - id
 *       properties:
 *         updatedBy:
 *           type: string
 *           format: uuid
 *           description: ID of the admin making the change
 *           example: "d5e8a759-6fbd-4ff9-90f6-08d69f34c872"
 *         category:
 *           type: string
 *           description: New category for the issue
 *           example: "Networking"
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID of the issue
 *           example: "c9f9a8a1-8e7b-4c7a-bd4f-2b46b769a2cd"

 *     ChangePriorityDto:
 *       type: object
 *       required:
 *         - updatedBy
 *         - priority
 *         - id
 *       properties:
 *         updatedBy:
 *           type: string
 *           format: uuid
 *           description: ID of the admin making the change
 *           example: "adfa769d-465d-4410-80e5-24c74b3fbb65"
 *         priority:
 *           type: string
 *           enum: [P1, P2, P3, P4, EP1, EP2]
 *           description: New priority level
 *           example: "P2"
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID of the issue
 *           example: "ac194a49-3315-4e36-848a-73a2f09eb95c"

 *     ReassignIssueDto:
 *       type: object
 *       required:
 *         - updatedBy
 *         - adminId
 *         - id
 *       properties:
 *         updatedBy:
 *           type: string
 *           format: uuid
 *           description: Admin initiating reassignment
 *           example: "e2b1a9e3-92c6-41d1-84c5-73034ef2e2cc"
 *         adminId:
 *           type: string
 *           format: uuid
 *           description: New admin being assigned to the issue
 *           example: "a6c5f7b7-cc1e-45db-84c8-4f65d9584532"
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID of the issue to be reassigned
 *           example: "2c2b16c6-b5f6-4712-8b0d-d7ef8f294a1e"

 *     ChangeStatusDto:
 *       type: object
 *       required:
 *         - updatedBy
 *         - id
 *       properties:
 *         updatedBy:
 *           type: string
 *           format: uuid
 *           description: Admin making the status change
 *           example: "b33a8fdd-b67f-4e08-bd28-92e7d2011de6"
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID of the issue
 *           example: "cc88c2b1-2e3b-47a7-90b3-2fb2e453d682"
 *         status:
 *           type: string
 *           enum: [all, Resolved, In Progress, Not Started, Unassigned]
 *           description: New status to be set
 *           example: "In Progress"
 *     AddAttachmentDto:
 *       type: object
 *       required:
 *         - id
 *         - attachment
 *         - updatedBy
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *           description: Unique identifier of the issue
 *         attachment:
 *           type: string
 *           format: binary
 *         updatedBy:
 *           type: string
 *           format: uuid
 *           description: Admin adding attachment
 *           example: "e2b1a9e3-92c6-41d1-84c5-73034ef2e2cc"
 *     MarkRessolvedDto:
 *       type: object
 *       required:
 *         - id
 *         - updatedBy
 *         - status
 *         - resolutionDescription
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *           description: Unique identifier of the issue
 *         attachment:
 *           type: string
 *           format: binary
 *         updatedBy:
 *           type: string
 *           format: uuid
 *           description: Admin adding attachment
 *           example: "e2b1a9e3-92c6-41d1-84c5-73034ef2e2cc"
 *         status:
 *           type: string
 *           enum: [Resolved]
 *           description: New status to be set
 *           example: "Resolved"
 *         resolutionDescription:
 *           type: string
 *           description: resolution note
 *           example: "it was ressolved"
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
        this.router.post("/", adminProtect(), this.S3Service.single("attachment"), IssueDto.createIssueDto, this.controller.createIssue);

        /**
         * @swagger
         * /api/v1/issue/tenant:
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
        this.router.post("/tenant", staffProtect(), this.S3Service.single("attachment"), IssueDto.createIssueDto, this.controller.createIssue);

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
        this.router.get("/:id", adminProtect(), IssueDto.checkIdDto, this.controller.getSingleIssue);

        /**
        * @swagger
        * /api/v1/issue/tenant/{id}:
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
        this.router.get("/tenant/:id", staffProtect(), IssueDto.checkIdDto, this.controller.getSingleIssue);

        /**
        * @swagger
        * /api/v1/issue/tenant/{tenantId}/status/{status}:
        *   get:
        *     summary: gets tenant issue by status
        *     tags: [Issue]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the tenant
        *       - in: path
        *         name: status
        *         required: true
        *         schema:
        *           type: string
        *         description: The status of the issue
        *     responses:
        *       200:
        *         description: issue fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant/:tenantId/status/:status", adminProtect(), this.controller.getTenantIssueByStatus);

        /**
        * @swagger
        * /api/v1/issue/tenant/{tenantId}:
        *   get:
        *     summary: gets tenant issue
        *     tags: [Issue]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the tenant
        *     responses:
        *       200:
        *         description: issue fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant/:tenantId", adminProtect(),  this.controller.getTenantIssues);

        /**
        * @swagger
        * /api/v1/issue/tenant/tenant/{tenantId}:
        *   get:
        *     summary: gets tenant issue
        *     tags: [Issue]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the tenant
        *     responses:
        *       200:
        *         description: issue fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant/tenant/:tenantId", staffProtect(),  this.controller.getTenantIssues);

        /**
        * @swagger
        * /api/v1/issue/tenant-management-overview/{tenantId}:
        *   get:
        *     summary: gets tenant management overview
        *     tags: [Issue]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the tenant
        *     responses:
        *       200:
        *         description: issue fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant-management-overview/:tenantId", adminProtect(),  this.controller.tenantManagementOverview);

         /**
        * @swagger
        * /api/v1/issue/tenant-overview/{tenantId}:
        *   get:
        *     summary: gets tenant issue
        *     tags: [Issue]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the tenant
        *     responses:
        *       200:
        *         description: issue fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant-overview/:tenantId", adminProtect(), this.controller.getTenantIssuesOverview);

         /**
        * @swagger
        * /api/v1/issue/tenant/tenant-overview/{tenantId}:
        *   get:
        *     summary: gets tenant issue
        *     tags: [Issue]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the tenant
        *     responses:
        *       200:
        *         description: issue fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant/tenant-overview/:tenantId", staffProtect(), this.controller.getTenantIssuesOverview);

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
        this.router.get("/resolution/time", adminProtect(), this.controller.getAverageDurationInHours);

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
        this.router.get("/count/status", adminProtect(), this.controller.getTotalByStatus);

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
        this.router.get("/percent/status", adminProtect(), this.controller.getStatusPercentages);

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
        this.router.get("/percent/category", adminProtect(), this.controller.getCategoriesPercentages);

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
        this.router.get("/percent/time", adminProtect(), this.controller.getCreatedAtPercentages);

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
        this.router.get("/percent/assignee", adminProtect(), this.controller.getAssigneePercentages);

        /**
        * @swagger
        * /api/v1/issue/percent/priority:
        *   get:
        *     summary: get issue priority percentage
        *     tags: [Issue]
        *     responses:
        *       200:
        *         description: issue priority percentage fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/percent/priority", adminProtect(), this.controller.getPriorityPercentages);

        /**
        * @swagger
        * /api/v1/issue/status/{status}:
        *   get:
        *     summary: gets issues by status
        *     tags: [Issue]
        *     parameters:
        *       - in: path
        *         name: status
        *         required: true
        *         schema:
        *           type: string
        *         description: The status of the issue
        *     responses:
        *       200:
        *         description: issue fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/status/:status", adminProtect(), IssueDto.checkStatusDto, this.controller.getIssueByStatus);

        /**
         * @swagger
         * /api/v1/issue/comment/new:
         *   post:
         *     summary: Create issue comment
         *     tags: [Issue]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateIssueCommentDto'
         *     responses:
         *       201:
         *         description: Issue comment created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/comment/new", adminProtect(), IssueDto.createIssueCommentDto, this.controller.createIssueComment);

        /**
         * @swagger
         * /api/v1/issue/issue/edit:
         *   patch:
         *     summary: Edit issue details
         *     tags: [Issue]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/EditIssueDto'
         *     responses:
         *       200:
         *         description: Issue successfully updated
         *       400:
         *         description: Validation error
         *       500:
         *         description: Server error
         */
        this.router.patch("/issue/edit", adminProtect(), IssueDto.editIssueDto, this.controller.updateIssue);

        /**
         * @swagger
         * /api/v1/issue/issue/change-category:
         *   patch:
         *     summary: Change issue category
         *     tags: [Issue]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ChangeCategoryDto'
         *     responses:
         *       200:
         *         description: Category successfully changed
         *       400:
         *         description: Validation error
         *       500:
         *         description: Server error
         */
        this.router.patch("/issue/change-category", adminProtect(), IssueDto.changeCategoryDto, this.controller.updateIssue);

        /**
         * @swagger
         * /api/v1/issue/issue/change-priority:
         *   patch:
         *     summary: Change issue priority
         *     tags: [Issue]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ChangePriorityDto'
         *     responses:
         *       200:
         *         description: Priority successfully changed
         *       400:
         *         description: Validation error
         *       500:
         *         description: Server error
         */
        this.router.patch("/issue/change-priority", adminProtect(), IssueDto.changePriorityDto, this.controller.updateIssue);

        /**
         * @swagger
         * /api/v1/issue/issue/reassign:
         *   patch:
         *     summary: Reassign issue to a different admin
         *     tags: [Issue]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ReassignIssueDto'
         *     responses:
         *       200:
         *         description: Issue reassigned successfully
         *       400:
         *         description: Validation error
         *       500:
         *         description: Server error
         */
        this.router.patch("/issue/reassign", adminProtect(), IssueDto.reassignIssueDto, this.controller.updateIssue);

        /**
         * @swagger
         * /api/v1/issue/issue/change-status:
         *   patch:
         *     summary: Change status of an issue
         *     tags: [Issue]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ChangeStatusDto'
         *     responses:
         *       200:
         *         description: Status successfully changed
         *       400:
         *         description: Validation error
         *       500:
         *         description: Server error
         */
        this.router.patch("/issue/change-status", adminProtect(), IssueDto.changeStatusDto, this.controller.updateIssue);

        /**
         * @swagger
         * /api/v1/issue/issue/change-status/tenant:
         *   patch:
         *     summary: Change status of an issue
         *     tags: [Issue]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ChangeStatusDto'
         *     responses:
         *       200:
         *         description: Status successfully changed
         *       400:
         *         description: Validation error
         *       500:
         *         description: Server error
         */
        this.router.patch("/issue/change-status/tenant", staffProtect(), IssueDto.changeStatusDto, this.controller.updateIssue);

        /**
         * @swagger
         * /api/v1/issue/issue/attachment:
         *   patch:
         *     summary: add attachment to issue
         *     tags: [Issue]
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             $ref: '#/components/schemas/AddAttachmentDto'
         *     responses:
         *       201:
         *         description: Attachment added successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/issue/attachment", adminProtect(), this.S3Service.single("attachment"), IssueDto.checkBodyIdDto, this.controller.updateIssue);

        /**
         * @swagger
         * /api/v1/issue/issue/ressolved:
         *   patch:
         *     summary: mark ressolved
         *     tags: [Issue]
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             $ref: '#/components/schemas/MarkRessolvedDto'
         *     responses:
         *       201:
         *         description: issue ressolved successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/issue/ressolved", adminProtect(), this.S3Service.single("attachment"), IssueDto.markRessolvedDto, this.controller.updateIssue);

    }

    getRouter() {
        return this.router;
    }
}

export default new IssueRoutes().getRouter();