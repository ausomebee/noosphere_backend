import express from "express";
import DocumentController from "../controller/documentController.js";
import DocumentDto from "../dto/documentDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     DocumentCreateDto:
 *       type: object
 *       required:
 *         - documentsUrl
 *         - tenantStaffId
 *       properties:
 *         documentsUrl:
 *           type: object
 *           description: JSON object containing document URLs
 *           example:
 *             passport: "https://example.com/passport.pdf"
 *             license: "https://example.com/license.pdf"
 *         tenantStaffId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the staff member
 * 
 *     DocumentUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - documentsUrl
 *         - tenantStaffId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the document
 *         documentsUrl:
 *           type: object
 *           description: JSON object containing document URLs
 *           example:
 *             passport: "https://example.com/passport.pdf"
 *             license: "https://example.com/license.pdf"
 *         tenantStaffId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the staff member
 *         isDeleted:
 *           type: boolean
 *           description: Indicates if the document is deleted
 */

class DocumentRoutes {
    constructor() {
        this.controller = new DocumentController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization-staff/document:
         *   put:
         *     summary: Update a tenant staff document
         *     tags: [organization-staff]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DocumentUpdateDto'
         *     responses:
         *       200:
         *         description: Document updated successfully
         *       400:
         *         description: Validation error
         *       404:
         *         description: Document not found
         */
        this.router.put("/", staffProtect, DocumentDto.updateDocumentDto, this.controller.updateDocument);

        /**
         * @swagger
         * /api/v1/organization-staff/document:
         *   post:
         *     summary: create a tenant staff document
         *     tags: [organization-staff]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DocumentCreateDto'
         *     responses:
         *       200:
         *         description: Document created successfully
         *       400:
         *         description: Validation error
         *       404:
         *         description: Document not found
         */
        this.router.post("/", staffProtect, DocumentDto.createDocumentDto, this.controller.createDocument);

        /**
         * @swagger
         * /api/v1/organization-staff/document/tenant-staff/{tenantStaffId}:
         *   get:
         *     summary: Get all documents for a tenant staff
         *     tags: [staff-documents]
         *     parameters:
         *       - in: path
         *         name: tenantStaffId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the tenant staff
         *     responses:
         *       200:
         *         description: Documents fetched successfully
         *       404:
         *         description: Documents not found
         */
        this.router.get("/tenant-staff/:tenantStaffId", staffProtect, this.controller.getTenantStaffDocuments);

        /**
         * @swagger
         * /api/v1/organization-staff/document/{id}:
         *   get:
         *     summary: Get a single tenant staff document
         *     tags: [organization-staff]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the document
         *     responses:
         *       200:
         *         description: Document fetched successfully
         *       404:
         *         description: Document not found
         */
        this.router.get("/:id", staffProtect, this.controller.getDocument);

        /**
         * @swagger
         * /api/v1/organization-staff/document/deleted/{id}/{isDeleted}:
         *   patch:
         *     summary: Mark a tenant staff document as deleted or not
         *     tags: [organization-staff]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the document
         *       - in: path
         *         name: isDeleted
         *         required: true
         *         schema:
         *           type: boolean
         *         description: Set to `true` to mark as deleted or `false` to restore
         *     responses:
         *       200:
         *         description: Document status updated successfully
         *       400:
         *         description: Invalid request
         *       404:
         *         description: Document not found
         */
        this.router.patch("/deleted/:id/:isDeleted", staffProtect, this.controller.updateDocument);
    }

    getRouter() {
        return this.router;
    }
}

export default new DocumentRoutes().getRouter();