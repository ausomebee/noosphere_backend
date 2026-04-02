import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import DocumentRepository from "../../infrastucture/documentRepository.js";
import DocumentService from "../../application/documentService.js";
import Document from "../../domain/document.js";

class DocumentController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.documentRepository = new DocumentRepository(this.prisma.organizationDocuments)
        this.service = new DocumentService({ documentRepository: this.documentRepository });
    }

    createDocument = expressAsyncHandler(async (req, res) => {
        const data = req.file ? {
            ...req.body,
            documentUrl: req.file.location
        } : req.body
        const documentData = new Document(data);
        const document = await this.service.createDocument(documentData.createDocument);

        if (!document) {
            res.status(500).json({ message: 'Failed to create document' });
        }

        return res.status(201).json({
            message: "document created successfully",
            status: 'ok',
            data: document
        });
    });

    updateDocument = expressAsyncHandler(async (req, res) => {
        const document = await this.service.updateDocument(req.body);

        if (!document) {
            res.status(500).json({ message: 'Failed to update document' });
        }

        return res.status(201).json({
            message: "document updated successfully",
            status: 'ok',
            data: document
        });
    });

    getSingleDocument = expressAsyncHandler(async (req, res) => {
        const document = await this.service.getSingleDocument(req.params);

        if (!document) {
            res.status(500).json({ message: 'Failed to fetch document' });
        }

        return res.status(201).json({
            message: "document fetched successfully",
            status: 'ok',
            data: document
        });
    });

    getTenantDocuments = expressAsyncHandler(async (req, res) => {
        const documents = await this.service.getTenantDocuments(req.params.tenantId);

        if (!documents) {
            res.status(500).json({ message: 'Failed to fetch documents' });
        }

        return res.status(201).json({
            message: "documents fetched successfully",
            status: 'ok',
            data: documents
        });
    });

    deleteDocument = expressAsyncHandler(async (req, res) => {
        const document = await this.service.updateDocument({id: req.params.id, isDeleted: true});

        if (!document) {
            res.status(500).json({ message: 'Failed to update document' });
        }

        return res.status(201).json({
            message: "document updated successfully",
            status: 'ok',
            data: document
        });
    });
}

export default DocumentController;