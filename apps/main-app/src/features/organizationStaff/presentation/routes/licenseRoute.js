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
 *         - licenseName
 *         - licenseNumber
 *         - tenantStaffId
 *         - issueState
 *         - expiryDate
 *       properties:
 *         licenseName:
 *           type: string
 *           description: Name of the license
 *           example: "Medical License"
 *         licenseNumber:
 *           type: string
 *           description: License number
 *           example: "LIC123456"
 *         tenantStaffId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the staff member
 *         issueState:
 *           type: string
 *           description: State issuing the license
 *           example: "NY"
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: Expiry date of the license
 * 
 *     LicenseUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - licenseName
 *         - licenseNumber
 *         - tenantStaffId
 *         - issueState
 *         - expiryDate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the license
 *         licenseName:
 *           type: string
 *           description: Name of the license
 *           example: "Medical License"
 *         licenseNumber:
 *           type: string
 *           description: License number
 *           example: "LIC123456"
 *         tenantStaffId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the staff member
 *         issueState:
 *           type: string
 *           description: State issuing the license
 *           example: "NY"
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: Expiry date of the license
 *         isDeleted:
 *           type: boolean
 *           description: Indicates if the license is deleted
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
         * /api/v1/organization-staff/license:
         *   post:
         *     summary: Create a tenant staff license
         *     tags: [organization-staff]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/LicenseCreateDto'
         *     responses:
         *       200:
         *         description: License created successfully
         *       400:
         *         description: Validation error
         *       404:
         *         description: License not found
         */
        this.router.post("/", staffProtect(), LicenseDto.createLicenseDto, this.controller.createStaffLicense);

        /**
         * @swagger
         * /api/v1/organization-staff/license:
         *   put:
         *     summary: Update a tenant staff license
         *     tags: [organization-staff]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/LicenseUpdateDto'
         *     responses:
         *       200:
         *         description: License updated successfully
         *       400:
         *         description: Validation error
         *       404:
         *         description: License not found
         */
        this.router.put("/", staffProtect(), LicenseDto.updateLicenseDto, this.controller.updateLicense);

        /**
         * @swagger
         * /api/v1/organization-staff/license/tenant-staff/{tenantStaffId}:
         *   get:
         *     summary: Get all licenses for a tenant staff
         *     tags: [organization-staff]
         *     parameters:
         *       - in: path
         *         name: tenantStaffId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the tenant staff
         *     responses:
         *       200:
         *         description: Licenses fetched successfully
         *       404:
         *         description: Licenses not found
         */
        this.router.get("/tenant-staff/:tenantStaffId", staffProtect(), this.controller.getTenantStaffLicenses);

        /**
         * @swagger
         * /api/v1/organization-staff/license/{id}:
         *   get:
         *     summary: Get a single tenant staff license
         *     tags: [organization-staff]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the license
         *     responses:
         *       200:
         *         description: License fetched successfully
         *       404:
         *         description: License not found
         */
        this.router.get("/:id", staffProtect(), this.controller.getLicense);

        /**
         * @swagger
         * /api/v1/organization-staff/license/deleted/{id}/{isDeleted}:
         *   patch:
         *     summary: Mark a tenant staff license as deleted or not
         *     tags: [organization-staff]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the license
         *       - in: path
         *         name: isDeleted
         *         required: true
         *         schema:
         *           type: boolean
         *         description: Set to `true` to mark as deleted or `false` to restore
         *     responses:
         *       200:
         *         description: License status updated successfully
         *       400:
         *         description: Invalid request
         *       404:
         *         description: License not found
         */
        this.router.patch("/deleted/:id/:isDeleted", staffProtect(), this.controller.updateLicense);
    }

    getRouter() {
        return this.router;
    }
}

export default new LicenseRoutes().getRouter();