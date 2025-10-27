import express from "express";
import FormFieldsController from "../controllers/formFieldsController.js";
import FormFieldsDto from "../dto/formFieldDto.js";

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
 *           items:
 *             type: string
 *           description: Options for dropdown or checkbox fields
 *           example: ["Option 1", "Option 2"]
 *         isRequired:
 *           type: boolean
 *           description: Whether this field is mandatory
 *           example: true
 *
 *     FormFieldUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique form field ID
 *         tenantId:
 *           type: string
 *           format: uuid
 *         label:
 *           type: string
 *         fieldType:
 *           type: string
 *         options:
 *           type: array
 *           items:
 *             type: string
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
		this.router.post("/", FormFieldsDto.createFormFieldDto, this.controller.createFormField);

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
		this.router.put("/", FormFieldsDto.updateFormFieldDto, this.controller.updateFormField);

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
		this.router.get("/form/:formId", this.controller.getFormFields);

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
		this.router.get("/:id", this.controller.getSingleFormField);

		// /**
		//  * @swagger
		//  * /api/v1/form-fields/{id}/{active}:
		//  *   patch:
		//  *     summary: Deactivate or activate a form field
		//  *     tags: [form-fields]
		//  *     parameters:
		//  *       - in: path
		//  *         name: id
		//  *         required: true
		//  *         schema:
		//  *           type: string
		//  *       - in: path
		//  *         name: active
		//  *         required: true
		//  *         schema:
		//  *           type: boolean
		//  *     responses:
		//  *       200:
		//  *         description: Form field status updated successfully
		//  */
		// this.router.patch("/:id/:active", this.controller.toggleFormFieldActiveStatus);
	}

	getRouter() {
		return this.router;
	}
}

export default new FormFieldsRoutes().getRouter();
