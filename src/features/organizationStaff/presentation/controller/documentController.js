import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import DocumentRepository from "../../infrastructure/documentRepository.js";
import DocumentService from "../../application/documentService.js";

class DocumentController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.documentRepository = new DocumentRepository(this.prisma.tenantStaffDocuments);
        this.service = new DocumentService({
            documentRepository: this.documentRepository
        });
    }

    updateDocument = expressAsyncHandler(async (req, res) => {
        const document = await this.service.updateDocument({
            id: req.params.id ? req.params.id : req.body.id,
            ...req.body
        });

        if (!document) {
            res.status(500).json({ message: "Failed to update document" });
        }

        return res.status(200).json({
            message: "Document updated successfully",
            status: "ok",
            data: document,
        });
    });

    getTenantStaffDocuments = expressAsyncHandler(async (req, res) => {
        const documents = await this.service.getTenantStaffDocuments(req.params.tenantStaffId);

        if (!documents) {
            res.status(404).json({ message: "Documents not found" });
        }

        return res.status(200).json({
            message: "Documents retrieved successfully",
            status: "ok",
            data: documents,
        });
    });

    getDocument = expressAsyncHandler(async (req, res) => {
        const document = await this.service.getDocument(req.params.id);

        if (!document) {
            res.status(404).json({ message: "Document not found" });
        }

        return res.status(200).json({
            message: "Document retrieved successfully",
            status: "ok",
            data: document,
        });
    });

    createDocument = expressAsyncHandler(async (req, res) => {
        const document = await this.service.createTenantDocument(req.body);

        if (!document) {
            res.status(404).json({ message: "Document creation failed" });
        }

        return res.status(200).json({
            message: "Document created successfully",
            status: "ok",
            data: document,
        });
    });
}

export default DocumentController;