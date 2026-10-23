class ClientFilesService {
    constructor({ clientFilesRepository }) {
        this.clientFilesRepository = clientFilesRepository;
    }

    async createClientFile(data) {
        const exists = await this.clientFilesRepository.findFirstDynamic({
            where: {
                folderId: data.folderId,
                name: data.name
            },
            select: { id: true }
        });

        if (exists) {
            throw new Error("File with this name already exists in this folder.");
        }

        const newRecord = await this.clientFilesRepository.create(data);

        if (!newRecord) {
            throw new Error("Failed to create Client File.");
        }

        return newRecord;
    }

    async updateClientFile(data) {
        const record = await this.clientFilesRepository.findOne({ id: data.id });

        if (!record) {
            throw new Error("Client File not found");
        }

        const updated = await this.clientFilesRepository.update(data.id, {
            name: data.name || record.name,
            url: data.url || record.url,
            size: data.size || record.size,
            fileType: data.fileType || record.fileType,
            uploadedBy: data.uploadedBy ?? record.uploadedBy
        });

        if (!updated) {
            throw new Error("Failed to update Client File");
        }

        return updated;
    }

    async findRecentFilesByClientTenant(clientTenantId) {
        const record = await this.clientFilesRepository.findRecentFilesByClientTenant({ clientTenantId });

        if (!record) {
            throw new Error("Client File not found");
        }

        const formattedRecords = record.map(file => {
            let uploadedBy = null;

            if (file.staff) {
                uploadedBy = `${file.staff.firstName} ${file.staff.lastName}`;
            } else if (file.clientTenant?.client) {
                uploadedBy = `${file.clientTenant.client.firstName} ${file.clientTenant.client.lastName}`;
            }

            const { clientTenant, staff, ...rest } = file;

            return {
                ...rest,
                uploadedBy
            };
        });

        return formattedRecords;
    }

    async findFilesByClientTenant(clientTenantId) {
        const records = await this.clientFilesRepository.findFilesByClientTenant({ clientTenantId });

        if (!records) {
            throw new Error("Client Files not found");
        }

        const formattedRecords = records.map(file => {
            let uploadedBy = null;

            if (file.staff) {
                uploadedBy = `${file.staff.firstName} ${file.staff.lastName}`;
            } else if (file.clientTenant?.client) {
                uploadedBy = `${file.clientTenant.client.firstName} ${file.clientTenant.client.lastName}`;
            }

            const { clientTenant, staff, ...rest } = file;

            return {
                ...rest,
                uploadedBy
            };
        });

        return formattedRecords;
    }

    async getSingleClientFile(id) {
        const record = await this.clientFilesRepository.findOne({ id });

        if (!record) {
            throw new Error("Client File not found");
        }

        return record;
    }

    async getClientFiles(folderId) {
        const records = await this.clientFilesRepository.findFilesByFolder(folderId);

        if (!records) {
            throw new Error("Client Files not found");
        }

        const formattedRecords = records.map(file => {
            let uploadedBy = null;

            if (file.staff) {
                uploadedBy = `${file.staff.firstName} ${file.staff.lastName}`;
            } else if (file.clientTenant?.client) {
                uploadedBy = `${file.clientTenant.client.firstName} ${file.clientTenant.client.lastName}`;
            }

            const { clientTenant, staff, ...rest } = file;

            return {
                ...rest,
                uploadedBy
            };
        });

        return formattedRecords;
    }
}

export default ClientFilesService;
