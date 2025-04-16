import express from "express";
import DepartmentController from "../controllers/departmentController.js";
import DepartmentDto from "../dto/departmentDto.js";

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
        this.router.post("/admindepartment", DepartmentDto.adminCreateDepartmentDto, this.controller.createAdminDepartment);

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
        this.router.post("/tenantdepartment", DepartmentDto.tenantCreateDepartmentDto, this.controller.createTenantDepartment);

        /**
         * @swagger
         * /api/v1/department/clientdepartment:
         *   post:
         *     summary: create a new department in the client module
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
        this.router.post("/clientdepartment", DepartmentDto.tenantCreateDepartmentDto, this.controller.createClientDepartment);

    }

    getRouter() {
        return this.router;
    }
}

export default new DepartmentRoutes().getRouter();