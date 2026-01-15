import express from "express";
import TenantDto from "../dto/tenantDto.js";
import TenantController from "../controllers/tenantController.js";
import multer from "multer";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCandidateDto:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - phoneNumber
 *         - stage
 *         - companyName
 *         - contactPerson
 *         - companySize
 *         - organizationType
 *         - location
 *         - leadSource
 *         - pipelineStageId
 *         - assignToAdmin
 *         - website
 *         - practiceNPI
 *         - subdomain
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           example: "John Doe"
 *           description: Candidate's full name
 *         email:
 *           type: string
 *           format: email
 *           example: "johndoe@example.com"
 *           description: Valid email (only `.com` or `.net` domains allowed)
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *           maxLength: 15
 *           pattern: '^\+?[0-9]{10,15}$'
 *           example: "+2348012345678"
 *           description: Candidate's phone number
 *         stage:
 *           type: string
 *           example: "VERIFIED"
 *         subdomain:
 *           type: string
 *           example: "ausomebee"
 *         website:
 *           type: string
 *           example: "http://nosphere.com"
 *         practiceNPI:
 *           type: string
 *           example: "example"
 *         companyName:
 *           type: string
 *           example: "Malik Inc"
 *         contactPerson:
 *           type: string
 *           example: "Malik"
 *         companySize:
 *           type: string
 *           example: "1-2"
 *         organizationType:
 *           type: string
 *           example: "Startup"
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *               example: "Ikeja"
 *             state:
 *               type: string
 *               example: "Lagos"
 *         leadSource:
 *           type: string
 *           example: "LinkedIn"
 *         pipelineStageId:
 *           type: string
 *           format: uuid
 *           example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *         assignToAdmin:
 *           type: string
 *           format: uuid
 *           example: "d6c6f7b4-b2f9-4d76-9f9c-9b292d3a1cfa"
 *         createdBy:
 *           type: string
 *           format: uuid
 *           example: "d6c6f7b4-b2f9-4d76-9f9c-9b292d3a1cfa"
 *
 *     TenantUpdate:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the tenant to update
 *         email:
 *           type: string
 *           example: "tenant@example.com"
 *         phoneNumber:
 *           type: string
 *           example: "+1234567890"
 *         active:
 *           type: boolean
 *           example: true
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         companyName:
 *           type: string
 *           example: "Acme Corporation"
 *         contactPerson:
 *           type: string
 *           example: "John Doe"
 *         website:
 *           type: string
 *           example: "http://nosphere.com"
 *         practiceNPI:
 *           type: string
 *           example: "example"
 *         companySize:
 *           type: string
 *           example: "Medium"
 *         organizationType:
 *           type: string
 *           example: "Non-Profit"
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *               example: "Ikeja"
 *             state:
 *               type: string
 *               example: "Lagos"
 *         leadSource:
 *           type: string
 *           example: "Referral"
 *         stage:
 *           type: string
 *           example: "Onboarding"
 *
 *     ContactTenantDto:
 *       type: object
 *       required:
 *         - id
 *         - header
 *         - body
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "e95fbc1e-8833-4c44-a4d5-2fdc98a0c455"
 *         header:
 *           type: string
 *           example: "Request for additional services"
 *         body:
 *           type: string
 *           example: "We would like to discuss additional features for our current plan."
 *         attachment:
 *           type: string
 *           format: binary
 *
 *     CreateStaffDto:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - phoneNumber
 *         - roleId
 *         - tenantId
 *         - stage
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *           maxLength: 15
 *           example: "08012345678"
 *         roleId:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6"
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "p0o9i8u7-y6t5-r4e3-w2q1-1234567890ab"
 *         stage:
 *           type: string
 *           example: "ONBOARDING"
 *
 *     UpdateStaffPasswordDto:
 *       type: object
 *       required:
 *         - id
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "7f0e1c72-abb9-4c43-91f0-df1ed39f2eaa"
 *         password:
 *           type: string
 *           format: password
 *           example: "StrongPassw0rd!"
 *
 *     StaffSigninDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "admin@noosphere.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "LoginStrongP@ss1"
 *
 *     TenantAdminChoicesDto:
 *       type: object
 *       required:
 *         - Authenticator2FA
 *         - securityQuestion
 *         - setForAll
 *         - tenantId
 *       properties:
 *         Authenticator2FA:
 *           type: boolean
 *           example: true
 *         securityQuestion:
 *           type: boolean
 *           example: false
 *         setForAll:
 *           type: boolean
 *           example: true
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "d6c6f7b4-b2f9-4d76-9f9c-9b292d3a1cfa"
 */

class TenantRoutes {
    constructor() {
        this.controller = new TenantController();
        this.router = express.Router();
        this.memoryUpload = multer({ storage: multer.memoryStorage() });
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/tenant/candidate:
         *   post:
         *     summary: Create a new candidate
         *     tags: [Candidate]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateCandidateDto'
         *     responses:
         *       201:
         *         description: Candidate created successfully
         *       400:
         *         description: Bad request
         */
        this.router.post("/candidate", TenantDto.createCandidateDto, this.controller.createCandidate);

        /**
         * @swagger
         * /api/v1/tenant:
         *   patch:
         *     summary: Update tenant details
         *     description: Update the details of an existing tenant by specifying the tenant ID.
         *     tags: [Tenant]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantUpdate'
         *     responses:
         *       201:
         *         description: Tenant updated successfully
         *       400:
         *         description: Bad request
         */
        this.router.patch("/", TenantDto.updateTenantDto, this.controller.updateTenant);

        /**
         * @swagger
         * /api/v1/tenant/organization:
         *   patch:
         *     summary: Update tenant details
         *     description: Update the details of an existing tenant by specifying the tenant ID.
         *     tags: [Tenant]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantUpdate'
         *     responses:
         *       201:
         *         description: Tenant updated successfully
         *       400:
         *         description: Bad request
         */
        this.router.patch("/organization", TenantDto.updateTenantDto, this.controller.updateTenant);

        /**
         * @swagger
         * /api/v1/tenant/:
         *   get:
         *     summary: Retrieve all tenants
         *     tags: [Tenant]
         *     responses:
         *       200:
         *         description: all tenants retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/", this.controller.getAllTenant);

        /**
         * @swagger
         * /api/v1/tenant/count:
         *   get:
         *     summary: Count all tenants
         *     tags: [Tenant]
         *     responses:
         *       200:
         *         description: all tenants counted successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/count", this.controller.countAllTenant);

        /**
         * @swagger
         * /api/v1/tenant/subdomain/{subdomain}:
         *   get:
         *     summary: checks if tenant subdomain exists
         *     tags: [Tenant]
         *     parameters:
         *       - in: path
         *         name: subdomain
         *         required: true
         *         schema:
         *           type: string
         *         description: The subdomain of the tenant
         *     responses:
         *       200:
         *         description: subdomain checked successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/subdomain/:subdomain", this.controller.checkDomain);

        /**
         * @swagger
         * /api/v1/tenant/contact:
         *   post:
         *     summary: Contact tenant by email
         *     tags: [Tenant]
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             $ref: '#/components/schemas/ContactTenantDto'
         *     responses:
         *       201:
         *         description: Tenant contacted successfully
         *       400:
         *         description: Bad request
         */
        this.router.post("/contact", this.memoryUpload.single("attachment"), TenantDto.contactTenantDto, this.controller.contactTenantByEmail);

        /**
         * @swagger
         * /api/v1/tenant/createstaff:
         *   post:
         *     summary: create a new Tenant
         *     tags: [Tenant]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateStaffDto'
         *     responses:
         *       201:
         *         description: super Admin created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/createstaff", TenantDto.createStaffDto, this.controller.createTenantStaff);

        /**
        * @swagger
        * /api/v1/tenant/signin:
        *   post:
        *     summary: tenant login
        *     tags: [Tenant]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/StaffSigninDto'
        *     responses:
        *       201:
        *         description: Tenant login successfully
        *       400:
        *         description: Validation error
        */
        this.router.post("/signin", TenantDto.staffSigninDto, this.controller.tenantStaffLogin);

        /**
        * @swagger
        * /api/v1/tenant/setpassword:
        *   patch:
        *     summary: set a new tenant password
        *     tags: [Tenant]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/UpdateStaffPasswordDto'
        *     responses:
        *       201:
        *         description: password updated successfully successfully
        *       400:
        *         description: Validation error
        */
        this.router.patch("/setpassword", TenantDto.updateStaffPasswordDto, this.controller.updateStaff);

        /**
        * @swagger
        * /api/v1/tenant/tenantadminchoices:
        *   post:
        *     summary: set tenant admin choices
        *     tags: [choice]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/TenantAdminChoicesDto'
        *     responses:
        *       201:
        *         description: Choice created successfully
        *       400:
        *         description: Validation error
        */
        this.router.post("/tenantadminchoices", TenantDto.tenantAdminChoicesDto, this.controller.tenantAdminChoices);

        /**
         * @swagger
         * /api/v1/tenant/tenantadminchoices/{tenantId}:
         *   get:
         *     summary: Retrieve tenant admin choices
         *     tags: [choice]
         *     parameters:
         *       - in: query
         *         name: tenantId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: The ID of the tenant to fetch choices for
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
         *       400:
         *         description: Bad request
         */
        this.router.get("/tenantadminchoices/:tenantId", TenantDto.checkIdDto, this.controller.getChoices);

        /**
         * @swagger
         * /api/v1/tenant/count-staff/{tenantId}:
         *   get:
         *     summary: Count available staffs for a tenant
         *     tags: [Tenant]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: The ID of the tenant
         *     responses:
         *       200:
         *         description: Staffs counted successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 totalStaff:
         *                   type: integer
         *                   description: Total number of staff for the tenant
         *                 availableStaff:
         *                   type: integer
         *                   description: Number of staff currently available
         *       400:
         *         description: Bad request
         */
        this.router.get("/count-staff/:tenantId", this.controller.availaibleStaffs);

        /**
         * @swagger
         * /api/v1/tenant/avg-staff/{tenantId}:
         *   get:
         *     summary: Count average client per therapist
         *     tags: [Tenant]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: The ID of the tenant
         *     responses:
         *       200:
         *         description: Staffs counted successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/avg-staff/:tenantId", this.controller.averageClinicians);

        /**
         * @swagger
         * /api/v1/tenant/forgotpassword/{email}:
         *   get:
         *     summary: send forgot password mail
         *     tags: [Tenant]
         *     parameters:
         *       - in: path
         *         name: email
         *         required: true
         *         schema:
         *           type: string
         *         description: The email of the staff to send the reset link to
         *     responses:
         *       200:
         *         description: email sent successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/forgotpassword/:email", TenantDto.forgotPasswordDto, this.controller.forgotPassword);

        /**
         * @swagger
         * /api/v1/tenant/{id}:
         *   get:
         *     summary: Get tenant by tenant id
         *     tags: [Tenant]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The id of the tenant 
         *     responses:
         *       200:
         *         description: tenant fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/:id", this.controller.getTenant);

        /**
         * @swagger
         * /api/v1/tenant/staff/{tenantId}:
         *   get:
         *     summary: Gets tenant staffs by tenant id
         *     tags: [Tenant]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *         description: The id of the tenant 
         *     responses:
         *       200:
         *         description: tenant staffs fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/staff/:tenantId", this.controller.getTenantStaffs);

    }

    getRouter() {
        return this.router;
    }
}

export default new TenantRoutes().getRouter();