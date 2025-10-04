import express from "express";
import PayerController from "../controllers/payerController.js";
import PayerDto from "../dto/payerDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePayerInput:
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
 *           example: "claims@bluecross.com"
 *         phone:
 *           type: string
 *           example: "+1-202-555-0167"
 *         insuranceTypeId:
 *           type: string
 *           format: uuid
 *           example: "c98d84b1-8f60-4b9f-b85d-7b9c9c99e22b"
 *         tplCode:
 *           type: string
 *           example: "TPL-001"
 *         carrierPayerId:
 *           type: string
 *           example: "CARR-BC123"
 *         address:
 *           type: string
 *           example: "123 Blue Cross Blvd"
 *         city:
 *           type: string
 *           example: "Austin"
 *         state:
 *           type: string
 *           example: "Texas"
 *         zip:
 *           type: string
 *           example: "73301"
 *         country:
 *           type: string
 *           example: "USA"
 *         isActive:
 *           type: boolean
 *           example: true
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         serviceCodes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ServiceCodeInput'
 *
 *     UpdatePayerInput:
 *       allOf:
 *         - $ref: '#/components/schemas/CreatePayerInput'
 *         - type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "3f90b630-019d-42a7-a255-4bdf4b530cd8"
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
