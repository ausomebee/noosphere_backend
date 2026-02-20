import express from "express";
import TeamsController from "../controllers/teamsController.js";
import TeamsDto from "../dto/teamDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     TeamsCreateDto:
 *       type: object
 *       required:
 *         - name
 *         - tenantId
 *         - teamLeadId
 *       properties:
 *         name:
 *           type: string
 *           example: "Product Development"
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-ab12-3456cdef7890"
 *         teamLeadId:
 *           type: string
 *           format: uuid
 *           example: "staff-1234-uuid"
 *         members:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           example: ["staff-2345-uuid", "staff-3456-uuid"]
 *
 *     TeamsUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         teamLeadId:
 *           type: string
 *           format: uuid
 *         members:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 */

class TeamsRoutes {
    constructor() {
        this.controller = new TeamsController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/teams:
         *   post:
         *     summary: Create a new team
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TeamsCreateDto'
         *     responses:
         *       201:
         *         description: Team created successfully
         */
        this.router.post(
            "/",
            TeamsDto.createTeamDto,
            this.controller.createTeam
        );

        /**
         * @swagger
         * /api/v1/organization/teams:
         *   put:
         *     summary: Update a team
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TeamsUpdateDto'
         *     responses:
         *       200:
         *         description: Team updated successfully
         */
        this.router.put(
            "/",
            TeamsDto.updateTeamDto,
            this.controller.updateTeam
        );

        /**
         * @swagger
         * /api/v1/organization/teams/{id}:
         *   get:
         *     summary: Get a single team
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Team ID
         *     responses:
         *       200:
         *         description: Team fetched successfully
         */
        this.router.get(
            "/:id",
            this.controller.getSingleTeam
        );

        /**
         * @swagger
         * /api/v1/organization/teams:
         *   get:
         *     summary: Get all teams (optionally filtered by query)
         *     tags: [organization]
         *     parameters:
         *       - in: query
         *         name: tenantId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: false
         *         description: Filter teams by tenant ID
         *     responses:
         *       200:
         *         description: Teams fetched successfully
         */
        this.router.get(
            "/",
            this.controller.getTeams
        );

        /**
         * @swagger
         * /api/v1/organization/teams/{id}/delete:
         *   delete:
         *     summary: Delete a team
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Team ID
         *     responses:
         *       200:
         *         description: Team deleted successfully
         */
        this.router.delete(
            "/:id/delete",
            this.controller.deleteTeam
        );

        /**
         * @swagger
         * /api/v1/organization/teams/{id}/active/{active}:
         *   put:
         *     summary: Activate or deactivate a team
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Team ID
         *       - in: path
         *         name: active
         *         schema:
         *           type: boolean
         *         required: true
         *         description: Whether to activate or deactivate the team
         *     responses:
         *       200:
         *         description: Team activated or deactivated successfully
         */
        this.router.put(
            "/:id/active/:active",
            this.controller.updateTeamActiveStatus
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new TeamsRoutes().getRouter();
