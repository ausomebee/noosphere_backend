import express from "express";
import ClinicalReportTemplateController from "../controllers/reportTemplateController.js";
import ClinicalReportTemplateDto from "../dto/reportTemplateDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClinicalReportTemplateCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - title
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         title:
 *           type: string
 *           description: Clinical report template title
 *           example: "General Consultation Template"
 *         sections:
 *           type: array
 *           description: Sections of the clinical report template
 *           items:
 *             type: object
 *             properties:
 *               section:
 *                 type: string
 *                 description: Section title
 *                 example: "Diagnosis"
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
 *     ClinicalReportTemplateUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Clinical report template ID
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Tenant identifier
 *         title:
 *           type: string
 *           description: Updated template title
 *         isDraft:
 *           type: boolean
 *         sections:
 *           type: array
 *           description: Updated template sections
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Section ID (for existing sections)
 *               section:
 *                 type: string
 *               content:
 *                 type: object
 *                 description: Section content as an object
 *                 example:
 *                   symptoms: ["fever", "cough"]
 *                   duration: "2 days"
 *               order:
 *                 type: integer
 */

class ClinicalReportTemplateRoutes {
    constructor() {
        this.controller = new ClinicalReportTemplateController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/clinical-report-templates/:
         *   post:
         *     summary: Create a new clinical report template
         *     tags: [clinical-report-templates]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClinicalReportTemplateCreateDto'
         *     responses:
         *       201:
         *         description: Clinical report template created successfully
         */
        this.router.post(
            "/",
            ClinicalReportTemplateDto.createTemplateDto,
            this.controller.createTemplate
        );

        /**
         * @swagger
         * /api/v1/clinical-report-templates/:
         *   put:
         *     summary: Update a clinical report template
         *     tags: [clinical-report-templates]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClinicalReportTemplateUpdateDto'
         *     responses:
         *       200:
         *         description: Clinical report template updated successfully
         */
        this.router.put(
            "/",
            ClinicalReportTemplateDto.updateTemplateDto,
            this.controller.updateTemplate
        );

        /**
         * @swagger
         * /api/v1/clinical-report-templates/tenant/{tenantId}:
         *   get:
         *     summary: Get all clinical report templates for a tenant
         *     tags: [clinical-report-templates]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of tenant clinical report templates
         */
        this.router.get(
            "/tenant/:tenantId",
            this.controller.getTenantTemplates
        );

        /**
         * @swagger
         * /api/v1/clinical-report-templates/{id}:
         *   get:
         *     summary: Get a single clinical report template
         *     tags: [clinical-report-templates]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Clinical report template fetched successfully
         */
        this.router.get(
            "/:id",
            this.controller.getSingleTemplate
        );

        /**
         * @swagger
         * /api/v1/clinical-report-templates/duplicate/{id}:
         *   post:
         *     summary: Duplicate a clinical report template
         *     tags: [clinical-report-templates]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Clinical report template duplicated successfully
         */
        this.router.post(
            "/duplicate/:id",
            this.controller.duplicateTemplate
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new ClinicalReportTemplateRoutes().getRouter();
