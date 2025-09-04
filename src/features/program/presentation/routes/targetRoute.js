import express from "express";
import TargetController from "../controllers/targetController.js";
import TargetDto from "../dto/targetDto.js";
import S3Service from "../../../../utilities/s3.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTarget:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: Name of the target.
 *         description:
 *           type: string
 *           minLength: 1
 *           maxLength: 5000
 *           description: Description of the target.
 *         programId:
 *           type: string
 *           format: uuid
 *           description: UUID of the related program.
 *         sd:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: SD (discriminative stimulus) of the target.
 *         expectedResponse:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           description: Expected response for the target.
 *         teachingProcedure:
 *           type: string
 *           minLength: 1
 *           maxLength: 5000
 *           description: Teaching procedure for the target.
 *         promptingStrategy:
 *           type: array
 *           items:
 *             type: string
 *             minLength: 1
 *             maxLength: 255
 *           description: List of prompting strategies.
 *           example: ["Verbal", "Gestural", "Physical"]
 *         dataCollectionType:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Type of data collection.
 *         baselineDataRequired:
 *           type: boolean
 *           description: Whether baseline data is required.
 *         numberOfTrials:
 *           type: integer
 *           minimum: 1
 *           maximum: 100000
 *           description: Optional number of trials.
 *         numberOfTasks:
 *           type: integer
 *           minimum: 1
 *           maximum: 100000
 *           description: Optional number of tasks.
 *         taskSteps:
 *           oneOf:
 *             - type: object
 *               description: Task steps as an object.
 *             - type: array
 *               items: {}
 *               description: Task steps as an array.
 *             - type: 'null'
 *           description: Task steps for the target.
 *           nullable: true
 *         initialStatus:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: Initial status of the target.
 *         notes:
 *           type: string
 *           maxLength: 5000
 *           description: Additional notes.
 *         masteryMetric:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: Mastery metric for the target.
 *         masteryCriteria:
 *           oneOf:
 *             - type: object
 *               description: Mastery criteria as a JSON object.
 *             - type: array
 *               items: {}
 *               description: Mastery criteria as a JSON array.
 *           description: Mastery criteria for the target.
 *         attachment:
 *           type: string
 *           format: binary
 *       required:
 *         - name
 *         - description
 *         - programId
 *         - sd
 *         - expectedResponse
 *         - teachingProcedure
 *         - promptingStrategy
 *         - dataCollectionType
 *         - baselineDataRequired
 *         - initialStatus
 *         - notes
 *         - masteryMetric
 *         - masteryCriteria
 *         - attachment
 *
 *     TargetUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         description:
 *           type: string
 *           minLength: 1
 *           maxLength: 5000
 *         sd:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         expectedResponse:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *         teachingProcedure:
 *           type: string
 *           minLength: 1
 *           maxLength: 5000
 *         promptingStrategy:
 *           type: array
 *           items:
 *             type: string
 *             minLength: 1
 *             maxLength: 255
 *           description: List of prompting strategies.
 *         dataCollectionType:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         baselineDataRequired:
 *           type: boolean
 *         numberOfTrials:
 *           type: integer
 *           minimum: 1
 *           maximum: 100000
 *         numberOfTasks:
 *           type: integer
 *           minimum: 1
 *           maximum: 100000
 *         taskSteps:
 *           oneOf:
 *             - type: object
 *             - type: array
 *               items: {}
 *             - type: 'null'
 *           nullable: true
 *         masteryMetric:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         masteryCriteria:
 *           oneOf:
 *             - type: object
 *             - type: array
 *               items: {}
 *             - type: 'null'
 *           nullable: true
 *         initialStatus:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         notes:
 *           type: string
 *           maxLength: 5000
 *         id:
 *           type: string
 *           format: uuid
 *           description: Target ID (required for update).
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         attachment:
 *           type: string
 *           format: binary
 *           description: Optional file attachment.
 *       required:
 *         - id
 *         - promptingStrategy
 */

class TargetRoutes {
    constructor() {
        this.controller = new TargetController();
        this.router = express.Router();
        this.S3Service = new S3Service().getUploadMiddleware()
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
         *         multipart/form-data:
         *           schema:
         *             $ref: '#/components/schemas/CreateTarget'
         *     responses:
         *       201:
         *         description: Target created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", this.S3Service.single("attachment"), TargetDto.createTargetDto, this.controller.createTarget);

        /**
         * @swagger
         * /api/v1/targets:
         *   patch:
         *     summary: Update Target
         *     tags: [program]
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             $ref: '#/components/schemas/TargetUpdate'
         *     responses:
         *       201:
         *         description: Target updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/", this.S3Service.single("attachment"), TargetDto.updateTargetDto, this.controller.updateTarget);

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

        /**
         * @swagger
         * /api/v1/targets/{id}:
         *   delete:
         *     summary: Delete Target
         *     tags: [program]
         *     parameters:
         *      - in: path
         *        name: id
         *        required: true
         *        schema:
         *          type: string
         *        description: The Target ID
         *     responses:
         *       200:
         *         description: Target deleted successfully
         *       400:
         *         description: Validation error
         */
        this.router.delete("/:id", this.controller.deleteTarget);

    }

    getRouter() {
        return this.router;
    }
}

export default new TargetRoutes().getRouter();