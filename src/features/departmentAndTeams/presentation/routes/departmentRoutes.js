import express from "express";
import DepartmentDto from "../dto/departmentDto.js";
import DepartmentController from "../controllers/departmentController.js";
import { adminProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     DepartmentCreateDto:
 *       type: object
 *       required:
 *         - name
 *         - teamLeadId
 *       properties:
 *         name:
 *           type: string
 *           example: "Engineering"
 *         createdByAdminId:
 *           type: string
 *           format: uuid
 *           example: "admin-1234-uuid"
 *         teamLeadId:
 *           type: string
 *           format: uuid
 *           example: "staff-5678-uuid"
 *         members:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           example: ["staff-2345-uuid", "staff-3456-uuid"]
 *
 *     DepartmentUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         createdByAdminId:
 *           type: string
 *           format: uuid
 *         teamLeadId:
 *           type: string
 *           format: uuid
 *         members:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 */

class DepartmentsRoutes {
    constructor() {
        this.controller = new DepartmentController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/departments:
         *   post:
         *     summary: Create a new department
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DepartmentCreateDto'
         *     responses:
         *       201:
         *         description: Department created successfully
         */
        this.router.post(
            "/",
            adminProtect(),
            DepartmentDto.createDepartmentDto,
            this.controller.createDepartment
        );

        /**
         * @swagger
         * /api/v1/organization/departments:
         *   put:
         *     summary: Update a department
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DepartmentUpdateDto'
         *     responses:
         *       200:
         *         description: Department updated successfully
         */
        this.router.put(
            "/",
            adminProtect(),
            DepartmentDto.updateDepartmentDto,
            this.controller.updateDepartment
        );

        /**
         * @swagger
         * /api/v1/organization/departments/{id}:
         *   get:
         *     summary: Get a single department
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Department ID
         *     responses:
         *       200:
         *         description: Department fetched successfully
         */
        this.router.get(
            "/:id",
            adminProtect(),
            this.controller.getSingleDepartment
        );

        /**
         * @swagger
         * /api/v1/organization/departments:
         *   get:
         *     summary: Get all departments (optionally filtered by query)
         *     tags: [organization]
         *     parameters:
         *       - in: query
         *         name: createdByAdminId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: false
         *         description: Filter departments by admin who created them
         *     responses:
         *       200:
         *         description: Departments fetched successfully
         */
        this.router.get(
            "/",
            adminProtect(),
            this.controller.getDepartments
        );

        /**
         * @swagger
         * /api/v1/organization/departments/{id}/active/{active}:
         *   patch:
         *     summary: Activate or deactivate a department
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Department ID
         *       - in: path
         *         name: active
         *         schema:
         *           type: boolean
         *         required: true
         *         description: Whether to activate or deactivate the department
         *     responses:
         *       200:
         *         description: Department activated or deactivated successfully
         */
        this.router.patch(
            "/:id/active/:active",
            adminProtect(),
            this.controller.updateDepartmentActiveStatus
        );

        /**
         * @swagger
         * /api/v1/organization/departments/{id}/delete:
         *   delete:
         *     summary: Delete a department
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Department ID
         *     responses:
         *       200:
         *         description: Department deleted successfully
         */
        this.router.delete(
            "/:id/delete",
            adminProtect(),
            this.controller.deleteDepartment
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new DepartmentsRoutes().getRouter();
