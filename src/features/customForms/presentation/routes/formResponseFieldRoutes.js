import express from "express";
import FormResponseFieldDto from "../dto/formResponseFieldDto.js";
import FormResponseFieldsController from "../controllers/formResponseFieldsController.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     FormResponseFieldCreateDto:
 *       type: object
 *       required:
 *         - formResponseId
 *         - formFieldId
 *         - value
 *       properties:
 *         formResponseId:
 *           type: string
 *           format: uuid
 *           description: The form response ID this field belongs to
 *         formFieldId:
 *           type: string
 *           format: uuid
 *           description: The form field ID this response is for
 *         value:
 *           type: string
 *           description: The value provided by the user for this field
 *           example: "John Doe"
 *
 *     FormResponseFieldUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the response field
 *         value:
 *           type: string
 *           description: Updated response value
 *           example: "Updated answer"
 */

class FormResponseFieldRoutes {
    constructor() {
        this.controller = new FormResponseFieldsController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/form-response-fields/:
         *   post:
         *     summary: Create a new form response field
         *     tags: [form-response-fields]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/FormResponseFieldCreateDto'
         *     responses:
         *       201:
         *         description: Form response field created successfully
         */
        this.router.post("/", staffProtect, FormResponseFieldDto.createFormResponseFieldDto, this.controller.createFormResponseField.bind(this.controller));

        /**
         * @swagger
         * /api/v1/form-response-fields/{id}:
         *   put:
         *     summary: Update a specific form response field
         *     tags: [form-response-fields]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/FormResponseFieldUpdateDto'
         *     responses:
         *       200:
         *         description: Form response field updated successfully
         */
        this.router.put("/:id", staffProtect, FormResponseFieldDto.updateFormResponseFieldDto, this.controller.updateFormResponseField.bind(this.controller));

        /**
         * @swagger
         * /api/v1/form-response-fields/{id}:
         *   get:
         *     summary: Get a single form response field by ID
         *     tags: [form-response-fields]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Form response field fetched successfully
         */
        this.router.get("/:id", staffProtect, this.controller.getSingleFormResponseField.bind(this.controller));

        /**
         * @swagger
         * /api/v1/form-response-fields/response/{formResponseId}:
         *   get:
         *     summary: Get all form response fields for a specific form response
         *     tags: [form-response-fields]
         *     parameters:
         *       - in: path
         *         name: formResponseId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of form response fields fetched successfully
         */
        this.router.get("/response/:formResponseId", staffProtect, this.controller.getFormResponseFields.bind(this.controller));
    }

    getRouter() {
        return this.router;
    }
}

export default new FormResponseFieldRoutes().getRouter();
