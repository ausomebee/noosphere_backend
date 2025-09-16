import express from "express";
import OrganizationDiagnosisCodesController from "../controller/diagnosisCodeController.js";
import OrganizationDiagnosisCodesDto from "../dto/diagnosisCodeDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     OrganizationDiagnosisCodeCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - code
 *         - description
 *       properties:
 *         tenantId:
 *           type: string
 *           description: Unique tenant identifier
 *         code:
 *           type: string
 *           description: Diagnosis code
 *           example: "D123"
 *         description:
 *           type: string
 *           description: Diagnosis description
 *           example: "Diabetes Type II"
 *         isActive:
 *           type: boolean
 *           description: Indicates if the code is active
 *           example: true
 *
 *     OrganizationDiagnosisCodeUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *         - code
 *         - description
 *         - isActive
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the diagnosis code
 *         tenantId:
 *           type: string
 *           description: Unique tenant identifier
 *         code:
 *           type: string
 *           description: Diagnosis code
 *         description:
 *           type: string
 *           description: Diagnosis description
 *         isActive:
 *           type: boolean
 *           description: Indicates if the code is active
 */

class OrganizationDiagnosisCodesRoutes {
    constructor() {
        this.controller = new OrganizationDiagnosisCodesController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/diagnosis-codes:
         *   post:
         *     summary: Create organization diagnosis code
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/OrganizationDiagnosisCodeCreateDto'
         *     responses:
         *       201:
         *         description: Organization diagnosis code created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", OrganizationDiagnosisCodesDto.createDiagnosisCodeDto, this.controller.createDiagnosisCode);

        /**
         * @swagger
         * /api/v1/organization/diagnosis-codes:
         *   put:
         *     summary: Update organization diagnosis code
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/OrganizationDiagnosisCodeUpdateDto'
         *     responses:
         *       200:
         *         description: Organization diagnosis code updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.put("/", OrganizationDiagnosisCodesDto.updateDiagnosisCodeDto, this.controller.updateDiagnosisCode);

        /**
         * @swagger
         * /api/v1/organization/diagnosis-codes/tenant/{tenantId}:
         *   get:
         *     summary: Get tenant organization diagnosis codes
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *         description: The Id of the tenant
         *     responses:
         *       200:
         *         description: Organization diagnosis codes fetched successfully
         */
        this.router.get("/tenant/:tenantId", this.controller.getTenantDiagnosisCodes);

        /**
         * @swagger
         * /api/v1/organization/diagnosis-codes/{id}:
         *   get:
         *     summary: Get single organization diagnosis code
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The Id of the diagnosis code
         *     responses:
         *       200:
         *         description: Organization diagnosis code fetched successfully
         */
        this.router.get("/:id", this.controller.getSingleDiagnosisCode);

        /**
         * @swagger
         * /api/v1/organization/diagnosis-codes/{id}:
         *   patch:
         *     summary: Deactivate an organization diagnosis code
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The Id of the diagnosis code
         *     responses:
         *       200:
         *         description: Organization diagnosis code deactivated successfully
         */
        this.router.patch("/:id", this.controller.deactivateDiagnosisCode);
    }

    getRouter() {
        return this.router;
    }
}

export default new OrganizationDiagnosisCodesRoutes().getRouter();
