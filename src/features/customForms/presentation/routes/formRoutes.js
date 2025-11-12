import express from "express";
import FormDto from "../dto/formDto.js";
import FormController from "../controllers/formController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     FormCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - name
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         name:
 *           type: string
 *           description: Form name
 *           example: "Patient Intake Form"
 *         isDraft:
 *           type: boolean
 *         formFields:
 *           type: array
 *           description: Array of form fields for the form
 *           items:
 *             type: object
 *             properties:
 *               fieldType:
 *                 type: string
 *                 enum: [text, number, email, date, select, checkbox, radio, textarea]
 *                 description: Type of form field
 *               label:
 *                 type: string
 *                 description: Field label
 *                 example: "Email Address"
 *               placeholder:
 *                 type: string
 *                 description: Field placeholder text
 *                 example: "Enter your email"
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Options for select, radio, or checkbox fields
 *               isRequired:
 *                 type: boolean
 *                 description: Whether the field is mandatory
 *               order:
 *                 type: integer
 *                 description: Display order of the field
 *
 *     FormUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique form identifier
 *         isDraft:
 *           type: boolean
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Tenant identifier
 *         name:
 *           type: string
 *           description: Updated name of the form
 *         formFields:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Unique field ID (for existing fields)
 *               fieldType:
 *                 type: string
 *                 enum: [text, number, email, date, select, checkbox, radio, textarea]
 *               label:
 *                 type: string
 *               placeholder:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               isRequired:
 *                 type: boolean
 *               order:
 *                 type: integer
 */

class FormRoutes {
    constructor() {
        this.controller = new FormController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/forms/:
         *   post:
         *     summary: Create a new form along with its fields
         *     tags: [forms]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/FormCreateDto'
         *     responses:
         *       201:
         *         description: Form created successfully
         */
        this.router.post("/", FormDto.createFormDto, this.controller.createForm);

        /**
         * @swagger
         * /api/v1/forms/:
         *   put:
         *     summary: Update a form and its fields
         *     tags: [forms]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/FormUpdateDto'
         *     responses:
         *       200:
         *         description: Form updated successfully
         */
        this.router.put("/", FormDto.updateFormDto, this.controller.updateForm);

        /**
         * @swagger
         * /api/v1/forms/tenant/{tenantId}:
         *   get:
         *     summary: Get all forms for a tenant
         *     tags: [forms]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of tenant forms
         */
        this.router.get("/tenant/:tenantId", this.controller.getTenantForms);

        /**
         * @swagger
         * /api/v1/forms/{id}:
         *   get:
         *     summary: Get a single form with its fields
         *     tags: [forms]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Form fetched successfully
         */
        this.router.get("/:id", this.controller.getSingleForm);

        /**
         * @swagger
         * /api/v1/forms/{id}/{delete}:
         *   patch:
         *     summary: delete or restore a form
         *     tags: [forms]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *       - in: path
         *         name: active
         *         required: true
         *         schema:
         *           type: boolean
         *     responses:
         *       200:
         *         description: Form deleted successfully
         */
        this.router.patch("/:id/:delete", this.controller.deactivateForm);
    }

    getRouter() {
        return this.router;
    }
}

export default new FormRoutes().getRouter();
