import express from "express";
import ClinicalReportTemplateSectionController from "../controllers/reportTemplateSectionController.js";
import ClinicalReportTemplateSectionDto from "../dto/reportTemplateSectionDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClinicalReportTemplateSectionCreateDto:
 *       type: object
 *       required:
 *         - title
 *         - clinicalReportTemplateId
 *       properties:
 *         title:
 *           type: string
 *           example: "Diagnosis"
 *         content:
 *           type: string
 *           example: "Patient diagnosed with..."
 *         order:
 *           type: integer
 *           example: 1
 *         clinicalReportTemplateId:
 *           type: string
 *           format: uuid
 *
 *     ClinicalReportTemplateSectionUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         order:
 *           type: integer
 */

class ClinicalReportTemplateSectionRoutes {
    constructor() {
        this.controller = new ClinicalReportTemplateSectionController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/clinical-report-template-sections:
         *   post:
         *     summary: Create a clinical report template section
         *     tags: [clinical-report-template-section]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClinicalReportTemplateSectionCreateDto'
         *     responses:
         *       201:
         *         description: Clinical report template section created successfully
         */
        this.router.post(
            "/",
            ClinicalReportTemplateSectionDto.createTemplateSectionDto,
            this.controller.createSection
        );

        /**
         * @swagger
         * /api/v1/clinical-report-template-sections:
         *   put:
         *     summary: Update a clinical report template section
         *     tags: [clinical-report-template-section]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClinicalReportTemplateSectionUpdateDto'
         *     responses:
         *       201:
         *         description: Clinical report template section updated successfully
         */
        this.router.put(
            "/",
            ClinicalReportTemplateSectionDto.updateTemplateSectionDto,
            this.controller.updateSection
        );

        /**
         * @swagger
         * /api/v1/clinical-report-template-sections/{id}:
         *   get:
         *     summary: Get a single clinical report template section
         *     tags: [clinical-report-template-section]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Clinical report template section ID
         *     responses:
         *       200:
         *         description: Clinical report template section fetched successfully
         */
        this.router.get(
            "/:id",
            this.controller.getSingleSection
        );

        /**
         * @swagger
         * /api/v1/clinical-report-template-sections/template/{clinicalReportTemplateId}:
         *   get:
         *     summary: Get all sections for a clinical report template
         *     tags: [clinical-report-template-section]
         *     parameters:
         *       - in: path
         *         name: clinicalReportTemplateId
         *         schema:
         *           type: string
         *         required: true
         *         description: Clinical report template ID (foreign key)
         *     responses:
         *       200:
         *         description: Clinical report template sections fetched successfully
         */
        this.router.get(
            "/template/:clinicalReportTemplateId",
            this.controller.getSections
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new ClinicalReportTemplateSectionRoutes().getRouter();
