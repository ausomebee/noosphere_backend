import express from "express";
import ClinicalReportChangeRequestController from "../controllers/reportRequest.js";
import ClinicalReportChangeRequestDto from "../dto/reportRequestDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClinicalReportChangeRequestCreateDto:
 *       type: object
 *       required:
 *         - clinicalReportId
 *         - description
 *       properties:
 *         clinicalReportId:
 *           type: string
 *           format: uuid
 *           example: "f4a7e5c2-3a4c-4b9b-9d9e-8c9f6d1a1c11"
 *         description:
 *           type: string
 *           example: "Please update the diagnosis section"
 *         clientTenantId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         approverId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *
 *     ClinicalReportChangeRequestUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         description:
 *           type: string
 *         viewed:
 *           type: boolean
 *         approverId:
 *           type: string
 *           format: uuid
 *           nullable: true
 */

class ClinicalReportChangeRequestRoutes {
    constructor() {
        this.controller = new ClinicalReportChangeRequestController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/clinical-report-change-requests:
         *   post:
         *     summary: Create a clinical report change request
         *     tags: [clinical-report-change-request]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClinicalReportChangeRequestCreateDto'
         *     responses:
         *       201:
         *         description: Clinical report change request created successfully
         */
        this.router.post(
            "/",
            ClinicalReportChangeRequestDto.createChangeRequestDto,
            this.controller.createChangeRequest
        );

        /**
         * @swagger
         * /api/v1/clinical-report-change-requests/{id}:
         *   get:
         *     summary: Get a single clinical report change request
         *     tags: [clinical-report-change-request]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Clinical report change request ID
         *     responses:
         *       200:
         *         description: Clinical report change request fetched successfully
         */
        this.router.get(
            "/:id",
            this.controller.getSingleChangeRequest
        );

        /**
         * @swagger
         * /api/v1/clinical-report-change-requests/report/{clinicalReportId}:
         *   get:
         *     summary: Get all change requests for a clinical report
         *     tags: [clinical-report-change-request]
         *     parameters:
         *       - in: path
         *         name: clinicalReportId
         *         schema:
         *           type: string
 *         required: true
         *         description: Clinical report ID (foreign key)
         *     responses:
         *       200:
         *         description: Clinical report change requests fetched successfully
         */
        this.router.get(
            "/report/:clinicalReportId",
            this.controller.getReportChangeRequests
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new ClinicalReportChangeRequestRoutes().getRouter();
