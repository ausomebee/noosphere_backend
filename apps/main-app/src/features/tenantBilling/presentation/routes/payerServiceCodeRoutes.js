import express from "express";
import PayerServiceCodesController from "../controllers/payerServiceCodesController.js";
import PayerServiceCodesDto from "../dto/payerServiceCodesDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePayerServiceCodeDto:
 *       type: array
 *       minItems: 1
 *       items:
 *         type: object
 *         required:
 *           - tenantId
 *           - payerId
 *           - code
 *           - description
 *           - unitCurrency
 *           - ratePerUnit
 *           - roundingRuleId
 *           - modifiers
 *           - billable
 *         properties:
 *           tenantId:
 *             type: string
 *             format: uuid
 *             example: "b2b89f08-5b8b-4b39-8e87-4b2c9f95f3c5"
 *           payerId:
 *             type: string
 *             format: uuid
 *             example: "8d833659-e3a1-4702-88af-8f7c9fc1ad82"
 *           serviceCodeId:
 *             type: string
 *             format: uuid
 *             nullable: true
 *             example: "0e51f67e-36c5-4f9e-bfe9-d35c73dbd918"
 *           code:
 *             type: string
 *             example: "97151"
 *           description:
 *             type: string
 *             example: "Initial assessment by BCBA"
 *           unitCurrency:
 *             type: string
 *             example: "USD"
 *           ratePerUnit:
 *             type: number
 *             example: 125.5
 *           roundingRuleId:
 *             type: string
 *             format: uuid
 *             example: "bd3567f3-39e1-4a26-9f0c-827705ff582a"
 *           modifiers:
 *             type: array
 *             items:
 *               type: string
 *             example: ["KX", "GT"]
 *           billable:
 *             type: boolean
 *             example: true
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
         * /api/v1/payer-service-codes/:
         *   post:
         *     summary: Create payer-service code mapping
         *     tags: [payer-service-code]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreatePayerServiceCodeDto'
         *     responses:
         *       201:
         *         description: Payer service code created successfully
         */
        this.router.post("/", staffProtect(), PayerServiceCodesDto.createPayerServiceCodeDto, this.controller.createPayerServiceCode);

        /**
         * @swagger
         * /api/v1/payer-service-codes/{id}/{active}:
         *   patch:
         *     summary: Deactivate payer service code
         *     tags: [payer-service-code]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *       - in: path
         *         name: active
         *         required: true
         *         schema:
         *           type: boolean
         *     responses:
         *       200:
         *         description: Payer service code deactivated successfully
         */
        this.router.patch("/:id/:active", staffProtect(), this.controller.deactivatePayerServiceCode);

    }

    getRouter() {
        return this.router;
    }
}

export default new PayerServiceCodeRoutes().getRouter();
