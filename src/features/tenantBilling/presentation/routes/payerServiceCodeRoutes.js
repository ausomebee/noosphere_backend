import express from "express";
import PayerServiceCodesController from "../controllers/payerServiceCodesController.js";
import PayerServiceCodesDto from "../dto/payerServiceCodesDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     PayerServiceCodeCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - payerId
 *         - serviceCodeId
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         payerId:
 *           type: string
 *           format: uuid
 *           description: The payer associated with this mapping
 *         serviceCodeId:
 *           type: string
 *           format: uuid
 *           description: The service code linked to this payer
 *         isActive:
 *           type: boolean
 *           default: true
 *         isDeleted:
 *           type: boolean
 *           default: false
 *
 *     PayerServiceCodeUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique payer service code identifier
 *         tenantId:
 *           type: string
 *           format: uuid
 *         payerId:
 *           type: string
 *           format: uuid
 *         serviceCodeId:
 *           type: string
 *           format: uuid
 *         isActive:
 *           type: boolean
 *         isDeleted:
 *           type: boolean
 */

class PayerServiceCodeRoutes {
    constructor() {
        this.controller = new PayerServiceCodesController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/payer-service-code:
         *   post:
         *     summary: Create payer-service code mapping
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PayerServiceCodeCreateDto'
         *     responses:
         *       201:
         *         description: Payer service code created successfully
         */
        this.router.post("/", PayerServiceCodesDto.createPayerServiceCodeDto, this.controller.createPayerServiceCode);

        /**
         * @swagger
         * /api/v1/organization/payer-service-code:
         *   put:
         *     summary: Update payer-service code mapping
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PayerServiceCodeUpdateDto'
         *     responses:
         *       201:
         *         description: Payer service code updated successfully
         */
        this.router.put("/", PayerServiceCodesDto.updatePayerServiceCodeDto, this.controller.updatePayerServiceCode);

        /**
         * @swagger
         * /api/v1/organization/payer-service-code/{id}:
         *   get:
         *     summary: Get a single payer-service code mapping
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Payer service code fetched successfully
         */
        this.router.get("/:id", this.controller.getSinglePayerServiceCode);

        /**
         * @swagger
         * /api/v1/organization/payer-service-code/{id}:
         *   delete:
         *     summary: Delete a payer-service code mapping
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Payer service code deleted successfully
         */
        this.router.delete("/:id", this.controller.deletePayerServiceCode);
    }

    getRouter() {
        return this.router;
    }
}

export default new PayerServiceCodeRoutes().getRouter();
