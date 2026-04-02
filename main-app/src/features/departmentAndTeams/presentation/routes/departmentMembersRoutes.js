import express from "express";
import DepartmentMembersDto from "../dto/departmentMembersDto.js";
import DepartmentMembersController from "../controllers/departmentMembersController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     DepartmentMemberCreateDto:
 *       type: object
 *       required:
 *         - departmentId
 *         - adminId
 *       properties:
 *         departmentId:
 *           type: string
 *           format: uuid
 *           example: "dept-1234-uuid"
 *         adminId:
 *           type: string
 *           format: uuid
 *           example: "staff-5678-uuid"
 */

class DepartmentMembersRoutes {
    constructor() {
        this.controller = new DepartmentMembersController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/department-members:
         *   post:
         *     summary: Add a member to a department
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DepartmentMemberCreateDto'
         *     responses:
         *       201:
         *         description: Department member added successfully
         */
        this.router.post(
            "/",
            DepartmentMembersDto.createDepartmentMemberDto,
            this.controller.createDepartmentMember
        );

        /**
         * @swagger
         * /api/v1/organization/department-members/{id}:
         *   delete:
         *     summary: Remove a member from a department
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Department member ID
         *     responses:
         *       200:
         *         description: Department member removed successfully
         */
        this.router.delete(
            "/:id",
            this.controller.removeDepartmentMember
        );

        /**
         * @swagger
         * /api/v1/organization/department-members/department/{departmentId}:
         *   get:
         *     summary: Get all members of a department
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: departmentId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Department ID
         *     responses:
         *       200:
         *         description: Department members fetched successfully
         */
        this.router.get(
            "/department/:departmentId",
            this.controller.getDepartmentMembers
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new DepartmentMembersRoutes().getRouter();
