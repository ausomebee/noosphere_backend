import express from "express";
import InsuranceTypeController from "../controllers/insuranceTypeController.js";
import InsuranceTypeDto from "../dto/insuranceTypeDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     InsuranceTypeCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - name
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         name:
 *           type: string
 *           description: Name of the insurance type
 *           example: "Health Insurance"
 *         description:
 *           type: string
 *           description: Description of the insurance type
 *           example: "Covers basic and advanced health services"
 *         isDeleted:
 *           type: boolean
 *           default: false
 *         isActive:
 *           type: boolean
 *           default: true
 *
 *     InsuranceTypeUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique insurance type id
 *         tenantId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         isDeleted:
 *           type: boolean
 *         isActive:
 *           type: boolean
 */

class InsuranceTypeRoutes {
    constructor() {
        this.controller = new InsuranceTypeController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/insurance-type:
         *   post:
         *     summary: Create insurance type
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/InsuranceTypeCreateDto'
         *     responses:
         *       201:
         *         description: Insurance type created successfully
         */
        this.router.post("/", InsuranceTypeDto.createInsuranceTypeDto, this.controller.createInsuranceType);

        /**
         * @swagger
         * /api/v1/organization/insurance-type:
         *   put:
         *     summary: Update insurance type
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/InsuranceTypeUpdateDto'
         *     responses:
         *       201:
         *         description: Insurance type updated successfully
         */
        this.router.put("/", InsuranceTypeDto.updateInsuranceTypeDto, this.controller.updateInsuranceType);

        /**
         * @swagger
         * /api/v1/organization/insurance-type/tenant/{tenantId}:
         *   get:
         *     summary: Get all insurance types for a tenant
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of insurance types
         */
        this.router.get("/tenant/:tenantId", this.controller.getTenantInsuranceTypes);

        /**
         * @swagger
         * /api/v1/organization/insurance-type/{id}:
         *   get:
         *     summary: Get a single insurance type
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Insurance type fetched successfully
         */
        this.router.get("/:id", this.controller.getSingleInsuranceType);

        /**
         * @swagger
         * /api/v1/organization/insurance-type/{id}:
         *   delete:
         *     summary: Delete insurance type
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Insurance type deleted successfully
         */
        this.router.delete("/:id", this.controller.deleteInsuranceType);
    }

    getRouter() {
        return this.router;
    }
}

export default new InsuranceTypeRoutes().getRouter();
