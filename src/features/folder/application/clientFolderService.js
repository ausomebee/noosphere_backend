class ClientFolderService {
    constructor({ clientFolderRepository }) {
        this.clientFolderRepository = clientFolderRepository;
    }

    async createClientFolder(data) {
        const exists = await this.clientFolderRepository.findFirstDynamic({
            where: {
                clientTenantId: data.clientTenantId,
                name: data.name
            },
            select: { id: true }
        });

        if (exists) {
            throw new Error("Folder with this name already exists.");
        }

        const newRecord = await this.clientFolderRepository.create(data);

        if (!newRecord) {
            throw new Error("Failed to create Client Folder.");
        }

        return newRecord;
    }

    async updateClientFolder(data) {
        const record = await this.clientFolderRepository.findOne({ id: data.id });

        if (!record) {
            throw new Error("Client Folder not found");
        }

        const updated = await this.clientFolderRepository.update(data.id, {
            name: data.name || record.name
        });

        if (!updated) {
            throw new Error("Failed to update Client Folder");
        }

        return updated;
    }

    async getSingleClientFolder(id) {
        const record = await this.clientFolderRepository.findOne({ id });

        if (!record) {
            throw new Error("Client Folder not found");
        }

        return record;
    }

    async getClientFolders(clientTenantId) {
        const records = await this.clientFolderRepository.findAll({ clientTenantId });

        if (!records) {
            throw new Error("Client Folders not found");
        }

        return records;
    }
}

export default ClientFolderService;
