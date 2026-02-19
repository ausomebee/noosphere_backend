import express from "express";
import RoleDto from "../dto/roleDto.js";
import RoleController from "../controllers/roleController.js";
import { adminProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateRole:
 *       type: object
 *       required:
 *         - name
 *         - dataAccessLevel
 *         - createdByAdminId
 *         - moduleAccesses
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 20
 *           description: Name of the role (max 20 characters)
 *         dataAccessLevel:
 *           type: string
 *           description: Level of data access (e.g., READ, WRITE, ADMIN)
 *         systemModuleId:
 *           type: string
 *           format: uuid
 *           description: Optional system module ID linked to the role
 *         createdByAdminId:
 *           type: string
 *           format: uuid
 *           description: UUID of the admin creating the role
 *         moduleAccesses:
 *           type: array
 *           description: List of module access configurations
 *           items:
 *             type: object
 *             required:
 *               - module
 *               - permissions
 *             properties:
 *               module:
 *                 type: string
 *                 description: Feature module name
 *               permissions:
 *                 type: array
 *                 description: List of permissions for the module
 *                 items:
 *                   type: string
 *
 *     TenantCreateRole:
 *       type: object
 *       required:
 *         - name
 *         - dataAccessLevel
 *         - createdByTenantId
 *         - moduleAccesses
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 20
 *           description: Name of the role (max 20 characters)
 *         dataAccessLevel:
 *           type: string
 *           description: Level of data access (e.g., READ, WRITE, ADMIN)
 *         systemModuleId:
 *           type: string
 *           format: uuid
 *           description: Optional system module ID linked to the role
 *         createdByTenantId:
 *           type: string
 *           format: uuid
 *           description: UUID of the tenant creating the role
 *         moduleAccesses:
 *           type: array
 *           description: List of module access configurations
 *           items:
 *             type: object
 *             required:
 *               - module
 *               - permissions
 *             properties:
 *               module:
 *                 type: string
 *                 description: Feature module name
 *               permissions:
 *                 type: array
 *                 description: List of permissions for the module
 *                 items:
 *                   type: string
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
         * /api/v1/role/:
         *   post:
         *     summary: create a new role
         *     tags: [role]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateRole'
         *     responses:
         *       201:
         *         description: Role created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", RoleDto.createRoleDto, this.controller.createRole);

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