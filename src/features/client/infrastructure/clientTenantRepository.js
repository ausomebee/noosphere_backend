import BaseRepository from "./baseRepository.js";

class ClientTenantRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async txCreate(data, tx) {
        return await tx.clientTenant.create({ data });
    }

    async countAllClientss() {
        return await this.model.count();
    }

    async findFirstDynamic(query) {
        const { where, include, select, orderBy, take, skip } = query;

        return await this.model.findFirst({
            where,
            include,
            select,
            orderBy,
            take,
            skip,
        });
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

}

export default ClientTenantRepository;