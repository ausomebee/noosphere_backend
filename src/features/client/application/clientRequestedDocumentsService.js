class ClientRequestedDocumentsService {
    constructor({ clientRequestedDocumentsRepository }) {
        this.clientRequestedDocumentsRepository = clientRequestedDocumentsRepository;
    }

    async createRequestedDocument(data) {
        const exists = await this.clientRequestedDocumentsRepository.findFirstDynamic({
            where: { name: data.name, tenantClientId: data.tenantClientId },
            select: { id: true }
        });

        if (exists) {
            throw new Error("This requested document already exists for this client.");
        }

        const newRequest = await this.clientRequestedDocumentsRepository.create(data);

        if (!newRequest) {
            throw new Error("Failed to create Requested Document");
        }

        return newRequest;
    }

    async updateRequestedDocument(data) {
        const request = await this.clientRequestedDocumentsRepository.findOne({ id: data.id });

        if (!request) {
            throw new Error("Requested Document not found");
        }

        const update = await this.clientRequestedDocumentsRepository.update(data.id, {
            name: data.name || request.name,
            description: data.description || request.description,
            allowMultiple: data.allowMultiple ?? request.allowMultiple,
            dueDate: data.dueDate || request.dueDate,
            isDeleted: data.isDeleted ?? request.isDeleted
        });

        if (!update) {
            throw new Error("Failed to update Requested Document");
        }

        return update;
    }

    async getSingleRequestedDocument(data) {
        const request = await this.clientRequestedDocumentsRepository.findOne({ id: data.id });

        if (!request) {
            throw new Error("Requested Document not found");
        }

        return request;
    }

    async getRequestedDocuments(tenantClientId) {
        const requests = await this.clientRequestedDocumentsRepository.findAllAndPopulate({ tenantClientId }, {clientDocuments: true});

        if (!requests) {
            throw new Error("Requested Documents not found");
        }

        return requests;
    }
}

export default ClientRequestedDocumentsService;
