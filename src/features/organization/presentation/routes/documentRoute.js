import express from "express";
import DocumentController from "../controller/documentController.js";
import S3Service from "../../../../utilities/s3.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     DocumentCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - documentName
 *         - document
 *         - uploadedBy
 *       properties:
 *         tenantId:
 *           type: string
 *           description: Unique tenant identifier
 *           example: "c4b8a3e6-9d34-4f98-bb12-2a7e2f39a6d1"
 *         documentName:
 *           type: string
 *           description: Name of the document
 *           example: "Company Registration Certificate"
 *         document:
 *           type: string
 *           format: binary
 *         uploadedBy:
 *           type: string
 *           description: Identifier or name of the user who uploaded the document
 *           example: "admin@company.com"
 */

class DocumentRoutes {
    constructor() {
        this.controller = new DocumentController();
        this.router = express.Router();
        this.S3Service = new S3Service().getUploadMiddleware()
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/document:
         *   post:
         *     summary: Create organization document
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DocumentCreateDto'
         *     responses:
         *       201:
         *         description: Organization document created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/",  this.S3Service.single("document"), this.controller.createDocument);

        /**
        * @swagger
        * /api/v1/organization/document/{id}:
        *   get:
        *     summary: gets single organization document
        *     tags: [organization]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the document
        *     responses:
        *       200:
        *         description: organization document fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/:id", this.controller.getSingleDocument);

        /**
        * @swagger
        * /api/v1/organization/document/tenant/{tenantId}:
        *   get:
        *     summary: gets tenant organization documents
        *     tags: [organization]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The tenantId of the tenant
        *     responses:
        *       200:
        *         description: tenant organization documents fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant/:tenantId", this.controller.getTenantDocuments);

        /**
        * @swagger
        * /api/v1/organization/document/{id}:
        *   delete:
        *     summary: deletes an organization document
        *     tags: [organization]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the document
        *     responses:
        *       200:
        *         description: organization document deleted successfully
        *       400:
        *         description: Validation error
        */
        this.router.delete("/:id", this.controller.deleteDocument);

    }

    getRouter() {
        return this.router;
    }
}

export default new DocumentRoutes().getRouter();