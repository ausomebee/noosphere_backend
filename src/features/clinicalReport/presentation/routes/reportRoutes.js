import express from "express";
import ClinicalReportController from "../controllers/reportController.js";
import ClinicalReportDto from "../dto/reportDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClinicalReportCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - clientTenantId
 *         - creatorId
 *         - title
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         clientTenantId:
 *           type: string
 *           format: uuid
 *           description: Unique client tenant identifier
 *         creatorId:
 *           type: string
 *           format: uuid
 *           description: User ID of the creator
 *         approverId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: User ID of the approver (optional)
 *         title:
 *           type: string
 *           description: Clinical report title
 *           example: "Initial Consultation Report"
 *         status:
 *           type: string
 *           default: "DRAFT"
 *           description: Status of the report
 *         isDeleted:
 *           type: boolean
 *           default: false
 *           description: Whether the report is deleted
 *         sections:
 *           type: array
 *           description: Sections of the clinical report
 *           items:
 *             type: object
 *             required:
 *               - section
 *               - content
 *             properties:
 *               section:
 *                 type: string
 *                 description: Section title
 *                 example: "Patient History"
 *               content:
 *                 type: object
 *                 description: Section content as an object
 *                 example:
 *                   symptoms: ["fever", "cough"]
 *                   duration: "2 days"
 *               order:
 *                 type: integer
 *                 description: Display order of the section
 *
 *     ClinicalReportUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Clinical report ID
 *         clientTenantId:
 *           type: string
 *           format: uuid
 *           description: Unique client tenant identifier
 *         title:
 *           type: string
 *           description: Updated report title
 *         approverId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         status:
 *           type: string
 *         isDeleted:
 *           type: boolean
 *         sections:
 *           type: array
 *           description: Updated report sections
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Section ID (for existing sections)
 *               section:
 *                 type: string
 *                 description: Section title
 *               content:
 *                 type: object
 *                 description: Section content as an object
 *                 example:
 *                   symptoms: ["fever", "cough"]
 *                   duration: "2 days"
 *               order:
 *                 type: integer
 *                 description: Display order of the section
 */

class ClinicalReportRoutes {
    constructor() {
        this.controller = new ClinicalReportController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/clinical-reports/:
         *   post:
         *     summary: Create a new clinical report
         *     tags: [clinical-reports]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClinicalReportCreateDto'
         *     responses:
         *       201:
         *         description: Clinical report created successfully
         */
        this.router.post(
            "/",
            ClinicalReportDto.createReportDto,
            this.controller.createReport
        );

        /**
         * @swagger
         * /api/v1/clinical-reports/:
         *   put:
         *     summary: Update a clinical report
         *     tags: [clinical-reports]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClinicalReportUpdateDto'
         *     responses:
         *       200:
         *         description: Clinical report updated successfully
         */
        this.router.put(
            "/",
            ClinicalReportDto.updateReportDto,
            this.controller.updateReport
        );

        /**
         * @swagger
         * /api/v1/clinical-reports/tenant/{tenantId}:
         *   get:
         *     summary: Get all clinical reports for a tenant
         *     tags: [clinical-reports]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of clinical reports
         */
        this.router.get(
            "/tenant/:tenantId",
            this.controller.getTenantReports
        );

        /**
        * @swagger
        * /api/v1/clinical-reports/tenant/{tenantId}/status/{status}:
        *   get:
        *     summary: Get all clinical reports for a tenant by status
        *     tags: [clinical-reports]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *       - in: path
        *         name: status
        *         required: true
        *         schema:
        *           type: string
        *     responses:
        *       200:
        *         description: List of clinical reports
        */
        this.router.get(
            "/tenant/:tenantId/status/:status",
            this.controller.getReportsByStatus
        );

        /**
         * @swagger
         * /api/v1/clinical-reports/client/{clientTenantId}/status/{status}:
         *   get:
         *     summary: Get all clinical reports for a client by status
         *     tags: [clinical-reports]
         *     parameters:
         *       - in: path
         *         name: clientTenantId
         *         required: true
         *         schema:
         *           type: string
         *       - in: path
         *         name: status
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of clinical reports
         */
        this.router.get(
            "/client/:clientTenantId/status/:status",
            this.controller.getClientReportsByStatus
        );

        /**
         * @swagger
         * /api/v1/clinical-reports/validate/{token}:
         *   get:
         *     summary: Validate and fetch clinical report using token
         *     tags: [clinical-reports]
         *     parameters:
         *       - in: path
         *         name: token
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Clinical report fetched successfully
         *       400:
         *         description: Invalid or expired token
         *       404:
         *         description: Clinical report not found
         */
        this.router.get(
            "/validate/:token",
            this.controller.validateReportToken
        );

        /**
         * @swagger
         * /api/v1/clinical-reports/{id}/withdraw-token:
         *   patch:
         *     summary: Withdraw clinical report token
         *     tags: [clinical-reports]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Clinical report token withdrawn successfully
         *       404:
         *         description: Clinical report not found
         */
        this.router.patch(
            "/:id/withdraw-token",
            this.controller.withdrawReportToken
        );

        /**
         * @swagger
         * /api/v1/clinical-reports/approver/{approverId}:
         *   get:
         *     summary: Get all clinical reports for an approver that are submitted
         *     tags: [clinical-reports]
         *     parameters:
         *       - in: path
         *         name: approverId
         *         required: true
         *         schema:
         *           type: string
         *      
         *     responses:
         *       200:
         *         description: List of clinical reports
         */
        this.router.get(
            "/approver/:approverId",
            this.controller.getReportsSubmittedForApprover
        );

        /**
        * @swagger
        * /api/v1/clinical-reports/:id/status/:status:
        *   patch:
        *     summary: Update a clinical report status
        *     tags: [clinical-reports]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *       - in: path
        *         name: status
        *         required: true
        *         schema:
        *           type: string
        *     responses:
        *       200:
        *         description: List of clinical reports
        */
        this.router.patch(
            "/:id/status/:status",
            this.controller.updateReportStatus
        );

        /**
         * @swagger
         * /api/v1/clinical-reports/{id}:
         *   get:
         *     summary: Get a single clinical report
         *     tags: [clinical-reports]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Clinical report fetched successfully
         */
        this.router.get(
            "/:id",
            this.controller.getSingleReport
        );

        /**
         * @swagger
         * /api/v1/clinical-reports/nudge-client/{id}:
         *   get:
         *     summary: nudge-client
         *     tags: [clinical-reports]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Clinical report fetched successfully
         */
        this.router.get(
            "/nudge-client/:id",
            this.controller.nudgeClient
        );

        /**
         * @swagger
         * /api/v1/clinical-reports/duplicate/{id}:
         *   post:
         *     summary: duplicate a clinical report
         *     tags: [clinical-reports]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Clinical report duplicated successfully
         */
        this.router.post(
            "/duplicate/:id",
            this.controller.duplicateReport
        );

        /**
         * @swagger
         * /api/v1/clinical-reports/{id}:
         *   delete:
         *     summary: delete a clinical report
         *     tags: [clinical-reports]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Clinical report deleted successfully
         */
        this.router.delete(
            "/:id",
            this.controller.deleteReport
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new ClinicalReportRoutes().getRouter();
