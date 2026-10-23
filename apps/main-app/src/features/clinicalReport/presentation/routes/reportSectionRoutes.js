import express from "express";
import ClinicalReportSectionController from "../controllers/reportSectionController.js";
import ClinicalReportSectionDto from "../dto/reportSectionDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClinicalReportSectionCreateDto:
 *       type: object
 *       required:
 *         - section
 *         - clinicalReportId
 *       properties:
 *         section:
 *           type: string
 *           example: "Assessment"
 *         content:
 *           type: object
 *           example: { "notes": "Patient is stable" }
 *         clinicalReportId:
 *           type: string
 *           format: uuid
 *
 *     ClinicalReportSectionUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         section:
 *           type: string
 *         content:
 *           type: object
 */

class ClinicalReportSectionRoutes {
    constructor() {
        this.controller = new ClinicalReportSectionController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/clinical-report-sections:
         *   post:
         *     summary: Create a clinical report section
         *     tags: [clinical-report-section]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClinicalReportSectionCreateDto'
         *     responses:
         *       201:
         *         description: Clinical report section created successfully
         */
        this.router.post(
            "/",
            staffProtect(),
            ClinicalReportSectionDto.createReportSectionDto,
            this.controller.createSection
        );

        /**
         * @swagger
         * /api/v1/clinical-report-sections:
         *   put:
         *     summary: Update a clinical report section
         *     tags: [clinical-report-section]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClinicalReportSectionUpdateDto'
         *     responses:
         *       201:
         *         description: Clinical report section updated successfully
         */
        this.router.put(
            "/",
            staffProtect(),
            ClinicalReportSectionDto.updateReportSectionDto,
            this.controller.updateSection
        );

        /**
         * @swagger
         * /api/v1/clinical-report-sections/{id}:
         *   get:
         *     summary: Get a single clinical report section
         *     tags: [clinical-report-section]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Clinical report section ID
         *     responses:
         *       200:
         *         description: Clinical report section fetched successfully
         */
        this.router.get(
            "/:id",
            staffProtect(),
            this.controller.getSingleSection
        );

        /**
         * @swagger
         * /api/v1/clinical-report-sections/report/{clinicalReportId}:
         *   get:
         *     summary: Get all sections for a clinical report
         *     tags: [clinical-report-section]
         *     parameters:
         *       - in: path
         *         name: clinicalReportId
         *         schema:
         *           type: string
         *         required: true
         *         description: Clinical report ID (foreign key)
         *     responses:
         *       200:
         *         description: Clinical report sections fetched successfully
         */
        this.router.get(
            "/report/:clinicalReportId",
            staffProtect(),
            this.controller.getSections
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new ClinicalReportSectionRoutes().getRouter();
