import express from "express";
import PayerController from "../controllers/payerController.js";
import PayerDto from "../dto/payerDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceCode:
 *       type: object
 *       required:
 *         - code
 *         - description
 *         - unitCurrency
 *         - ratePerUnit
 *         - roundingRuleId
 *         - modifiers
 *         - billable
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the payer service code (for updates only)
 *           example: "a0d9b5a2-7f0b-45c7-8f3e-43f1b7f0fdf3"
 *         serviceCodeId:
 *           type: string
 *           format: uuid
 *           description: Reference to an existing service code
 *           example: "f1e02d91-c8b7-4bc5-a764-8aebf9dfe8bc"
 *         code:
 *           type: string
 *           description: Service code identifier
 *           example: "97151"
 *         description:
 *           type: string
 *           description: Description of the service code
 *           example: "Initial/periodic assessment by a BCBA, including development of treatment plan."
 *         unitCurrency:
 *           type: string
 *           description: Currency code (ISO 4217)
 *           example: "USD"
 *         ratePerUnit:
 *           type: number
 *           description: Billing rate per unit
 *           example: 125.50
 *         roundingRuleId:
 *           type: string
 *           format: uuid
 *           description: Reference to rounding rule
 *           example: "94b39b7d-5146-4e58-b4d7-c3ab8a5f1f4b"
 *         modifiers:
 *           type: object
 *           description: Dynamic modifier fields (e.g., CPT modifiers)
 *           additionalProperties:
 *             type: string
 *           example:
 *             modifier1: "U1"
 *             modifier2: "U2"
 *         billable:
 *           type: boolean
 *           description: Indicates if service is billable
 *           example: true
 *
 *     CreatePayer:
 *       type: object
 *       required:
 *         - tenantId
 *         - payerName
 *         - email
 *         - phone
 *         - insuranceTypeId
 *         - tplCode
 *         - carrierPayerId
 *         - address
 *         - city
 *         - state
 *         - zip
 *         - country
 *         - serviceCodes
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "8d833659-e3a1-4702-88af-8f7c9fc1ad82"
 *         payerName:
 *           type: string
 *           example: "Blue Cross Health Insurance"
 *         email:
 *           type: string
 *           format: email
 *           example: "contact@bluecross.com"
 *         phone:
 *           type: string
 *           example: "+1-202-555-0187"
 *         insuranceTypeId:
 *           type: string
 *           format: uuid
 *           example: "b3f8c7d4-9357-4ad4-8428-9a3fd88d6a5c"
 *         tplCode:
 *           type: string
 *           example: "TPL-001"
 *         carrierPayerId:
 *           type: string
 *           example: "CPI-9845"
 *         address:
 *           type: string
 *           example: "123 Main Street, Suite 405"
 *         city:
 *           type: string
 *           example: "Lagos"
 *         state:
 *           type: string
 *           example: "Lagos"
 *         zip:
 *           type: string
 *           example: "100001"
 *         country:
 *           type: string
 *           example: "Nigeria"
 *         serviceCodes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ServiceCode'
 *           example:
 *             - code: "97151"
 *               description: "Initial behavioral assessment"
 *               unitCurrency: "USD"
 *               ratePerUnit: 125.5
 *               roundingRuleId: "94b39b7d-5146-4e58-b4d7-c3ab8a5f1f4b"
 *               modifiers:
 *                 modifier1: "U1"
 *                 modifier2: "U2"
 *               billable: true
 *             - code: "97155"
 *               description: "Adaptive behavior treatment"
 *               unitCurrency: "USD"
 *               ratePerUnit: 150.0
 *               roundingRuleId: "8b293b0a-8348-49a8-8f5e-ff63d60b8f3b"
 *               modifiers:
 *                 modifier1: "U3"
 *               billable: true
 *
 *     UpdatePayer:
 *       allOf:
 *         - $ref: '#/components/schemas/CreatePayer'
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "1b3c7f8e-4b9b-4a61-bf8c-dfe8d22b96d1"
 *         isActive:
 *           type: boolean
 *           example: true
 *         isDeleted:
 *           type: boolean
 *           example: false
 */

class PayerRoutes {
    constructor() {
        this.controller = new PayerController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/payers/:
         *   post:
         *     summary: Create a new payer
         *     tags: [payers]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreatePayerInput'
         *     responses:
         *       201:
         *         description: Payer created successfully
         */
        this.router.post("/", PayerDto.createPayerDto, this.controller.createPayer);

        /**
         * @swagger
         * /api/v1/payers/:
         *   put:
         *     summary: Update an existing payer
         *     tags: [payers]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdatePayerInput'
         *     responses:
         *       200:
         *         description: Payer updated successfully
         */
        this.router.put("/", PayerDto.updatePayerDto, this.controller.updatePayer);

        /**
         * @swagger
         * /api/v1/payers/tenant/{tenantId}:
         *   get:
         *     summary: Get all payers for a tenant
         *     tags: [payers]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of payers for the tenant
         */
        this.router.get("/tenant/:tenantId", this.controller.getTenantPayers);

        /**
         * @swagger
         * /api/v1/payers/{id}:
         *   get:
         *     summary: Get a single payer by ID
         *     tags: [payers]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Payer fetched successfully
         */
        this.router.get("/:id", this.controller.getSinglePayer);

        /**
         * @swagger
         * /api/v1/payers/{id}/{active}:
         *   patch:
         *     summary: Delete a payer
         *     tags: [payers]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Payer deleted successfully
         */
        this.router.patch("/:id/:active", this.controller.deactivatePayer);
    }

    getRouter() {
        return this.router;
    }
}

export default new PayerRoutes().getRouter();
