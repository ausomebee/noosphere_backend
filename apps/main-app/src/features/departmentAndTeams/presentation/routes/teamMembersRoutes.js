import express from "express";
import TeamMembersDto from "../dto/teamMembersDto.js";
import TeamMembersController from "../controllers/teamMembersController.js";
import { adminProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     TeamMemberCreateDto:
 *       type: object
 *       required:
 *         - teamId
 *         - staffId
 *       properties:
 *         teamId:
 *           type: string
 *           format: uuid
 *           example: "team-1234-uuid"
 *         staffId:
 *           type: string
 *           format: uuid
 *           example: "staff-5678-uuid"
 */

class TeamMembersRoutes {
    constructor() {
        this.controller = new TeamMembersController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/team-members:
         *   post:
         *     summary: Add a member to a team
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TeamMemberCreateDto'
         *     responses:
         *       201:
         *         description: Team member added successfully
         */
        this.router.post(
            "/",
            adminProtect(),
            TeamMembersDto.createTeamMemberDto,
            this.controller.createTeamMember
        );

        /**
         * @swagger
         * /api/v1/organization/team-members/{id}:
         *   delete:
         *     summary: Remove a member from a team
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Team member ID
         *     responses:
         *       200:
         *         description: Team member removed successfully
         */
        this.router.delete(
            "/:id",
            adminProtect(),
            this.controller.removeTeamMember
        );

        /**
         * @swagger
         * /api/v1/organization/team-members/team/{teamId}:
         *   get:
         *     summary: Get all members of a team
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: teamId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Team ID
         *     responses:
         *       200:
         *         description: Team members fetched successfully
         */
        this.router.get(
            "/team/:teamId",
            adminProtect(),
            this.controller.getTeamMembers
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new TeamMembersRoutes().getRouter();
