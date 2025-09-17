class DocumentService {
    constructor({ documentRepository }) {
        this.documentRepository = documentRepository;
    }

    async updateDocument(data) {
        const document = await this.documentRepository.findOne({ id: data.id });

        if (!document) {
            throw new Error("Document not found");
        }

        const update = await this.documentRepository.update(data.id, {
            documentsUrl: data.documentsUrl || document.documentsUrl,
            tenantStaffId: data.tenantStaffId || document.tenantStaffId,
            isDeleted: data.isDeleted ?? document.isDeleted
        });

        if (!update) {
            throw new Error("Failed to update document");
        }

        return update;
    }
    
    async updateDocument(data) {
        const document = await this.documentRepository.findOne({ id: data.id });

        if (!document) {
            throw new Error("Document not found");
        }

        const update = await this.documentRepository.update(data.id, {
            documentsUrl: data.documentsUrl || document.documentsUrl,
            tenantStaffId: data.tenantStaffId || document.tenantStaffId,
            isDeleted: data.isDeleted ?? document.isDeleted
        });

        if (!update) {
            throw new Error("Failed to update document");
        }

        return update;
    }

    async getTenantStaffDocuments(tenantStaffId) {
        const documents = await this.documentRepository.findAllAndPopulate({ tenantStaffId, active: true, isDeleted: false });

        if (!documents) {
            throw new Error("Documents not found");
        }

        return documents;
    }

    async getDocument(id) {
        const document = await this.documentRepository.findFirst({ id });

        if (!document) {
            throw new Error("Document not found");
        }

        return document;
    }
}

export default DocumentService;