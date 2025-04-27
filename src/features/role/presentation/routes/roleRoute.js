import express from "express";
import RoleDto from "../dto/roleDto.js";
import RoleController from "../controllers/roleController.js";
import { adminProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminCreateRole:
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
 *           description: Name of the role (max 20 characters)
 *         description:
 *           type: string
 *           description: Optional description of the role
 *         createdByAdminId:
 *           type: string
 *           format: uuid
 *           description: UUID of the admin who created the role
 *         access:
 *           type: object
 *           description: Access permissions for the role
 *         module:
 *           type: string
 *           description: Module name related to the role

 *     TenantCreateRole:
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
 *           description: Name of the role (max 20 characters)
 *         description:
 *           type: string
 *           description: Optional description of the role
 *         createdByTenantId:
 *           type: string
 *           format: uuid
 *           description: UUID of the tenant who created the role
 *         access:
 *           type: object
 *           description: Access permissions for the role
 *         module:
 *           type: string
 *           description: Module name related to the role
 */

class RoleRoutes {
    constructor() {
        this.controller = new RoleController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/role/adminrole:
         *   post:
         *     summary: create a new role in the admin module
         *     tags: [role]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/AdminCreateRole'
         *     responses:
         *       201:
         *         description: Role created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/adminrole", adminProtect, RoleDto.createRoleDto, this.controller.createAdminRole);

        /**
         * @swagger
         * /api/v1/role/tenantrole:
         *   post:
         *     summary: create a new role in the tenant module
         *     tags: [role]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantCreateRole'
         *     responses:
         *       201:
         *         description: Role created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/tenantrole", RoleDto.createRoleDto, this.controller.createTenantRole);

        // /**
        //  * @swagger
        //  * /api/v1/role/clientrole:
        //  *   post:
        //  *     summary: create a new role in the client module
        //  *     tags: [role]
        //  *     requestBody:
        //  *       required: true
        //  *       content:
        //  *         application/json:
        //  *           schema:
        //  *             $ref: '#/components/schemas/TenantCreateRole'
        //  *     responses:
        //  *       201:
        //  *         description: Role created successfully
        //  *       400:
        //  *         description: Validation error
        //  */
        // this.router.post("/clientrole", RoleDto.createRoleDto, this.controller.createClientRole);

        /**
         * @swagger
         * /api/v1/role/{departmentId}:
         *   get:
         *     summary: fetch all roles in a department
         *     tags: [role]
         *     parameters:
         *       - in: path
         *         name: departmentId
         *         required: true
         *         schema:
         *           type: string
         *         description: ID of the department
         *     responses:
         *       200:
         *         description: Roles fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/:departmentId", RoleDto.departmentIdDto, this.controller.getRoles);

    }

    getRouter() {
        return this.router;
    }
}

export default new RoleRoutes().getRouter();