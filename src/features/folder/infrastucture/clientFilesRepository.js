import BaseRepository from "./baseRepository.js";

class ClientFilesRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    async findRecentFilesByClientTenant(clientTenantId) {
        return await this.model.findMany({
            where: {
                clientTenantId: clientTenantId.clientTenantId
            },
            include: {
                clientTenant: {
                    select: {
                        client: { select: { firstName: true, lastName: true } }
                    }
                },
                staff: { select: { fullName: true } }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5,
        });
    }

    async findFilesByFolder(folderId) {
        return await this.model.findMany({
            where: {
                folder: {
                    folderId: folderId.folderId
                }
            },
            include: {
                clientTenant: {
                    select: {
                        client: { select: { firstName: true, lastName: true } }
                    }
                },
                staff: { select: { fullName: true } }
            },
            orderBy: {
                createdAt: 'desc'
            },
        });
    }

    async findFilesByClientTenant(clientTenantId) {
        return await this.model.findMany({
            where: {
                clientTenantId: clientTenantId.clientTenantId
            },
            include: {
                clientTenant: {
                    select: {
                        client: { select: { firstName: true, lastName: true } }
                    }
                },
                staff: { select: { fullName: true } }
            },
            orderBy: {
                createdAt: 'desc'
            },
        });
    }

}

export default ClientFilesRepository;
