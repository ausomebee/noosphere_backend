import express from "express";
import TargetController from "../controllers/targetController.js";
import TargetDto from "../dto/targetDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTargetDto:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - programId
 *         - sd
 *         - expectedResponse
 *         - teachingProcedure
 *         - promptingStrategy
 *         - dataCollectionType
 *         - baselineDataRequired
 *         - masteryMetric
 *         - masteryCriteria
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "8b6b5a0e-6c9f-4a75-9e0b-7e6f2b9cc111"
 *         name:
 *           type: string
 *           example: "Identify letter A"
 *         description:
 *           type: string
 *           example: "Learner will identify the letter 'A' from a field of three."
 *         programId:
 *           type: string
 *           format: uuid
 *           example: "3d3f1a5d-8a2b-4d2a-bb4f-7dd6b0f9a123"
 *         sd:
 *           type: string
 *           example: "Show me 'A'"
 *         expectedResponse:
 *           type: string
 *           example: "Learner points to 'A'."
 *         teachingProcedure:
 *           type: string
 *           example: "Use most-to-least prompting; fade prompts across sessions."
 *         promptingStrategy:
 *           type: string
 *           example: "Gesture prompt followed by verbal prompt as needed."
 *         dataCollectionType:
 *           type: string
 *           example: "trial"
 *         baselineDataRequired:
 *           type: boolean
 *         numberOfTrials:
 *           type: integer
 *           example: 10
 *         numberOfTasks:
 *           type: integer
 *           example: 3
 *         taskSteps:
 *           type: object
 *           additionalProperties: true
 *           example:
 *             steps:
 *               - order: 1
 *                 description: "Present three letters."
 *               - order: 2
 *                 description: "Deliver SD."
 *         masteryMetric:
 *           type: string
 *           example: "percent_correct"
 *         masteryCriteria:
 *           type: object
 *           additionalProperties: true
 *           example:
 *             consecutiveSessions: 3
 *             thresholdPercent: 80
 *
 *     UpdateTargetDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "d2f9b3c1-1234-4abc-9f00-abcdef123456"
 *         name:
 *           type: string
 *           example: "Identify letter A (uppercase)"
 *         description:
 *           type: string
 *           example: "Updated target description."
 *         programId:
 *           type: string
 *           format: uuid
 *           example: "3d3f1a5d-8a2b-4d2a-bb4f-7dd6b0f9a123"
 *         sd:
 *           type: string
 *           example: "Find 'A'"
 *         expectedResponse:
 *           type: string
 *           example: "Learner says 'A'."
 *         teachingProcedure:
 *           type: string
 *           example: "Switch to least-to-most prompting."
 *         promptingStrategy:
 *           type: string
 *           example: "Verbal prompt only."
 *         dataCollectionType:
 *           type: string
 *           example: "task-analysis"
 *         baselineDataRequired:
 *           type: boolean
 *         numberOfTrials:
 *           type: integer
 *           example: 15
 *         numberOfTasks:
 *           type: integer
 *           example: 6
 *         taskSteps:
 *           type: object
 *           additionalProperties: true
 *           example:
 *             steps:
 *               - order: 1
 *                 description: "Match 'A' to 'A'."
 *         masteryMetric:
 *           type: string
 *           example: "consecutive_correct"
 *         masteryCriteria:
 *           type: object
 *           additionalProperties: true
 *           example:
 *             consecutiveSessions: 2
 *             thresholdPercent: 90
 */

class TargetRoutes {
    constructor() {
        this.controller = new TargetController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/targets:
         *   post:
         *     summary: Create Target
         *     tags: [program]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateTargetDto'
         *     responses:
         *       201:
         *         description: Target created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", TargetDto.createTargetDto, this.controller.createTarget);

        /**
         * @swagger
         * /api/v1/targets:
         *   patch:
         *     summary: Update Target
         *     tags: [program]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateTargetDto'
         *     responses:
         *       201:
         *         description: Target updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/", TargetDto.updateTargetDto, this.controller.updateTarget);

        /**
        * @swagger
        * /api/v1/targets/{programId}:
        *   get:
        *     summary: gets tenant targets
        *     tags: [program]
        *     parameters:
        *       - in: path
        *         name: programId
        *         required: true
        *         schema:
        *           type: string
        *         description: The program ID of the targets
        *     responses:
        *       200:
        *         description: Targets fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/:programId", this.controller.getAllProgramTargets);

    }

    getRouter() {
        return this.router;
    }
}

export default new TargetRoutes().getRouter();