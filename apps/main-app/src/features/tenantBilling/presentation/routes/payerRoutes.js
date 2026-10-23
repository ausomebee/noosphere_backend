import express from "express";
import PayerController from "../controllers/payerController.js";
import PayerDto from "../dto/payerDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceCode:
 *       type: object
 *       required:
 *         - unitCurrency
 *         - ratePerUnit
 *         - roundingRuleId
 *         - billable
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the payer service code (for updates only)
 *           example: "a5a4e3bc-3339-4b8c-9b92-9c14e813b222"
 *         serviceCodeId:
 *           type: string
 *           format: uuid
 *           description: Reference to an existing service code (use this if already created)
 *           example: "6c9b9b3f-02c0-498b-8e7a-3e89e9e3a8f9"
 *         code:
 *           type: string
 *           description: New service code identifier (required if creating a new one)
 *           example: "97151"
 *         description:
 *           type: string
 *           description: Description of the service code (required if creating a new one)
 *           example: "Initial/periodic assessment by a BCBA, including development of treatment plan."
 *         unitCurrency:
 *           type: string
 *           description: ISO 4217 currency code
 *           example: "NGN"
 *         ratePerUnit:
 *           type: number
 *           description: Billing rate per unit
 *           example: 5000
 *         roundingRuleId:
 *           type: string
 *           format: uuid
 *           description: Reference to rounding rule ID
 *           example: "b6fba91e-5a7e-4e4a-8f29-8027a22184f5"
 *         modifiers:
 *           type: array
 *           description: Array of modifier strings
 *           items:
 *             type: string
 *           example: ["GT", "59"]
 *         billable:
 *           type: boolean
 *           description: Indicates if service code is billable
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
 *           example: "d44c229e-3f21-4c94-9d45-0f8f1efb8d99"
 *         payerName:
 *           type: string
 *           example: "HealthSure Insurance Ltd"
 *         email:
 *           type: string
 *           format: email
 *           example: "claims@healthsure.com"
 *         phone:
 *           type: string
 *           example: "+2348067891234"
 *         insuranceTypeId:
 *           type: string
 *           format: uuid
 *           example: "b21cc3f9-6e67-41a4-9215-bf97f453ac2f"
 *         tplCode:
 *           type: string
 *           example: "TPL-2001"
 *         carrierPayerId:
 *           type: string
 *           example: "HS-458"
 *         address:
 *           type: string
 *           example: "15 Adeola Odeku Street"
 *         city:
 *           type: string
 *           example: "Victoria Island"
 *         state:
 *           type: string
 *           example: "Lagos"
 *         zip:
 *           type: string
 *           example: "101241"
 *         country:
 *           type: string
 *           example: "Nigeria"
 *         isActive:
 *           type: boolean
 *           example: true
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         serviceCodes:
 *           type: array
 *           description: List of service codes linked to this payer
 *           items:
 *             $ref: '#/components/schemas/ServiceCode'
 *           example:
 *             - id: "a5a4e3bc-3339-4b8c-9b92-9c14e813b222"
 *               serviceCodeId: "6c9b9b3f-02c0-498b-8e7a-3e89e9e3a8f9"
 *               unitCurrency: "NGN"
 *               modifiers: ["U1", "U2"]
 *               ratePerUnit: 2500
 *               roundingRuleId: "ad12c9e1-1e84-4932-99e7-44f80a0d9f00"
 *               billable: true
 *             - serviceCodeId: "1f8a3f4a-73e1-49e5-a4ef-3e93ec50e02a"
 *               unitCurrency: "NGN"
 *               modifiers: ["GT"]
 *               ratePerUnit: 4500
 *               roundingRuleId: "ad12c9e1-1e84-4932-99e7-44f80a0d9f00"
 *               billable: true
 *             - code: "97151"
 *               description: "Initial/periodic assessment by a BCBA, including development of treatment plan."
 *               modifiers: ["U3", "59"]
 *               unitCurrency: "NGN"
 *               ratePerUnit: 5000
 *               roundingRuleId: "b6fba91e-5a7e-4e4a-8f29-8027a22184f5"
 *               billable: true
 *
 *     UpdatePayer:
 *       type: object
 *       required:
 *         - id
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
 *         - country
 *         - serviceCodes
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique payer ID (required for updates)
 *           example: "7b74b0b4-6571-45ce-98d1-1b5c8e0a412a"
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "d44c229e-3f21-4c94-9d45-0f8f1efb8d99"
 *         payerName:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "HealthSure Insurance Ltd"
 *         email:
 *           type: string
 *           format: email
 *           example: "claims@healthsure.com"
 *         phone:
 *           type: string
 *           minLength: 5
 *           maxLength: 20
 *           example: "+2348067891234"
 *         insuranceTypeId:
 *           type: string
 *           format: uuid
 *           example: "b21cc3f9-6e67-41a4-9215-bf97f453ac2f"
 *         tplCode:
 *           type: string
 *           maxLength: 50
 *           example: "TPL-2001"
 *         carrierPayerId:
 *           type: string
 *           maxLength: 50
 *           example: "HS-458"
 *         address:
 *           type: string
 *           maxLength: 200
 *           example: "15 Adeola Odeku Street"
 *         city:
 *           type: string
 *           maxLength: 100
 *           example: "Victoria Island"
 *         state:
 *           type: string
 *           maxLength: 100
 *           example: "Lagos"
 *         zip:
 *           type: string
 *           maxLength: 20
 *           nullable: true
 *           example: "101241"
 *         country:
 *           type: string
 *           maxLength: 100
 *           example: "Nigeria"
 *         isActive:
 *           type: boolean
 *           default: true
 *           example: true
 *         isDeleted:
 *           type: boolean
 *           default: false
 *           example: false
 *         serviceCodes:
 *           type: array
 *           minItems: 1
 *           description: List of service codes associated with this payer
 *           items:
 *             type: object
 *             required:
 *               - code
 *               - description
 *               - unitCurrency
 *               - ratePerUnit
 *               - roundingRuleId
 *               - billable
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Unique ID of this payer's service code (optional)
 *                 example: "a5a4e3bc-3339-4b8c-9b92-9c14e813b222"
 *               serviceCodeId:
 *                 type: string
 *                 description: Reference to an existing service code or alphanumeric identifier
 *                 example: "6c9b9b3f-02c0-498b-8e7a-3e89e9e3a8f9"
 *               code:
 *                 type: string
 *                 maxLength: 50
 *                 description: Service code identifier
 *                 example: "97151"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Initial/periodic assessment by a BCBA, including development of treatment plan."
 *               unitCurrency:
 *                 type: string
 *                 maxLength: 10
 *                 example: "NGN"
 *               ratePerUnit:
 *                 type: number
 *                 example: 5000
 *               roundingRuleId:
 *                 type: string
 *                 format: uuid
 *                 example: "b6fba91e-5a7e-4e4a-8f29-8027a22184f5"
 *               modifiers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["GT", "59"]
 *               billable:
 *                 type: boolean
 *                 example: true
 *           example:
 *             - id: "a5a4e3bc-3339-4b8c-9b92-9c14e813b222"
 *               serviceCodeId: "6c9b9b3f-02c0-498b-8e7a-3e89e9e3a8f9"
 *               code: "97151"
 *               description: "Initial/periodic assessment by a BCBA, including development of treatment plan."
 *               unitCurrency: "NGN"
 *               ratePerUnit: 5000
 *               roundingRuleId: "b6fba91e-5a7e-4e4a-8f29-8027a22184f5"
 *               modifiers: ["GT"]
 *               billable: true
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
         *             $ref: '#/components/schemas/CreatePayer'
         *     responses:
         *       201:
         *         description: Payer created successfully
         */
        this.router.post("/", staffProtect(), PayerDto.createPayerDto, this.controller.createPayer);

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
         *             $ref: '#/components/schemas/UpdatePayer'
         *     responses:
         *       200:
         *         description: Payer updated successfully
         */
        this.router.put("/", staffProtect(), PayerDto.updatePayerDto, this.controller.updatePayer);

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
        this.router.get("/tenant/:tenantId", staffProtect(), this.controller.getTenantPayers);

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
        this.router.get("/:id", staffProtect(), this.controller.getSinglePayer);

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
        this.router.patch("/:id/:active", staffProtect(), this.controller.deactivatePayer);
    }

    getRouter() {
        return this.router;
    }
}

export default new PayerRoutes().getRouter();
