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
 *     TenantActiveStatusDto:
 *       type: object
 *       required:
 *         - id
 *         - active
 *         - deactivatedById
 *         - password
 *         - reason
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "439004a2-97cb-4eea-824e-e95d094c9be6"
 *           description: Tenant ID to be activated or deactivated
 *         active:
 *           type: boolean
 *           example: false
 *           description: Set to false to deactivate tenant, true to reactivate
 *         deactivatedById:
 *           type: string
 *           format: uuid
 *           example: "b91c2e88-7f1b-4c1e-92d0-1a5d3f4e8a12"
 *           description: Admin ID performing the action
 *         password:
 *           type: string
 *           example: "AdminSecurePassword123!"
 *           description: Admin password for verification
 *         reason:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           example: "Violation of platform policy"
 *           description: Reason for deactivation or reactivation
 *         details:
 *           type: string
 *           maxLength: 500
 *           example: "Tenant failed to comply with billing requirements despite multiple warnings."
 *           description: Additional explanation for the action
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
 * 
 *     TenantUpdatePassword:
 *       type: object
 *       required:
 *         - staffId
 *         - newPassword
 *         - currentPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           example: "string"
 *         newPassword:
 *           type: string
 *           example: "string"
 *         staffId:
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
         *     tags: [Tenant]
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
         * /api/v1/tenant/active-status:
         *   patch:
         *     summary: Update tenant active status
         *     description: Update the active status of a tenant.
         *     tags: [Tenant]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantActiveStatusDto'
         *     responses:
         *       201:
         *         description: Tenant active status updated successfully
         *       400:
         *         description: Bad request
         */
        this.router.patch("/active-status", this.controller.tenantActiveStatus);

        /**
         * @swagger
         * /api/v1/tenant/account-officer/{tenantId}/{officerId}:
         *   patch:
         *     summary: Update tenant account officer
         *     description: Assign or update the account officer for a specific tenant.
         *     tags:
         *       - Tenant
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: The UUID of the tenant
         *       - in: path
         *         name: officerId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: The UUID of the account officer to assign
         *     responses:
         *       200:
         *         description: Tenant account officer updated successfully
         *       400:
         *         description: Invalid tenantId or officerId supplied
         *       404:
         *         description: Tenant or account officer not found
         */
        this.router.patch("/account-officer/:tenantId/:officerId", this.controller.updateAccountOfficer);

        /**
         * @swagger
         * /api/v1/tenant/change-password:
         *   patch:
         *     summary: Update tenant staff password
         *     description: Update the password of a staff.
         *     tags: [Tenant]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantUpdatePassword'
         *     responses:
         *       201:
         *         description: Tenant staff password updated successfully
         *       400:
         *         description: Bad request
         */
        this.router.patch("/change-password", TenantDto.updatePasswordDto, this.controller.updateStaffPassword);

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
         * /api/v1/tenant/deactivation-logs:
         *   get:
         *     summary: Retrieve all tenant deactivation logs
         *     tags: [Tenant]
         *     parameters:
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *         required: false
         *         description: Page number for pagination
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *         required: false
         *         description: Number of records per page
         *     responses:
         *       200:
         *         description: Deactivation logs retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/deactivation-logs", this.controller.getDeactivationLogs);

        /**
         * @swagger
         * /api/v1/tenant/activation-logs:
         *   get:
         *     summary: Retrieve all tenant activation logs
         *     tags: [Tenant]
         *     parameters:
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *         required: false
         *         description: Page number for pagination
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *         required: false
         *         description: Number of records per page
         *     responses:
         *       200:
         *         description: Activation logs retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/activation-logs", this.controller.getActivationLogs);

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
        * /api/v1/tenant/tenantadminchoices:
        *   patch:
        *     summary: update tenant admin choices
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
        this.router.patch("/tenantadminchoices", TenantDto.updateTenantAdminChoicesDto, this.controller.updateTenantAdminChoices);

        /**
        * @swagger
        * /api/v1/tenant/getstaffbypaymentschedule/{tenantId}/{paymentSchedule}:
        *   get:
        *     summary: Get staff by payment schedule
        *     tags: [Tenant]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *           format: uuid
        *         description: The ID of the tenant
        *       - in: path
        *         name: paymentSchedule
        *         required: true
        *         schema:
        *           type: string
        *           enum: [Weekly, Monthly, Hourly]
        *         description: The payment schedule of the staff to retrieve
        *     responses:
        *       200:
        *         description: Staff retrieved successfully by payment schedule
        *       400:
        *         description: Bad request or invalid payment schedule value provided
        */
        this.router.get("/getstaffbypaymentschedule/:tenantId/:paymentSchedule", this.controller.getStaffByPaymentSchedule);

        /**
        * @swagger
        * /api/v1/tenant/getstaffpayrollsummary/{tenantId}:
        *   get:
        *     summary: Get staff payroll summary for a tenant
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
        *         description: Staff payroll summary retrieved successfully
        *       400:
        *         description: Bad request or invalid tenant ID provided
        */
        this.router.get("/getstaffpayrollsummary/:tenantId", this.controller.getStaffPayrollSummary);

        /**
         * @swagger
         * /api/v1/tenant/change-admin-password/{tenantId}:
         *   patch:
         *     summary: Reset the admin password for a tenant
         *     description: Generates and updates a new admin password for the specified tenant. The password is not supplied in the request body.
         *     tags:
         *       - Tenant
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: The unique identifier of the tenant
         *     responses:
         *       200:
         *         description: Admin password reset successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: string
         *                   example: ok
         *                 message:
         *                   type: string
         *                   example: Tenant admin password reset successfully
         *       400:
         *         description: Invalid tenant ID supplied
         *       404:
         *         description: Tenant not found
         *       500:
         *         description: Internal server error
         */
        this.router.patch(
            "/change-admin-password/:tenantId",
            this.controller.changeAdminPassword
        );

        /**
         * @swagger
         * /api/v1/tenant/change-email/{tenantId}:
         *   patch:
         *     summary: Update tenant email address
         *     description: Updates the email address associated with a tenant.
         *     tags:
         *       - Tenant
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: The unique identifier of the tenant
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - email
         *             properties:
         *               email:
         *                 type: string
         *                 format: email
         *                 example: tenant@example.com
         *     responses:
         *       200:
         *         description: Tenant email updated successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: string
         *                   example: ok
         *                 message:
         *                   type: string
         *                   example: Tenant email updated successfully
         *       400:
         *         description: Invalid email or bad request
         *       404:
         *         description: Tenant not found
         *       500:
         *         description: Internal server error
         */
        this.router.patch(
            "/change-email/:tenantId",
            this.controller.changeEmail
        );

        /**
         * @swagger
         * /api/v1/tenant/change-phone-number/{tenantId}:
         *   patch:
         *     summary: Update tenant phone number
         *     description: Updates the phone number associated with a tenant.
         *     tags:
         *       - Tenant
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: The unique identifier of the tenant
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - phoneNumber
         *             properties:
         *               phoneNumber:
         *                 type: string
         *                 example: "+2348012345678"
         *     responses:
         *       200:
         *         description: Tenant phone number updated successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: string
         *                   example: ok
         *                 message:
         *                   type: string
         *                   example: Tenant phone number updated successfully
         *       400:
         *         description: Invalid phone number or bad request
         *       404:
         *         description: Tenant not found
         *       500:
         *         description: Internal server error
         */
        this.router.patch(
            "/change-phone-number/:tenantId",
            this.controller.changePhoneNumber
        );

        /**
         * @swagger
         * /api/v1/tenant/usage-statistics-overview/{tenantId}:
         *   get:
         *     summary: Get usage statistics overview for a tenant
         *     description: Retrieves usage statistics overview for a specific tenant.
         *     tags:
         *       - Tenant
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: The unique identifier of the tenant
         *     responses:
         *       200:
         *         description: Usage statistics overview retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: string
         *                   example: ok
         *                 message:
         *                   type: string
         *                   example: Usage statistics overview retrieved successfully
         *       400:
         *         description: Invalid tenant ID or bad request
         *       404:
         *         description: Tenant not found
         *       500:
         *         description: Internal server error
         */
        this.router.get(
            "/usage-statistics-overview/:tenantId",
            this.controller.getTenantRelationsCount
        );

        /**
         * @swagger
         * /api/v1/tenant/getstaffwithpayrollbydate/{tenantId}:
         *   get:
         *     summary: Get staff with payroll by date range for a tenant
         *     tags: [Tenant]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: The ID of the tenant
         *       - in: query
         *         name: startDate
         *         required: true
         *         schema:
         *           type: string
         *           format: date
         *           example: 2025-01-01
         *         description: The start date of the range (YYYY-MM-DD)
         *       - in: query
         *         name: endDate
         *         required: true
         *         schema:
         *           type: string
         *           format: date
         *           example: 2025-01-31
         *         description: The end date of the range (YYYY-MM-DD)
         *       - in: query
         *         name: paymentSchedule
         *         required: true
         *         schema:
         *           type: string
         *           enum: [Weekly, Monthly, Hourly]
         *         description: The payment schedule of the staff to retrieve
         *     responses:
         *       200:
         *         description: Staff with payroll retrieved successfully by date range
         *       400:
         *         description: Invalid tenant ID or date range provided
         *       404:
         *         description: Tenant not found
         *       500:
         *         description: Internal server error
         */
        this.router.get("/getstaffwithpayrollbydate/:tenantId", this.controller.findStaffWithPayrollByTenantAndDateRange);

        /**
         * @swagger
         * /api/v1/tenant/tenantadminchoices/{tenantId}:
         *   get:
         *     summary: Retrieve tenant admin choices
         *     tags: [choice]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
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
         * /api/v1/tenant/staff/team/{tenantId}:
         *   get:
         *     summary: Get staffs with team access for a tenant
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
         *         description: staffs fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/staff/team/:tenantId", this.controller.getStaffsWithTeamAccess);

        /**
         * @swagger
         * /api/v1/tenant/active:
         *   get:
         *     summary: Get all active tenants
         *     tags: [Tenant]
         *     responses:
         *       200:
         *         description: Active tenants fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/active", this.controller.getAllActiveTenant);

        /**
         * @swagger
         * /api/v1/tenant/management-overview:
         *   get:
         *     summary: Get management overview for  tenants
         *     tags: [Tenant]
         *     responses:
         *       200:
         *         description: management overview fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/management-overview", this.controller.tenantManagementOverview);

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