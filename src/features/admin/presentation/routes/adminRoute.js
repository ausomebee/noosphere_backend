import express from "express";
import AdminController from "../controllers/adminController.js";
import AdminDto from "../dto/adminDto.js";
import { adminProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAdmin:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - phoneNumber
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           description: First name of the admin (3-20 characters)
 *         lastName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           description: Last name of the admin (3-20 characters)
 *         email:
 *           type: string
 *           format: email
 *           description: Valid email (must end with .com or .net)
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *           maxLength: 15
 *           description: Phone number (10 to 15 digits)
 *         roleId:
 *           type: string
 *           format: uuid
 *           description: UUID of the assigned role
 *         departmentId:
 *           type: string
 *           format: uuid
 *           description: UUID of the assigned department
 * 
 *     UpdateAdmin:
 *       type: object
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - phoneNumber
 *         - roleId
 *       properties:
 *         id:
 *          type: string
 *          format: uuid
 *         firstName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           description: First name of the admin (3-20 characters)
 *         lastName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           description: Last name of the admin (3-20 characters)
 *         email:
 *           type: string
 *           format: email
 *           description: Valid email (must end with .com or .net)
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *           maxLength: 15
 *           description: Phone number (10 to 15 digits)
 *         roleId:
 *           type: string
 *           format: uuid
 *           description: UUID of the assigned role
 *         departmentId:
 *           type: string
 *           format: uuid
 *           description: UUID of the assigned department
 * 
 *     CreateSuperAdmin:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           description: First name of the admin (3-20 characters)
 *         lastName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           description: Last name of the admin (3-20 characters)
 *         email:
 *           type: string
 *           format: email
 *           description: Valid email (must end with .com or .net)
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *           maxLength: 15
 *           description: Phone number (10 to 15 digits, optional leading +)
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
 *         oldAdministratorPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           maxLength: 100
 *           example: "StrongP@ssw0rd!"
 *           description: New password (must be strong)
 *         newAdministratorPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           maxLength: 100
 *           example: "StrongP@ssw0rd!"
 *           description: New password (must be strong)
 *     superAdminChoicesDto:
 *       type: object
 *       required:
 *         - Authenticator2FA
 *         - securityQuestion
 *         - setForAll
 *       properties:
 *         Authenticator2FA:
 *           type: boolean
 *           description: Whether 2FA is enabled.
 *         securityQuestion:
 *           type: boolean
 *           description: Whether a security question is required.
 *         setForAll:
 *           type: boolean
 *           description: Whether to apply the setting to all users.
 *         isEnabled:
 *           type: boolean
 *           default: true
 *           description: Whether the super admin choices are enabled.
 *       example:
 *         Authenticator2FA: true
 *         securityQuestion: false
 *         setForAll: true
 *         isEnabled: true
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
        this.router.post("/createadmin", adminProtect(), AdminDto.createAdminDto, this.controller.createAdmin);

        /**
         * @swagger
         * /api/v1/admin/updateadmin:
         *   patch:
         *     summary: update an admin
         *     tags: [admin]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateAdmin'
         *     responses:
         *       201:
         *         description: Admin updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/updateadmin", adminProtect(), AdminDto.updateAdminDto, this.controller.updateAdmin);

        /**
         * @swagger
         * /api/v1/admin/superadmin:
         *   post:
         *     summary: create a new super admin
         *     tags: [super admin]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateSuperAdmin'
         *     responses:
         *       201:
         *         description: super Admin created successfully
         *       400:
         *         description: Validation error
         *       409:
         *         description: Conflict (email or phone already exists)
         *       500:
         *         description: Internal server error
         */
        this.router.post("/superadmin", AdminDto.createSuperAdminDto, this.controller.createSuperAdmin);

        /**
        * @swagger
        * /api/v1/admin/signin:
        *   post:
        *     summary: admin login
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
        * /api/v1/admin/getadminswithteamaccess:
        *   get:
        *     summary: get admins with team access
        *     tags: [admin]
        *     responses:
        *       201:
        *         description: Admins with team access fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/getadminswithteamaccess", adminProtect(), this.controller.getAdminsWithTeamAccess);

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
        * /api/v1/admin/superadminchoices:
        *   post:
        *     summary: set superadmin choices
        *     tags: [choice]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/superAdminChoicesDto'
        *     responses:
        *       201:
        *         description: Choice created successfully
        *       400:
        *         description: Validation error
        */
        this.router.post("/superadminchoices", AdminDto.superAdminChoicesDto, this.controller.superAdminChoices);

        /**
         * @swagger
         * /api/v1/admin/superadminchoices:
         *   get:
         *     summary: Retrieve superadmin choices
         *     tags: [choice]
         *     responses:
         *       200:
         *         description: Choices retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 Authenticator2FA:
         *                   type: boolean
         *                 securityQuestion:
         *                   type: boolean
         *                 setForAll:
         *                   type: boolean
         *                 isEnabled:
         *                   type: boolean
         *       400:
         *         description: Bad request
         */
        this.router.get("/superadminchoices", this.controller.getChoices);

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
        this.router.get("/getadmin/:id", adminProtect(), AdminDto.getSingleAdminDto, this.controller.getSingleAdmin);

        /**
         * @swagger
         * /api/v1/admin:
         *   get:
         *     summary: gets all admins
         *     tags: [admin]
         *     responses:
         *       200:
         *         description: admins fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/", adminProtect(), this.controller.getAllAdmin);

        /**
         * @swagger
         * /api/v1/admin/forgotpassword/{email}:
         *   get:
         *     summary: send forgot password mail
         *     tags: [admin]
         *     parameters:
         *       - in: path
         *         name: email
         *         required: true
         *         schema:
         *           type: string
         *         description: The email of the admin
         *     responses:
         *       200:
         *         description: email sent successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/forgotpassword/:email", AdminDto.forgotPasswordDto, this.controller.forgotPassword);

        /**
         * @swagger
         * /api/v1/admin/setactivestatus/{id}/active/{active}:
         *   patch:
         *     summary: Activate or deactivate an admin
         *     tags: [admin]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: The ID of the admin
         *       - in: path
         *         name: active
         *         required: true
         *         schema:
         *           type: string
         *           enum: [true, false]
         *         description: Whether to activate (true) or deactivate (false) the admin
         *     responses:
         *       200:
         *         description: Admin status updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/setactivestatus/:id/active/:active", adminProtect(), this.controller.setAdminActiveStatus);
    }

    getRouter() {
        return this.router;
    }
}

export default new AdminRoutes().getRouter();
