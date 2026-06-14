import express from "express";
import TenantStaffController from "../controller/staffController.js";
import StaffDto from "../dto/staffDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     TenantStaffCreateDto:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - roleId
 *         - phoneNumber
 *         - tenantId
 *       properties:
 *         fullName:
 *           type: string
 *           description: Full name of the staff member
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the staff member
 *           example: "john.doe@example.com"
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the role
 *         roleId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the role
 *         dob:
 *           type: string
 *           description: Date of birth
 *           example: "1990-01-01"
 *         gender:
 *           type: string
 *           description: Gender of the staff member
 *           example: "Male"
 *         npi:
 *           type: string
 *           description: National Provider Identifier
 *           example: "1234567890"
 *         address:
 *           type: string
 *           description: Address of the staff member
 *           example: "123 Main St"
 *         city:
 *           type: string
 *           description: City of the staff member
 *           example: "New York"
 *         state:
 *           type: string
 *           description: State of the staff member
 *           example: "NY"
 *         zip:
 *           type: string
 *           description: Zip code
 *           example: "10001"
 *         country:
 *           type: string
 *           description: Country of the staff member
 *           example: "USA"
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the staff member
 *           example: "+1234567890"
 *         active:
 *           type: boolean
 *           description: Indicates if the staff member is active
 *           default: true
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               documentsUrl:
 *                 type: object
 *                 description: JSON object containing document URLs
 *         licenses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               licenseName:
 *                 type: string
 *                 description: Name of the license
 *                 example: "Medical License"
 *               licenseNumber:
 *                 type: string
 *                 description: License number
 *                 example: "LIC123456"
 *               issueState:
 *                 type: string
 *                 description: State issuing the license
 *                 example: "NY"
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *                 description: Expiry date of the license
 *         payroll:
 *           type: object
 *           properties:
 *             paymentSchedule:
 *               type: string
 *               description: Payment schedule
 *               example: "Monthly"
 *             ratePerHour:
 *               type: string
 *               description: Hourly rate
 *               example: "50.00"
 *             minimumHours:
 *               type: string
 *               description: Minimum hours required
 *               example: "40"
 *             otherPays:
 *               type: array
 *               description: Additional pay details
 *               items:
 *                 type: object
 *             deductions:
 *               type: array
 *               description: Deduction details
 *               items:
 *                 type: object
 *
 *     TenantStaffUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the staff member
 *         fullName:
 *           type: string
 *           description: Full name of the staff member
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the staff member
 *         roleId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the role
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the tenant
 *         dob:
 *           type: string
 *           description: Date of birth
 *         gender:
 *           type: string
 *           description: Gender of the staff member
 *         npi:
 *           type: string
 *           description: National Provider Identifier
 *         address:
 *           type: string
 *           description: Address of the staff member
 *         city:
 *           type: string
 *           description: City of the staff member
 *         state:
 *           type: string
 *           description: State of the staff member
 *         zip:
 *           type: string
 *           description: Zip code
 *         country:
 *           type: string
 *           description: Country of the staff member
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the staff member
 *         active:
 *           type: boolean
 *           description: Indicates if the staff member is active
 *         isDeleted:
 *           type: boolean
 *           description: Indicates if the staff member is deleted
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Unique identifier for the document
 *               documentsUrl:
 *                 type: object
 *                 description: JSON object containing document URLs
 *               tenantStaffId:
 *                 type: string
 *                 format: uuid
 *                 description: Unique identifier for the staff member
 *               isDeleted:
 *                 type: boolean
 *                 description: Indicates if the document is deleted
 *         licenses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Unique identifier for the license
 *               licenseName:
 *                 type: string
 *                 description: Name of the license
 *               licenseNumber:
 *                 type: string
 *                 description: License number
 *               issueState:
 *                 type: string
 *                 description: State issuing the license
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *                 description: Expiry date of the license
 *               tenantStaffId:
 *                 type: string
 *                 format: uuid
 *                 description: Unique identifier for the staff member
 *               isDeleted:
 *                 type: boolean
 *                 description: Indicates if the license is deleted
 *         payroll:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: Unique identifier for the payroll
 *             paymentSchedule:
 *               type: string
 *               description: Payment schedule
 *             ratePerHour:
 *               type: string
 *               description: Hourly rate
 *             minimumHours:
 *               type: string
 *               description: Minimum hours required
 *             otherPays:
 *               type: array
 *               description: Additional pay details
 *               items:
 *                 type: object
 *             deductions:
 *               type: array
 *               description: Deduction details
 *               items:
 *                 type: object
 *     TenantStaffOnlyUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the staff member
 *         fullName:
 *           type: string
 *           description: Full name of the staff member
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the staff member
 *         roleId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the role
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the tenant
 *         dob:
 *           type: string
 *           description: Date of birth
 *         gender:
 *           type: string
 *           description: Gender of the staff member
 *         npi:
 *           type: string
 *           description: National Provider Identifier
 *         address:
 *           type: string
 *           description: Address of the staff member
 *         city:
 *           type: string
 *           description: City of the staff member
 *         state:
 *           type: string
 *           description: State of the staff member
 *         zip:
 *           type: string
 *           description: Zip code
 *         country:
 *           type: string
 *           description: Country of the staff member
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the staff member
 *         active:
 *           type: boolean
 *           description: Indicates if the staff member is active
 *         isDeleted:
 *           type: boolean
 *           description: Indicates if the staff member is deleted
 */

class TenantStaffRoutes {
    constructor() {
        this.controller = new TenantStaffController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization-staff/staff:
         *   post:
         *     summary: Create a tenant staff member
         *     tags: [organization-staff]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantStaffCreateDto'
         *     responses:
         *       201:
         *         description: Tenant staff created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", staffProtect(), StaffDto.createTenantStaffDto, this.controller.createTenantStaff);

        /**
         * @swagger
         * /api/v1/organization-staff/staff/:
         *   put:
         *     summary: Update a tenant staff member
         *     tags: [organization-staff]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantStaffUpdateDto'
         *     responses:
         *       200:
         *         description: Tenant staff updated successfully
         *       400:
         *         description: Validation error
         *       404:
         *         description: Staff not found
         */
        this.router.put("/", staffProtect(), StaffDto.updateTenantStaffDto, this.controller.updateTenantStaff);

        /**
         * @swagger
         * /api/v1/organization-staff/staff/staff:
         *   put:
         *     summary: Update a tenant staff member
         *     tags: [organization-staff]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantStaffOnlyUpdateDto'
         *     responses:
         *       200:
         *         description: Tenant staff updated successfully
         *       400:
         *         description: Validation error
         *       404:
         *         description: Staff not found
         */
        this.router.put("/staff", staffProtect(), StaffDto.updateTenantStaffOnlyDto, this.controller.updateTenantStaff);

        /**
         * @swagger
         * /api/v1/organization-staff/staff/tenant/{tenantId}:
         *   get:
         *     summary: Get all staff for a tenant
         *     tags: [organization-staff]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the tenant
         *     responses:
         *       200:
         *         description: Tenant staff members fetched successfully
         *       404:
         *         description: Staff not found
         */
        this.router.get("/tenant/:tenantId", staffProtect(), this.controller.getTenantStaffs);

        /**
         * @swagger
         * /api/v1/organization-staff/staff/{id}:
         *   get:
         *     summary: Get a single tenant staff member
         *     tags: [organization-staff]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the staff member
         *     responses:
         *       200:
         *         description: Tenant staff fetched successfully
         *       404:
         *         description: Staff not found
         */
        this.router.get("/:id", staffProtect(), this.controller.getStaff);

        /**
         * @swagger
         * /api/v1/organization-staff/staff/details/{id}:
         *   get:
         *     summary: Get a single tenant staff member
         *     tags: [organization-staff]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the staff member
         *     responses:
         *       200:
         *         description: Tenant staff fetched successfully
         *       404:
         *         description: Staff not found
         */
        this.router.get("/details/:id", staffProtect(), this.controller.getStaffDetails);

        /**
         * @swagger
         * /api/v1/organization-staff/staff/active/{id}/{active}:
         *   patch:
         *     summary: Activate or deactivate a tenant staff member
         *     tags: [organization-staff]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the staff member
         *       - in: path
         *         name: active
         *         required: true
         *         schema:
         *           type: boolean
         *         description: Set to `true` to activate or `false` to deactivate
         *     responses:
         *       200:
         *         description: Tenant staff status updated successfully
         *       400:
         *         description: Invalid request
         *       404:
         *         description: Staff not found
         */
        this.router.patch("/active/:id/:active", staffProtect(), this.controller.updateTenantStaff);
    }

    getRouter() {
        return this.router;
    }
}

export default new TenantStaffRoutes().getRouter();