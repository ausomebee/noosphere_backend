import express from "express";
import ClientRequestedDocumentsController from "../controllers/clientRequestedDocumentsController.js";
import ClientRequestedDocumentsDto from "../dto/clientRequestedDocumentsDto.js";
import { clientProtect(), staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClientRequestedDocumentCreateDto:
 *       type: object
 *       required:
 *         - tenantClientId
 *         - name
 *         - dueDate
 *       properties:
 *         tenantClientId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "National ID Card"
 *         description:
 *           type: string
 *           example: "Front and back required"
 *         allowMultiple:
 *           type: boolean
 *           example: false
 *         dueDate:
 *           type: string
 *           format: date-time
 *
 *     ClientRequestedDocumentUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         allowMultiple:
 *           type: boolean
 *         status:
 *           type: string
 *           enum: [PENDING, SUBMITTED, APPROVED, REJECTED]
 *         dueDate:
 *           type: string
 *           format: date-time
 *         isDeleted:
 *           type: boolean
 */

class ClientRequestedDocumentsRoutes {
	constructor() {
		this.controller = new ClientRequestedDocumentsController();
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		/**
		 * @swagger
		 * /api/v1/client-requested-documents/:
		 *   post:
		 *     summary: Create client requested document
		 *     tags: [client-requested-documents]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/ClientRequestedDocumentCreateDto'
		 *     responses:
		 *       201:
		 *         description: Document request created successfully
		 */
		this.router.post(
			"/",
			clientProtect(),
			ClientRequestedDocumentsDto.createRequestedDocumentDto,
			this.controller.createRequestedDocument.bind(this.controller)
		);

		/**
		 * @swagger
		 * /api/v1/client-requested-documents/tenant/:
		 *   post:
		 *     summary: Create client requested document
		 *     tags: [client-requested-documents]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/ClientRequestedDocumentCreateDto'
		 *     responses:
		 *       201:
		 *         description: Document request created successfully
		 */
		this.router.post(
			"/tenant/",
			staffProtect(),
			ClientRequestedDocumentsDto.createRequestedDocumentDto,
			this.controller.createRequestedDocument.bind(this.controller)
		);

		/**
		 * @swagger
		 * /api/v1/client-requested-documents/:
		 *   put:
		 *     summary: Update client requested document
		 *     tags: [client-requested-documents]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/ClientRequestedDocumentUpdateDto'
		 *     responses:
		 *       200:
		 *         description: Document request updated successfully
		 */
		this.router.put(
			"/",
			clientProtect(),
			ClientRequestedDocumentsDto.updateRequestedDocumentDto,
			this.controller.updateRequestedDocument.bind(this.controller)
		);

		/**
		 * @swagger
		 * /api/v1/client-requested-documents/tenant/:
		 *   put:
		 *     summary: Update client requested document
		 *     tags: [client-requested-documents]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/ClientRequestedDocumentUpdateDto'
		 *     responses:
		 *       200:
		 *         description: Document request updated successfully
		 */
		this.router.put(
			"/tenant/",
			staffProtect(),
			ClientRequestedDocumentsDto.updateRequestedDocumentDto,
			this.controller.updateRequestedDocument.bind(this.controller)
		);

		/**
		 * @swagger
		 * /api/v1/client-requested-documents/client/{tenantClientId}:
		 *   get:
		 *     summary: Get all requested documents for a tenant client
		 *     tags: [client-requested-documents]
		 *     parameters:
		 *       - in: path
		 *         name: tenantClientId
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: List of requested documents
		 */
		this.router.get(
			"/client/:tenantClientId",
			clientProtect(),
			this.controller.getRequestedDocuments.bind(this.controller)
		);

		/**
		 * @swagger
		 * /api/v1/client-requested-documents/client/tenant/{tenantClientId}:
		 *   get:
		 *     summary: Get all requested documents for a tenant client
		 *     tags: [client-requested-documents]
		 *     parameters:
		 *       - in: path
		 *         name: tenantClientId
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: List of requested documents
		 */
		this.router.get(
			"/client/tenant/:tenantClientId",
			staffProtect(),
			this.controller.getRequestedDocuments.bind(this.controller)
		);

		/**
		 * @swagger
		 * /api/v1/client-requested-documents/count/status/{tenantClientId}:
		 *   get:
		 *     summary: count all documents for a client byu status
		 *     tags: [client-requested-documents]
		 *     parameters:
		 *       - in: path
		 *         name: tenantClientId
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: requested documents counted successfully
		 */
		this.router.get(
			"/count/status/:tenantClientId",
			clientProtect(),
			this.controller.countAllRequestedDocumentsByStatus.bind(this.controller)
		);

		/**
		 * @swagger
		 * /api/v1/client-requested-documents/{id}:
		 *   get:
		 *     summary: Get single client requested document
		 *     tags: [client-requested-documents]
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Requested document retrieved successfully
		 */
		this.router.get(
			"/:id",
			clientProtect(),
			this.controller.getSingleRequestedDocument.bind(this.controller)
		);
	}

	getRouter() {
		return this.router;
	}
}

export default new ClientRequestedDocumentsRoutes().getRouter();
