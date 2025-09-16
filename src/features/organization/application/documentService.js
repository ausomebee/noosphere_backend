class DocumentService {
    constructor({ documentRepository }) {
        this.documentRepository = documentRepository;
    }

    async createDocument(data) {
        const documentExists = await this.documentRepository.findFirstDynamic({
            where: { name: data.name },
            select: { name: true }
        });

        if (documentExists) {
            throw new Error("This document already exists.");
        }

        const newDocument = await this.documentRepository.create(data);

        if (!newDocument) {
            throw new Error("Failed to create Document");
        }

        return newDocument;
    }

    async updateDocument(data) {
        const document = await this.documentRepository.findOne({ id: data.id })

        if (!document) {
            throw new Error("Document not found");
        }

        const update = await this.documentRepository.update(data.id, {
            documentName: data.documentName || document.documentName,
            documentUrl: data.documentUrl || document.documentUrl,
            isDeleted: data.isDeleted ?? document.isDeleted,
        });

        if (!update) {
            throw new Error("Failed to update Document");
        }

        return update;
    }

    async getSingleDocument(data) {
        const document = await this.documentRepository.findOne({ id: data.id });

        if (!document) {
            throw new Error("Document not found")
        }

        return document;
    }

    async getTenantDocuments(tenantId) {
        const documents = await this.documentRepository.findAll({ tenantId });

        if (!documents) {
            throw new Error("Documents not found")
        }

        return documents;
    }
    
}

export default DocumentService;