import express from "express";
import FeatureController from "../controllers/featureController.js";
import FeatureDto from "../dto/featureDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateFeatureDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - featureGroupId
 *         - active
 *         - managedBy
 *       properties:
 *         featureGroupId:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *         name:
 *           type: string
 *           example: "calling"
 *         description:
 *           type: string
 *           example: "ability to make calls"
 *         active:
 *           type: boolean
 *         managedBy:
 *           type: string
 *           example: "local govt"
 *     CreateFeatureGroupDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "calling"
 *     UpdateFeatureGroupDto:
 *       type: object
 *       required:
 *         - name
 *         - id
 *       properties:
 *         name:
 *           type: string
 *           example: "calling"
 *         id:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *     deleteFeatureGroupDto:
 *       type: object
 *       required:
 *         - administratorPassword
 *         - id
 *       properties:
 *         administratorPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           maxLength: 100
 *           example: "StrongP@ssw0rd!"
 *           description: administrator password
 *         id:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *     moveFeatureDto:
 *       type: object
 *       required:
 *         - featureGroupId
 *         - id
 *       properties:
 *         featureGroupId:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *         id:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *     updateFeatureDto:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - managedBy
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *         name:
 *           type: string
 *           example: "calling"
 *         description:
 *           type: string
 *           example: "ability to make calls"
 *         managedBy:
 *           type: string
 *           example: "local govt"
 *     assignFeatureToPlanDto:
 *       type: object
 *       required:
 *         - id
 *         - applicablePlans
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *         applicablePlans:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Enterprise", "pro"]
 *     updateActivityDto:
 *       type: object
 *       required:
 *         - id
 *         - active
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *         active:
 *           type: boolean
 */

class FeatureRoutes {
    constructor() {
        this.controller = new FeatureController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/feature/feature:
         *   post:
         *     summary: Create Feature
         *     tags: [feature]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateFeatureDto'
         *     responses:
         *       201:
         *         description: Feature created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/feature", FeatureDto.createFeatureDto, this.controller.createFeature);

        /**
        * @swagger
        * /api/v1/feature/getfeature/{id}:
        *   get:
        *     summary: gets single Feature
        *     tags: [feature]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the Feature
        *     responses:
        *       200:
        *         description: Feature fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/getfeature/:id", FeatureDto.checkIdDto, this.controller.getSingleFeature);

        /**
         * @swagger
         * /api/v1/feature/allfeature:
         *   get:
         *     summary: Retrieve all feature
         *     tags: [feature]
         *     responses:
         *       200:
         *         description: all feature retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/allfeature", this.controller.getAllFeature);

        /**
         * @swagger
         * /api/v1/feature/featuregroup:
         *   post:
         *     summary: Create Feature group
         *     tags: [feature]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateFeatureGroupDto'
         *     responses:
         *       201:
         *         description: Featureg roup created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/featuregroup", FeatureDto.createFeatureGroupDto, this.controller.createFeatureGroup);

        /**
        * @swagger
        * /api/v1/feature/getfeaturegroup/{id}:
        *   get:
        *     summary: gets single Feature group
        *     tags: [feature]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the Feature group
        *     responses:
        *       200:
        *         description: Feature group fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/getfeaturegroup/:id", FeatureDto.checkIdDto, this.controller.getSingleFeatureGroup);

        /**
         * @swagger
         * /api/v1/feature/allfeaturegroup:
         *   get:
         *     summary: Retrieve all feature group
         *     tags: [feature]
         *     responses:
         *       200:
         *         description: all feature group retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/allfeaturegroup", this.controller.getAllFeatureGroup);

        /**
        * @swagger
        * /api/v1/feature/group:
        *   patch:
        *     summary: update feature group
        *     tags: [feature]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/UpdateFeatureGroupDto'
        *     responses:
        *       201:
        *         description: updated feature group successfully
        *       400:
        *         description: Validation error
        */
        this.router.patch("/group", FeatureDto.updateFeatureGroupDto, this.controller.updateFeatureGroup);

        /**
         * @swagger
         * /api/v1/feature/group:
         *   delete:
         *     summary: Delete a feature group
         *     tags:
         *       - feature
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/deleteFeatureGroupDto'
         *     responses:
         *       200:
         *         description: Successfully deleted feature group
         *       400:
         *         description: Validation error
         */
        this.router.delete("/group", FeatureDto.deleteFeatureGroupDto, this.controller.deleteSingleFeatureGroup);

        /**
        * @swagger
        * /api/v1/feature/move:
        *   patch:
        *     summary: move feature to another group
        *     tags: [feature]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/moveFeatureDto'
        *     responses:
        *       201:
        *         description: feature updated successfully
        *       400:
        *         description: Validation error
        */
        this.router.patch("/move", FeatureDto.moveFeatureDto, this.controller.updateFeature);

        /**
        * @swagger
        * /api/v1/feature/feature:
        *   patch:
        *     summary: update feature data
        *     tags: [feature]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/updateFeatureDto'
        *     responses:
        *       201:
        *         description: feature updated successfully
        *       400:
        *         description: Validation error
        */
        this.router.patch("/feature", FeatureDto.updateFeatureDto, this.controller.updateFeature);

        /**
        * @swagger
        * /api/v1/feature/feature:
        *   delete:
        *     summary: Delete a feature 
        *     tags:
        *       - feature
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/deleteFeatureGroupDto'
        *     responses:
        *       200:
        *         description: Successfully deleted feature
        *       400:
        *         description: Validation error
        */
        this.router.delete("/feature", FeatureDto.deleteFeatureGroupDto, this.controller.deleteSingleFeature);

        /**
        * @swagger
        * /api/v1/feature/plan:
        *   patch:
        *     summary: assign feature to a plan
        *     tags: [feature]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/assignFeatureToPlanDto'
        *     responses:
        *       201:
        *         description: feature updated successfully
        *       400:
        *         description: Validation error
        */
        this.router.patch("/plan", FeatureDto.assignFeatureToPlanDto, this.controller.updateFeature);

        /**
        * @swagger
        * /api/v1/feature/active:
        *   patch:
        *     summary: update feature activity
        *     tags: [feature]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/updateActivityDto'
        *     responses:
        *       201:
        *         description: feature updated successfully
        *       400:
        *         description: Validation error
        */
        this.router.patch("/active", FeatureDto.updateActivityDto, this.controller.updateFeature);

    }

    getRouter() {
        return this.router;
    }
}

export default new FeatureRoutes().getRouter();