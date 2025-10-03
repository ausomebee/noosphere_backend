import express from "express";
import PayerController from "../controllers/payerController.js";
import PayerDto from "../dto/payerDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     PayerCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - payerName
 *         - email
 *         - phone
 *         - insuranceTypeId
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         payerName:
 *           type: string
 *           description: Name of the payer
 *           example: "Blue Cross"
 *         email:
 *           type: string
 *           format: email
 *           description: Contact email of the payer
 *           example: "support@bluecross.com"
 *         phone:
 *           type: string
 *           description: Contact phone of the payer
 *           example: "+1-555-123-4567"
 *         insuranceTypeId:
 *           type: string
 *           format: uuid
 *           description: Linked insurance type
 *         tplCode:
 *           type: string
 *           description: Third-party liability code
 *         carrierPayerId:
 *           type: string
 *           description: Unique payer identifier from carrier
 *         address:
 *           type: string
 *           description: Payer’s street address
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         zip:
 *           type: string
 *         country:
 *           type: string
 *         serviceCodes:
 *           type: object
 *           description: JSON object containing payer service codes
 *         isActive:
 *           type: boolean
 *           default: true
 *         isDeleted:
 *           type: boolean
 *           default: false
 *
 *     PayerUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *         - payerName
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the payer
 *         tenantId:
 *           type: string
 *           format: uuid
 *         payerName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         insuranceTypeId:
 *           type: string
 *           format: uuid
 *         tplCode:
 *           type: string
 *         carrierPayerId:
 *           type: string
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         zip:
 *           type: string
 *         country:
 *           type: string
 *         serviceCodes:
 *           type: object
 *         isActive:
 *           type: boolean
 *         isDeleted:
 *           type: boolean
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
         * /api/v1/organization/payer:
         *   post:
         *     summary: Create a new payer
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PayerCreateDto'
         *     responses:
         *       201:
         *         description: Payer created successfully
         */
        this.router.post("/", PayerDto.createPayerDto, this.controller.createPayer);

        /**
         * @swagger
         * /api/v1/organization/payer:
         *   put:
         *     summary: Update an existing payer
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PayerUpdateDto'
         *     responses:
         *       200:
         *         description: Payer updated successfully
         */
        this.router.put("/", PayerDto.updatePayerDto, this.controller.updatePayer);

        /**
         * @swagger
         * /api/v1/organization/payer/tenant/{tenantId}:
         *   get:
         *     summary: Get all payers for a tenant
         *     tags: [organization]
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
         * /api/v1/organization/payer/{id}:
         *   get:
         *     summary: Get a single payer by ID
         *     tags: [organization]
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
         * /api/v1/organization/payer/{id}:
         *   delete:
         *     summary: Delete a payer
         *     tags: [organization]
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
        this.router.delete("/:id", this.controller.deletePayer);
    }

    getRouter() {
        return this.router;
    }
}

export default new PayerRoutes().getRouter();
