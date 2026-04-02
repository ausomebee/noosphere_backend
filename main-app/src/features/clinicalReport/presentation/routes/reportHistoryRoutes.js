import express from "express";
import ClinicalReportHistoryController from "../controllers/reportHistoryController.js";
import ClinicalReportHistoryDto from "../dto/reportHistoryDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClinicalReportHistoryCreateDto:
 *       type: object
 *       required:
 *         - clinicalReportId
 *         - action
 *         - createdBy
 *       properties:
 *         clinicalReportId:
 *           type: string
 *           format: uuid
 *           example: "f4a7e5c2-3a4c-4b9b-9d9e-8c9f6d1a1c11"
 *         action:
 *           type: string
 *           example: "APPROVED"
 *         details:
 *           type: string
 *           example: "Report approved by supervisor"
 *         createdBy:
 *           type: string
 *           format: uuid
 *
 *     ClinicalReportHistoryUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         action:
 *           type: string
 *         details:
 *           type: string
 */

class ClinicalReportHistoryRoutes {
    constructor() {
        this.controller = new ClinicalReportHistoryController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/clinical-report-histories:
         *   post:
         *     summary: Create a clinical report history entry
         *     tags: [clinical-report-history]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClinicalReportHistoryCreateDto'
         *     responses:
         *       201:
         *         description: Clinical report history created successfully
         */
        this.router.post(
            "/",
            ClinicalReportHistoryDto.createHistoryDto,
            this.controller.createHistory
        );

        /**
         * @swagger
         * /api/v1/clinical-report-histories/{id}:
         *   get:
         *     summary: Get a single clinical report history entry
         *     tags: [clinical-report-history]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Clinical report history ID
         *     responses:
         *       200:
         *         description: Clinical report history fetched successfully
         */
        this.router.get(
            "/:id",
            this.controller.getSingleHistory
        );

        /**
         * @swagger
         * /api/v1/clinical-report-histories/report/{clinicalReportId}:
         *   get:
         *     summary: Get all history entries for a clinical report
         *     tags: [clinical-report-history]
         *     parameters:
         *       - in: path
         *         name: clinicalReportId
         *         schema:
         *           type: string
         *         required: true
         *         description: Clinical report ID (foreign key)
         *     responses:
         *       200:
         *         description: Clinical report histories fetched successfully
         */
        this.router.get(
            "/report/:clinicalReportId",
            this.controller.getReportHistories
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new ClinicalReportHistoryRoutes().getRouter();
