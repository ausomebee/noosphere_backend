import express from "express";
import FormFieldsController from "../controllers/formFieldsController.js";
import FormFieldsDto from "../dto/formFieldDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     FormFieldCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - formId
 *         - label
 *         - placeholder
 *         - order
 *         - fieldType
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         formId:
 *           type: string
 *           format: uuid
 *           description: The form ID this field belongs to
 *         placeholder:
 *           type: string
 *           description: Placeholder text for the form field
 *           example: "Enter your full name"
 *         order:
 *           type: integer
 *           description: Order of the field in the form
 *           example: 1
 *         label:
 *           type: string
 *           description: Label of the form field
 *           example: "Full Name"
 *         fieldType:
 *           type: string
 *           description: Type of the field (text, select, checkbox, etc.)
 *           example: "text"
 *         options:
 *           type: array
 *           description: Options for dropdown or checkbox fields
 *           example: ["Option 1", "Option 2"]
 *         fileUpload:
 *           type: array
 *         starRating:
 *           type: array
 *         signature:
 *           type: array
 *         isRequired:
 *           type: boolean
 *           description: Whether this field is mandatory
 *           example: true
 *
 *     FormFieldUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - placeholder
 *         - order
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique form field ID
 *         order:
 *           type: integer
 *         label:
 *           type: string
 *         fieldType:
 *           type: string
 *         options:
 *           type: array
 *           items:
 *             type: string
 *         fileUpload:
 *           type: array
 *         starRating:
 *           type: array
 *         signature:
 *           type: array
 *         placeholder:
 *           type: string
 *         isRequired:
 *           type: boolean
 *         isDeleted:
 *           type: boolean
 *         isActive:
 *           type: boolean
 */

class FormFieldsRoutes {
	constructor() {
		this.controller = new FormFieldsController();
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		/**
		 * @swagger
		 * /api/v1/form-fields/:
		 *   post:
		 *     summary: Create form field
		 *     tags: [form-fields]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/FormFieldCreateDto'
		 *     responses:
		 *       201:
		 *         description: Form field created successfully
		 */
		this.router.post("/", staffProtect, FormFieldsDto.createFormFieldDto, this.controller.createFormField.bind(this.controller));

		/**
		 * @swagger
		 * /api/v1/form-fields/:
		 *   put:
		 *     summary: Update form field
		 *     tags: [form-fields]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/FormFieldUpdateDto'
		 *     responses:
		 *       200:
		 *         description: Form field updated successfully
		 */
		this.router.put("/", staffProtect, FormFieldsDto.updateFormFieldDto, this.controller.updateFormField.bind(this.controller));

		/**
		 * @swagger
		 * /api/v1/form-fields/form/{formId}:
		 *   get:
		 *     summary: Get all fields for a specific form
		 *     tags: [form-fields]
		 *     parameters:
		 *       - in: path
		 *         name: formId
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: List of form fields for the given form
		 */
		this.router.get("/form/:formId", staffProtect, this.controller.getFormFields.bind(this.controller));

		/**
		 * @swagger
		 * /api/v1/form-fields/{id}:
		 *   get:
		 *     summary: Get single form field by ID
		 *     tags: [form-fields]
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Form field fetched successfully
		 */
		this.router.get("/:id", staffProtect, this.controller.getSingleFormField.bind(this.controller));

	}

	getRouter() {
		return this.router;
	}
}

export default new FormFieldsRoutes().getRouter();
