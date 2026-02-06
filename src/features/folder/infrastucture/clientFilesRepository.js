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
        console.log(clientTenantId)
        return await this.model.findMany({
            where: {
                folder: {
                    clientTenantId: clientTenantId.clientTenantId
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5,
        });
    }



}

export default ClientFilesRepository;
