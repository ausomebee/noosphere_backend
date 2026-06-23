import express from "express";
import ClientDocumentsController from "../controllers/clientDocumentsController.js";
import ClientDocumentsDto from "../dto/clientDocumentsDto.js";
import { clientProtect, staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClientDocumentCreateDto:
 *       type: object
 *       required:
 *         - tenantClientId
 *         - name
 *         - documentDetails
 *       properties:
 *         tenantClientId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "Driver’s License"
 *         documentDetails:
 *           type: object
 *           example:
 *             fileUrl: "https://example.com/document.pdf"
 *             size: 25000
 *             type: "pdf"
 *         requestId:
 *           type: string
 *           format: uuid
 *         isDeleted:
 *           type: boolean
 *           example: false
 *
 *     ClientDocumentUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         documentDetails:
 *           type: object
 *         isDeleted:
 *           type: boolean
 */

class ClientDocumentsRoutes {
	constructor() {
		this.controller = new ClientDocumentsController();
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		/**
		 * @swagger
		 * /api/v1/client-documents/:
		 *   post:
		 *     summary: Upload or create a client document
		 *     tags: [client-documents]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/ClientDocumentCreateDto'
		 *     responses:
		 *       201:
		 *         description: Client document created successfully
		 */
		this.router.post(
			"/",
			clientProtect(),
			ClientDocumentsDto.createClientDocumentDto,
			this.controller.createClientDocument.bind(this.controller)
		);

		/**
		 * @swagger
		 * /api/v1/client-documents/tenant/:
		 *   post:
		 *     summary: Upload or create a client document
		 *     tags: [client-documents]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/ClientDocumentCreateDto'
		 *     responses:
		 *       201:
		 *         description: Client document created successfully
		 */
		this.router.post(
			"/tenant/",
			staffProtect(),
			ClientDocumentsDto.createClientDocumentDto,
			this.controller.createClientDocument.bind(this.controller)
		);

		/**
		 * @swagger
		 * /api/v1/client-documents/:
		 *   put:
		 *     summary: Update a client document
		 *     tags: [client-documents]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/ClientDocumentUpdateDto'
		 *     responses:
		 *       200:
		 *         description: Client document updated successfully
		 */
		this.router.put(
			"/",
			clientProtect(),
			ClientDocumentsDto.updateClientDocumentDto,
			this.controller.updateClientDocument.bind(this.controller)
		);

		/**
		 * @swagger
		 * /api/v1/client-documents/tenant/:
		 *   put:
		 *     summary: Update a client document
		 *     tags: [client-documents]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/ClientDocumentUpdateDto'
		 *     responses:
		 *       200:
		 *         description: Client document updated successfully
		 */
		this.router.put(
			"/tenant/",
			staffProtect(),
			ClientDocumentsDto.updateClientDocumentDto,
			this.controller.updateClientDocument.bind(this.controller)
		);

		/**
		 * @swagger
		 * /api/v1/client-documents/client/{tenantClientId}:
		 *   get:
		 *     summary: Get all documents uploaded by a client
		 *     tags: [client-documents]
		 *     parameters:
		 *       - in: path
		 *         name: tenantClientId
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: List of client documents retrieved successfully
		 */
		this.router.get(
			"/client/:tenantClientId",
			clientProtect(),
			this.controller.getClientDocuments.bind(this.controller)
		);

		/**
		 * @swagger
		 * /api/v1/client-documents/client/tenant/{tenantClientId}:
		 *   get:
		 *     summary: Get all documents uploaded by a client
		 *     tags: [client-documents]
		 *     parameters:
		 *       - in: path
		 *         name: tenantClientId
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: List of client documents retrieved successfully
		 */
		this.router.get(
			"/client/tenant/:tenantClientId",
			staffProtect(),
			this.controller.getClientDocuments.bind(this.controller)
		);

		/**
		 * @swagger
		 * /api/v1/client-documents/{id}:
		 *   get:
		 *     summary: Get a single client document by ID
		 *     tags: [client-documents]
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Client document retrieved successfully
		 */
		this.router.get(
			"/:id",
			clientProtect(),
			this.controller.getSingleClientDocument.bind(this.controller)
		);

        /**
        * @swagger
        * /api/v1/client-documents/{id}:
        *   delete:
        *     summary: deletes a document
        *     tags: [client-documents]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the document
        *     responses:
        *       200:
        *         description: document deleted successfully
        *       400:
        *         description: Validation error
        */
        this.router.delete("/:id", clientProtect(), this.controller.deleteClientDocument);

	}

	getRouter() {
		return this.router;
	}
}

export default new ClientDocumentsRoutes().getRouter();
