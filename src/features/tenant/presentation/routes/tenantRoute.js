import express from "express";
import TenantDto from "../dto/tenantDto.js";
import TenantController from "../controllers/tenantController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTenant:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - phoneNumber
 *         - stage
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           example: StrongPassword123!
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *           maxLength: 15
 *           example: 08012345678
 *         stage:
 *           type: string
 *           example: registration
 *
 *     CreateTenantStaff:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - phoneNumber
 *         - stage
 *         - roleId
 *         - tenantId
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           example: Admin User
 *         email:
 *           type: string
 *           format: email
 *           example: admin@tenant.com
 *         password:
 *           type: string
 *           example: AdminPass@2023
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *           maxLength: 15
 *           example: 08098765432
 *         stage:
 *           type: string
 *           example: onboarding
 *         roleId:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: 987e6543-e21b-43d3-c456-123456789abc
 *
 *     StaffSignin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: staff@tenant.com
 *         password:
 *           type: string
 *           example: SecurePass123!
 */

class TenantRoutes {
    constructor() {
        this.controller = new TenantController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/tenant/createtenant:
         *   post:
         *     summary: Create a new tenant
         *     tags: [Tenant]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateTenantDto'
         *     responses:
         *       201:
         *         description: Tenant created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/createtenant", TenantDto.createTenantDto, this.controller.createTenant);

        /**
         * @swagger
         * /api/v1/tenant/createtenantstaff:
         *   post:
         *     summary: Create a new tenant staff
         *     tags: [Tenant]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateTenantStaffDto'
         *     responses:
         *       201:
         *         description: Tenant staff created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/createtenantstaff", TenantDto.createTenantStaffDto, this.controller.createTenantStaff);

        /**
         * @swagger
         * /api/v1/tenant/staffsignin:
         *   post:
         *     summary: Staff sign in
         *     tags: [Tenant]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/StaffSigninDto'
         *     responses:
         *       200:
         *         description: Sign-in successful
         *       401:
         *         description: Invalid credentials
         */
        this.router.post("/staffsignin", TenantDto.staffSigninDto, this.controller.staffSignin);

        /**
         * @swagger
         * /api/v1/tenant/getstaff/{id}:
         *   get:
         *     summary: gets single staff
         *     tags: [staff]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the staff
         *     responses:
         *       200:
         *         description: staff fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/getstaff/:id", TenantDto.getSingleStaffDto, this.controller.getSingleStaff);

    }

    getRouter() {
        return this.router;
    }
}

export default new TenantRoutes().getRouter();