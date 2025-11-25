import express from "express";
import ClientRequestedDocumentsController from "../controllers/clientRequestedDocumentsController.js";
import ClientRequestedDocumentsDto from "../dto/clientRequestedDocumentsDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     RequestedDocumentCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - requestId
 *         - documentName
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *         requestId:
 *           type: string
 *           format: uuid
 *         documentName:
 *           type: string
 *           example: "Proof of Address"
 *         description:
 *           type: string
 *         isMandatory:
 *           type: boolean
 *           example: true
 *
 *     RequestedDocumentUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         documentName:
 *           type: string
 *         description:
 *           type: string
 *         isMandatory:
 *           type: boolean
 *         isDeleted:
 *           type: boolean
 */

class RequestedDocumentsRoutes {
	constructor() {
		this.controller = new ClientRequestedDocumentsController();
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		/**
		 * @swagger
		 * /api/v1/requested-documents/:
		 *   post:
		 *     summary: Create requested document
		 *     tags: [requested-documents]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/RequestedDocumentCreateDto'
		 *     responses:
		 *       201:
		 *         description: Requested document created successfully
		 */
		this.router.post("/", ClientRequestedDocumentsDto.createRequestedDocumentDto, this.controller.createRequestedDocument.bind(this.controller));

		/**
		 * @swagger
		 * /api/v1/requested-documents/:
		 *   put:
		 *     summary: Update requested document
		 *     tags: [requested-documents]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/RequestedDocumentUpdateDto'
		 *     responses:
		 *       200:
		 *         description: Requested document updated successfully
		 */
		this.router.put("/", ClientRequestedDocumentsDto.updateRequestedDocumentDto, this.controller.updateRequestedDocument.bind(this.controller));

		/**
		 * @swagger
		 * /api/v1/requested-documents/request/{requestId}:
		 *   get:
		 *     summary: Get all requested documents for a request
		 *     tags: [requested-documents]
		 *     parameters:
		 *       - in: path
		 *         name: requestId
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: List of requested documents
		 */
		this.router.get("/request/:requestId", this.controller.getRequestedDocuments.bind(this.controller));

		/**
		 * @swagger
		 * /api/v1/requested-documents/{id}:
		 *   get:
		 *     summary: Get single requested document
		 *     tags: [requested-documents]
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Requested document retrieved
		 */
		this.router.get("/:id", this.controller.getSingleRequestedDocument.bind(this.controller));
	}

	getRouter() {
		return this.router;
	}
}

export default new RequestedDocumentsRoutes().getRouter();
