import express from "express";
import AdminController from "../controllers/adminController.js";
import AdminDto from "../dto/adminDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAdmin:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - phoneNumber
 *         - roleId
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           description: Full name of the admin (3-20 characters)
 *         email:
 *           type: string
 *           format: email
 *           description: Valid email (must end with .com or .net)
 *         password:
 *           type: string
 *           pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
 *           description: >-
 *             Password must be strong:
 *             - At least one uppercase letter  
 *             - At least one lowercase letter  
 *             - At least one digit  
 *             - At least one special character (#?!@$%^&*-)  
 *             - Minimum 8 characters
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *           maxLength: 15
 *           description: Phone number (10 to 15 digits)
 *         description:
 *           type: string
 *           description: Optional description of the admin
 *         roleId:
 *           type: string
 *           format: uuid
 *           description: UUID of the assigned role
 *
 *     AuthRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: example@example.com
 *           description: Must be a valid email (e.g., user@domain.com or user@domain.net)
 *         password:
 *           type: string
 *           format: password
 *           description: Must match the strong password requirements
 *           example: StrongP@ssw0rd!
 *
 *     UpdateAdminPasswordDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "e77e41fe-124f-4eeb-b13e-5dfe119b1d01"
 *           description: Unique admin ID
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           maxLength: 100
 *           example: "StrongP@ssw0rd!"
 *           description: New password (must be strong)
 *     updateAdministratorPasswordDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "e77e41fe-124f-4eeb-b13e-5dfe119b1d01"
 *           description: Unique admin ID
 *         currentAdministratorPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           maxLength: 100
 *           example: "StrongP@ssw0rd!"
 *           description: New password (must be strong)
 *         administratorPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           maxLength: 100
 *           example: "StrongP@ssw0rd!"
 *           description: New password (must be strong)
 */

class AdminRoutes {
    constructor() {
        this.controller = new AdminController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/admin/createadmin:
         *   post:
         *     summary: create a new admin
         *     tags: [admin]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateAdmin'
         *     responses:
         *       201:
         *         description: Admin created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/createadmin", AdminDto.createAdminDto, this.controller.createAdmin);

        /**
         * @swagger
         * /api/v1/admin/createsuperadmin:
         *   post:
         *     summary: create a new super admin
         *     tags: [super admin]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateAdmin'
         *     responses:
         *       201:
         *         description: Admin created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/createsuperadmin", AdminDto.createAdminDto, this.controller.createSuperAdmin);

         /**
         * @swagger
         * /api/v1/admin/signin:
         *   post:
         *     summary: create a new admin
         *     tags: [admin]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/AuthRequest'
         *     responses:
         *       201:
         *         description: Admin login successfully
         *       400:
         *         description: Validation error
         */
         this.router.post("/signin", AdminDto.adminSigninDto, this.controller.adminSignin);

         /**
         * @swagger
         * /api/v1/admin/setpassword:
         *   patch:
         *     summary: set a new admin password
         *     tags: [admin]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateAdminPasswordDto'
         *     responses:
         *       201:
         *         description: password updated successfully successfully
         *       400:
         *         description: Validation error
         */
         this.router.patch("/setpassword", AdminDto.updateAdminPasswordDto, this.controller.updateAdmin);

         /**
         * @swagger
         * /api/v1/admin/setadministratorpassword:
         *   patch:
         *     summary: set a new administrator password
         *     tags: [admin]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/updateAdministratorPasswordDto'
         *     responses:
         *       201:
         *         description: password updated successfully
         *       400:
         *         description: Validation error
         */
         this.router.patch("/setadministratorpassword", AdminDto.updateAdministratorPasswordDto, this.controller.updateAdmin);

        /**
         * @swagger
         * /api/v1/admin/getadmin/{id}:
         *   get:
         *     summary: gets single admin
         *     tags: [admin]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the admin
         *     responses:
         *       200:
         *         description: admin fetched successfully
         *       400:
         *         description: Validation error
         */
         this.router.get("/getadmin/:id", AdminDto.getSingleAdminDto, this.controller.getSingleAdmin);

    }

    getRouter() {
        return this.router;
    }
}

export default new AdminRoutes().getRouter();