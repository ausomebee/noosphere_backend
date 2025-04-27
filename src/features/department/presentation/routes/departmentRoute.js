import express from "express";
import DepartmentController from "../controllers/departmentController.js";
import DepartmentDto from "../dto/departmentDto.js";
import { adminProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminCreateDepartment:
 *       type: object
 *       required:
 *         - name
 *         - createdByAdminId
 *         - access
 *         - module
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 20
 *           description: Name of the department (max 20 characters)
 *         description:
 *           type: string
 *           description: Optional description of the department
 *         createdByAdminId:
 *           type: string
 *           format: uuid
 *           description: UUID of the admin who created the department
 *         access:
 *           type: object
 *           description: Access permissions for the department
 *         module:
 *           type: string
 *           description: Module name related to the department

 *     TenantCreateDepartment:
 *       type: object
 *       required:
 *         - name
 *         - createdByTenantId
 *         - access
 *         - module
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 20
 *           description: Name of the department (max 20 characters)
 *         description:
 *           type: string
 *           description: Optional description of the department
 *         createdByTenantId:
 *           type: string
 *           format: uuid
 *           description: UUID of the tenant who created the department
 *         access:
 *           type: object
 *           description: Access permissions for the department
 *         module:
 *           type: string
 *           description: Module name related to the department
 */

class DepartmentRoutes {
    constructor() {
        this.controller = new DepartmentController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/department/admindepartment:
         *   post:
         *     summary: create a new department in the admin module
         *     tags: [department]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/AdminCreateDepartment'
         *     responses:
         *       201:
         *         description: Department created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/admindepartment", adminProtect, DepartmentDto.adminCreateDepartmentDto, this.controller.createAdminDepartment);

        /**
         * @swagger
         * /api/v1/department/admindepartments:
         *   get:
         *     summary: gets all departments in the admin module
         *     tags: [department]
         *     responses:
         *       200:
         *         description: Department fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/admindepartments", adminProtect({ superAdmin: true, access: "canEdit" }), this.controller.getAdminDepartment);

        /**
         * @swagger
         * /api/v1/department/tenantdepartment:
         *   post:
         *     summary: create a new department in the tenant module
         *     tags: [department]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantCreateDepartment'
         *     responses:
         *       201:
         *         description: Department created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/tenantdepartment", DepartmentDto.tenantCreateDepartmentDto, this.controller.tenantCreateDepartment);

        /**
         * @swagger
         * /api/v1/department/{createdByTenantId}/{module}:
         *   get:
         *     summary: gets all departments in the tenant module
         *     tags: [department]
         *     parameters:
         *       - in: path
         *         name: createdByTenantId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the tenant who created the department
         *       - in: path
         *         name: module
         *         required: true
         *         schema:
         *           type: string
         *         description: The module type (e.g. TENANT, ADMIN)
         *     responses:
         *       200:
         *         description: Department fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/:createdByTenantId/:module", DepartmentDto.getDepartmentDto, this.controller.tenantGetDepartment);

        // /**
        //  * @swagger
        //  * /api/v1/department/clientdepartment:
        //  *   post:
        //  *     summary: create a new department in the client module
        //  *     tags: [department]
        //  *     requestBody:
        //  *       required: true
        //  *       content:
        //  *         application/json:
        //  *           schema:
        //  *             $ref: '#/components/schemas/TenantCreateDepartment'
        //  *     responses:
        //  *       201:
        //  *         description: Department created successfully
        //  *       400:
        //  *         description: Validation error
        //  */
        // this.router.post("/clientdepartment", DepartmentDto.tenantCreateDepartmentDto, this.controller.createClientDepartment);

        // /**
        //  * @swagger
        //  * /api/v1/department/clientdepartments:
        //  *   get:
        //  *     summary: gets all departments in the client module
        //  *     tags: [department]
        //  *     responses:
        //  *       200:
        //  *         description: Department fetched successfully
        //  *       400:
        //  *         description: Validation error
        //  */
        // this.router.get("/clientdepartments", DepartmentDto.tenantIdDto, this.controller.getClientDepartment);

    }

    getRouter() {
        return this.router;
    }
}

export default new DepartmentRoutes().getRouter();