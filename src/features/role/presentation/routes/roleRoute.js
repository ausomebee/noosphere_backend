import express from "express";
import RoleDto from "../dto/roleDto.js";
import RoleController from "../controllers/roleController.js";
import { adminProtect, staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateRole:
 *       type: object
 *       required:
 *         - name
 *         - dataAccessLevel
 *         - moduleAccesses
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 20
 *           description: Name of the role (max 20 characters)
 *         dataAccessLevel:
 *           type: string
 *           description: Level of data access (e.g., READ, WRITE, ADMIN)
 *         systemModule:
 *           type: string
 *           description: Optional system module linked to the role
 *         createdByAdminId:
 *           type: string
 *           format: uuid
 *           description: UUID of the admin creating the role
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
 *
 *     updateRole:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - dataAccessLevel
 *         - moduleAccesses
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: UUID of the role to update
 *         name:
 *           type: string
 *           maxLength: 20
 *           description: Name of the role (max 20 characters)
 *         dataAccessLevel:
 *           type: string
 *           description: Level of data access (e.g., READ, WRITE, ADMIN)
 *         moduleAccesses:
 *           type: array
 *           description: List of module access configurations
 *           items:
 *             type: object
 *             required:
 *               - module
 *               - permissions
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the role module access (if updating existing access)
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
 *         systemModule:
 *           type: string
 *           description: Optional system module linked to the role
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
        this.router.post("/adminrole", adminProtect(), RoleDto.createRoleDto, this.controller.createAdminRole);

        /**
         * @swagger
         * /api/v1/role/tenant:
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
        this.router.post("/tenant", staffProtect(), RoleDto.createRoleDto, this.controller.createRole);

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
        this.router.post("/", adminProtect(), RoleDto.createRoleDto, this.controller.createRole);

        /**
         * @swagger
         * /api/v1/role/tenant:
         *   patch:
         *     summary: update an existing role
         *     tags: [role]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/updateRole'
         *     responses:
         *       201:
         *         description: Role updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/tenant", staffProtect(), RoleDto.updateRoleDto, this.controller.updateRole);

        /**
         * @swagger
         * /api/v1/role/:
         *   patch:
         *     summary: update an existing role
         *     tags: [role]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/updateRole'
         *     responses:
         *       201:
         *         description: Role updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/", adminProtect(), RoleDto.updateRoleDto, this.controller.updateRole);

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
        this.router.post("/tenantrole", staffProtect(), RoleDto.createRoleDto, this.controller.createTenantRole);

        /**
         * @swagger
         * /api/v1/role/module/{systemModule}:
         *   get:
         *     summary: fetch all roles in a system module
         *     tags: [role]
         *     parameters:
         *       - in: path
         *         name: systemModule
         *         required: true
         *         schema:
         *           type: string
         *           description: System module name (e.g., "TENANT", "ADMIN")
         *     responses:
         *       200:
         *         description: Roles fetched successfully
         */
        this.router.get("/module/:systemModule", adminProtect(), this.controller.getRolesByModule);
        
        /**
         * @swagger
         * /api/v1/role/tenant{id}:
         *   get:
         *     summary: fetch a role by ID
         *     tags: [role]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *           description: ID of the role
         *     responses:
         *       200:
         *         description: Role fetched successfully
         */
        this.router.get("/tenant/:id", staffProtect(), this.controller.getRole);

        /**
         * @swagger
         * /api/v1/role/{id}:
         *   get:
         *     summary: fetch a role by ID
         *     tags: [role]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *           description: ID of the role
         *     responses:
         *       200:
         *         description: Role fetched successfully
         */
        this.router.get("/:id", adminProtect(), this.controller.getRole);
        
        /**
         * @swagger
         * /api/v1/role/deactivate/{id}:
         *   patch:
         *     summary: deactivate a role by ID
         *     tags: [role]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *           description: ID of the role
         *     responses:
         *       200:
         *         description: Role deactivated successfully
         */
        this.router.patch("/deactivate/:id", adminProtect(), this.controller.deactivateRole);

         /**
         * @swagger
         * /api/v1/role/module/{systemModule}/{tenantId}:
         *   get:
         *     summary: fetch all roles in a system module for a specific tenant
         *     tags: [role]
         *     parameters:
         *       - in: path
         *         name: systemModule
         *         required: true
         *         schema:
         *           type: string
         *           description: System module name (e.g., "TENANT", "ADMIN")
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *           description: ID of the tenant
         *     responses:
         *       200:
         *         description: Roles fetched successfully
         */
        this.router.get("/module/:systemModule/:tenantId", staffProtect(), this.controller.getRolesByModule);
        
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
        this.router.get("/:departmentId", adminProtect(), RoleDto.departmentIdDto, this.controller.getRoles);

    }

    getRouter() {
        return this.router;
    }
}

export default new RoleRoutes().getRouter();