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
    }

    getRouter() {
        return this.router;
    }
}

export default new ClinicalReportRoutes().getRouter();
