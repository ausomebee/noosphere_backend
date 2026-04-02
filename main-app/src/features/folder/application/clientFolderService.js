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

    parseSizeToBytes(size) {
        if (!size) return 0n;

        const units = { B: 1n, KB: 1024n, MB: 1024n ** 2n, GB: 1024n ** 3n, TB: 1024n ** 4n };

        if (typeof size === "number") return BigInt(size);

        const str = size.toString().trim();
        const regex = /^([\d.]+)\s*(B|KB|MB|GB|TB)$/i;
        const match = str.match(regex);

        if (!match) return 0n;

        const value = parseFloat(match[1]);
        const unit = match[2].toUpperCase();

        return BigInt(Math.round(value * Number(units[unit])));
    }

    async getClientFolders(clientTenantId) {
        const records = await this.clientFolderRepository.findAllAndPopulate(
            { clientTenantId },
            { clientFiles: true }
        );

        if (!records) {
            throw new Error("Client Folders not found");
        }

        const foldersWithSize = records.map((folder) => {
            const folderSize = folder.clientFiles.reduce((total, file) => {
                return total + this.parseSizeToBytes(file.size);
            }, 0n);

            return {
                ...folder,
                folderSize: folderSize.toString(),
            };
        });

        return foldersWithSize;
    }

}

export default ClientFolderService;
