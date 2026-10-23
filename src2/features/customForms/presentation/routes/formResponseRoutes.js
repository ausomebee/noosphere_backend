import express from "express";
import FormResponseDto from "../dto/formResponseDto.js";
import FormResponseController from "../controllers/formResponseController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     FormResponseCreateDto:
 *       type: object
 *       required:
 *         - formId
 *         - tenantId
 *         - submittedBy
 *       properties:
 *         formId:
 *           type: string
 *           format: uuid
 *           description: ID of the form being responded to
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Tenant identifier
 *         submittedBy:
 *           type: string
 *           description: Identifier of the user who submitted the form response
 *         responseFields:
 *           type: array
 *           description: Array of response field entries
 *           items:
 *             type: object
 *             properties:
 *               formFieldId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the corresponding form field
 *               value:
 *                 type: string
 *                 description: User's answer to the field
 *                 example: "John Doe"
 *
 *     FormResponseUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique form response identifier
 *         responseFields:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the response field (if existing)
 *               formFieldId:
 *                 type: string
 *                 format: uuid
 *               value:
 *                 type: string
 *                 description: Updated value for the response field
 */

class FormResponseRoutes {
    constructor() {
        this.controller = new FormResponseController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/form-responses/:
         *   post:
         *     summary: Submit a new form response with its response fields
         *     tags: [form-responses]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/FormResponseCreateDto'
         *     responses:
         *       201:
         *         description: Form response created successfully
         */
        this.router.post("/", FormResponseDto.createFormResponseDto, this.controller.createFormResponse);

        /**
         * @swagger
         * /api/v1/form-responses/:
         *   put:
         *     summary: Update an existing form response and its response fields
         *     tags: [form-responses]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/FormResponseUpdateDto'
         *     responses:
         *       200:
         *         description: Form response updated successfully
         */
        this.router.put("/", FormResponseDto.updateFormResponseDto, this.controller.updateFormResponse);

        /**
         * @swagger
         * /api/v1/form-responses/{id}:
         *   get:
         *     summary: Get a single form response with its fields
         *     tags: [form-responses]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Form response fetched successfully
         */
        this.router.get("/:id", this.controller.getSingleFormResponse);

        /**
         * @swagger
         * /api/v1/form-responses/form/{formId}:
         *   get:
         *     summary: Get all form responses for a specific form
         *     tags: [form-responses]
         *     parameters:
         *       - in: path
         *         name: formId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: form form responses fetched successfully
         */
        this.router.get("/form/:formId", this.controller.getFormResponses);

        /**
         * @swagger
         * /api/v1/form-responses/{id}/{deleted}:
         *   patch:
         *     summary: Soft delete or restore a form response
         *     tags: [form-responses]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *       - in: path
         *         name: deleted
         *         required: true
         *         schema:
         *           type: boolean
         *     responses:
         *       200:
         *         description: Form response deletion status updated successfully
         */
        this.router.patch("/:id/:deleted", this.controller.deleteFormResponse);
    }

    getRouter() {
        return this.router;
    }
}

export default new FormResponseRoutes().getRouter();
