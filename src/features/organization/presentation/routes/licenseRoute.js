import express from "express";
import LicenseController from "../controller/licenseController.js";
import LicenseDto from "../dto/licenseDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     LicenseCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - licenseName
 *         - licenseNumber
 *         - issueState
 *         - expiryDate
 *       properties:
 *         tenantId:
 *           type: string
 *           description: Unique tenant identifier
 *         licenseName:
 *           type: string
 *           description: Name of the license
 *           example: "Medical Practice License"
 *         licenseNumber:
 *           type: string
 *           description: License number
 *           example: "LIC-123456"
 *         issueState:
 *           type: string
 *           description: issue state of the license
 *           example: "2024-01-01"
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Date the license will expire 
 *           example: "2026-01-01"
 *
 *     LicenseUpdateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - licenseName
 *         - licenseNumber
 *         - issueState
 *         - expiryDate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the license (optional on update)
 *         tenantId:
 *           type: string
 *           description: Unique tenant identifier
 *         licenseName:
 *           type: string
 *           description: Name of the license
 *         licenseNumber:
 *           type: string
 *           description: License number
 *         issueState:
 *           type: string
 *           description: issue state of the license
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Date the license will expire 
 */

class LicenseRoutes {
    constructor() {
        this.controller = new LicenseController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/license:
         *   post:
         *     summary: Create organization license
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/LicenseCreateDto'
         *     responses:
         *       201:
         *         description: Organization license created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", staffProtect, LicenseDto.createLicenseDto, this.controller.createLicense);

        /**
         * @swagger
         * /api/v1/organization/license:
         *   put:
         *     summary: Update organization license
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/LicenseUpdateDto'
         *     responses:
         *       201:
         *         description: Organization license updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.put("/", staffProtect, LicenseDto.updateLicenseDto, this.controller.updateLicense);

        /**
        * @swagger
        * /api/v1/organization/license/tenant/{tenantId}:
        *   get:
        *     summary: gets tenant organization license
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
        *         description: organization license fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant/:tenantId", staffProtect, this.controller.getTenantLicense);

        /**
        * @swagger
        * /api/v1/organization/license/{id}:
        *   get:
        *     summary: gets single organization license
        *     tags: [organization]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the license
        *     responses:
        *       200:
        *         description: organization license fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/:id", staffProtect, this.controller.getSingleLicense);

        /**
        * @swagger
        * /api/v1/organization/license/{id}:
        *   delete:
        *     summary: deletes an organization license
        *     tags: [organization]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the license
        *     responses:
        *       200:
        *         description: organization license deleted successfully
        *       400:
        *         description: Validation error
        */
        this.router.delete("/:id", staffProtect, this.controller.deleteLicense);

    }

    getRouter() {
        return this.router;
    }
}

export default new LicenseRoutes().getRouter();