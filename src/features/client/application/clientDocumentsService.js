class ClientDocumentsService {
    constructor({ clientDocumentsRepository }) {
        this.clientDocumentsRepository = clientDocumentsRepository;
    }

    async createClientDocument(data) {
        const existing = await this.clientDocumentsRepository.findFirstDynamic({
            where: { name: data.name, tenantClientId: data.tenantClientId },
            select: { id: true }
        });

        if (existing) {
            throw new Error("This document already exists for this client.");
        }

        const newDoc = await this.clientDocumentsRepository.create(data);

        if (!newDoc) {
            throw new Error("Failed to create Client Document");
        }

        return newDoc;
    }

    async updateClientDocument(data) {
        const document = await this.clientDocumentsRepository.findOne({ id: data.id });

        if (!document) {
            throw new Error("Client Document not found");
        }

        const update = await this.clientDocumentsRepository.update(data.id, {
            name: data.name || document.name,
            documentDetails: data.documentDetails || document.documentDetails,
            isDeleted: data.isDeleted ?? document.isDeleted,
        });

        if (!update) {
            throw new Error("Failed to update Client Document");
        }

        return update;
    }

    async getSingleClientDocument(data) {
        const document = await this.clientDocumentsRepository.findOne({ id: data.id });

        if (!document) {
            throw new Error("Client Document not found");
        }

        return document;
    }

    async getClientDocuments(tenantClientId) {
        const documents = await this.clientDocumentsRepository.findAll({ tenantClientId });

        if (!documents) {
            throw new Error("Client Documents not found");
        }

        return documents;
    }
}

export default ClientDocumentsService;
