import BaseRepository from "./baseRepository.js";

class ClientFormRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    async countAllClientFormsByStatus() {
        const result = await this.model.groupBy({
            by: ["status"],
            _count: { _all: true },
        });

        return result.reduce((acc, item) => {
            acc[item.status] = item._count._all;
            return acc;
        }, {});
    }

}

export default ClientFormRepository;
