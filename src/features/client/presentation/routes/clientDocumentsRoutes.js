import express from "express";
import ClientDocumentsController from "../controllers/clientDocumentsController.js";
import ClientDocumentsDto from "../dto/clientDocumentsDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClientDocumentCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - tenantClientId
 *         - documentName
 *         - documentType
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *         requestId:
 *           type: string
 *           format: uuid
 *         tenantClientId:
 *           type: string
 *           format: uuid
 *         documentName:
 *           type: string
 *           example: "National ID Card"
 *         documentType:
 *           type: string
 *           example: "ID"
 *         fileUrl:
 *           type: string
 *           example: "https://example.com/file.pdf"
 *         isVerified:
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
 *         documentName:
 *           type: string
 *         documentType:
 *           type: string
 *         fileUrl:
 *           type: string
 *         isVerified:
 *           type: boolean
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
		 *     summary: Upload client document
		 *     tags: [client-documents]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/ClientDocumentCreateDto'
		 *     responses:
		 *       201:
		 *         description: Client document uploaded successfully
		 */
		this.router.post("/", ClientDocumentsDto.createClientDocumentDto, this.controller.createClientDocument.bind(this.controller));

		/**
		 * @swagger
		 * /api/v1/client-documents/:
		 *   put:
		 *     summary: Update client document
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
		this.router.put("/", ClientDocumentsDto.updateClientDocumentDto, this.controller.updateClientDocument.bind(this.controller));

		/**
		 * @swagger
		 * /api/v1/client-documents/client/{tenantClientId}:
		 *   get:
		 *     summary: Get all documents for a client
		 *     tags: [client-documents]
		 *     parameters:
		 *       - in: path
		 *         name: tenantClientId
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Client documents fetched successfully
		 */
		this.router.get("/client/:tenantClientId", this.controller.getClientDocuments.bind(this.controller));

        /**
		 * @swagger
		 * /api/v1/client-documents/requested/{requestId}:
		 *   get:
		 *     summary: Get requested documents for a client
		 *     tags: [client-documents]
		 *     parameters:
		 *       - in: path
		 *         name: requestId
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Client requested documents fetched successfully
		 */
		this.router.get("/requested/:requestId", this.controller.getRequestDocuments.bind(this.controller));

		/**
		 * @swagger
		 * /api/v1/client-documents/{id}:
		 *   get:
		 *     summary: Get a single client document
		 *     tags: [client-documents]
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: Client document retrieved
		 */
		this.router.get("/:id", this.controller.getSingleClientDocument.bind(this.controller));

        /**
         * @swagger
         * /api/v1/client/{id}:
         *   patch:
         *     summary: delete document
         *     tags: [Clients]
         *     parameters:
         *       - in: path
         *         name: clientId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: document deleted successfully
         */
        this.router.patch("/:id", this.controller.deleteClientDocument);
	}

	getRouter() {
		return this.router;
	}
}

export default new ClientDocumentsRoutes().getRouter();
