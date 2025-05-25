import express from "express";
import TenantDto from "../dto/tenantDto.js";
import TenantController from "../controllers/tenantController.js";

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
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           example: John Doe
 *           description: Candidate's full name
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *           description: Valid email (only `.com` or `.net` domains allowed)
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *           maxLength: 15
 *           example: "+2348012345678"
 *           description: Candidate's phone number
 *         stage:
 *           type: string
 *           example: VERIFIED
 *         companyName:
 *           type: string
 *           example: Malik Inc
 *         contactPerson:
 *           type: string
 *           example: Malik
 *         companySize:
 *           type: string
 *           example: 1-2
 *         organizationType:
 *           type: string
 *           example: Startup
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *               example: Ikeja
 *             state:
 *               type: string
 *               example: Lagos
 *         leadSource:
 *           type: string
 *           example: LinkedIn
 *         pipelineStageId:
 *           type: string
 *           format: uuid
 *           example: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *         assignToAdmin:
 *           type: string
 *           format: uuid
 *           example: d6c6f7b4-b2f9-4d76-9f9c-9b292d3a1cfa
 *         createdBy:
 *           type: string
 *           format: uuid
 *           example: d6c6f7b4-b2f9-4d76-9f9c-9b292d3a1cfa
 *     TenantUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the tenant to update
 *         email:
 *           type: string
 *           description: The email of the tenant
 *           example: tenant@example.com
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the tenant
 *           example: "+1234567890"
 *         active:
 *           type: boolean
 *           description: Whether the tenant is active or not
 *           example: true
 *         isDeleted:
 *           type: boolean
 *           description: Whether the tenant is marked as deleted
 *           example: false
 *         companyName:
 *           type: string
 *           description: The name of the company
 *           example: "Acme Corporation"
 *         contactPerson:
 *           type: string
 *           description: The name of the contact person at the tenant
 *           example: "John Doe"
 *         companySize:
 *           type: string
 *           description: The size of the company (e.g., Small, Medium, Large)
 *           example: "Medium"
 *         organizationType:
 *           type: string
 *           description: The type of the organization
 *           example: "Non-Profit"
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *               example: Ikeja
 *             state:
 *               type: string
 *               example: Lagos
 *         leadSource:
 *           type: string
 *           description: The lead source for the tenant
 *           example: "Referral"
 *         stage:
 *           type: string
 *           description: The current stage of the tenant
 *           example: "Onboarding"
 *       required:
 *         - id
 *         - email
 *         - phoneNumber
 *         - companyName
 *         - contactPerson
 *         - location
 *         - leadSource
 *         - stage
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
         *     tags: [Tenants]
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
         * /api/v1/tenant/:
         *   get:
         *     summary: Retrieve all tenants
         *     tags: [tenant]
         *     responses:
         *       200:
         *         description: all tenants retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/", this.controller.getAllTenant);


        // /**
        //  * @swagger
        //  * /api/v1/tenant/createtenant:
        //  *   post:
        //  *     summary: Create a new tenant
        //  *     tags: [Tenant]
        //  *     requestBody:
        //  *       required: true
        //  *       content:
        //  *         application/json:
        //  *           schema:
        //  *             $ref: '#/components/schemas/CreateTenantDto'
        //  *     responses:
        //  *       201:
        //  *         description: Tenant created successfully
        //  *       400:
        //  *         description: Validation error
        //  */
        // this.router.post("/createtenant", TenantDto.createTenantDto, this.controller.createTenant);

        // /**
        //  * @swagger
        //  * /api/v1/tenant/createtenantstaff:
        //  *   post:
        //  *     summary: Create a new tenant staff
        //  *     tags: [Tenant]
        //  *     requestBody:
        //  *       required: true
        //  *       content:
        //  *         application/json:
        //  *           schema:
        //  *             $ref: '#/components/schemas/CreateTenantStaffDto'
        //  *     responses:
        //  *       201:
        //  *         description: Tenant staff created successfully
        //  *       400:
        //  *         description: Validation error
        //  */
        // this.router.post("/createtenantstaff", TenantDto.createTenantStaffDto, this.controller.createTenantStaff);

        // /**
        //  * @swagger
        //  * /api/v1/tenant/staffsignin:
        //  *   post:
        //  *     summary: Staff sign in
        //  *     tags: [Tenant]
        //  *     requestBody:
        //  *       required: true
        //  *       content:
        //  *         application/json:
        //  *           schema:
        //  *             $ref: '#/components/schemas/StaffSigninDto'
        //  *     responses:
        //  *       200:
        //  *         description: Sign-in successful
        //  *       401:
        //  *         description: Invalid credentials
        //  */
        // this.router.post("/staffsignin", TenantDto.staffSigninDto, this.controller.staffSignin);

        // /**
        //  * @swagger
        //  * /api/v1/tenant/getstaff/{id}:
        //  *   get:
        //  *     summary: gets single staff
        //  *     tags: [staff]
        //  *     parameters:
        //  *       - in: path
        //  *         name: id
        //  *         required: true
        //  *         schema:
        //  *           type: string
        //  *         description: The ID of the staff
        //  *     responses:
        //  *       200:
        //  *         description: staff fetched successfully
        //  *       400:
        //  *         description: Validation error
        //  */
        // this.router.get("/getstaff/:id", TenantDto.getSingleStaffDto, this.controller.getSingleStaff);

    }

    getRouter() {
        return this.router;
    }
}

export default new TenantRoutes().getRouter();