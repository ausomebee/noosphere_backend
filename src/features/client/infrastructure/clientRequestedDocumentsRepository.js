import BaseRepository from "./baseRepository.js";

class ClientRequestedDocumentsRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async txCreate(data, tx) {
        return tx.clientRequestedDocuments.create({ data });
    }

    async countAllRequestedDocumentsByStatus() {
        const result = await this.model.groupBy({
            by: ["status"],
            _count: { _all: true },
        });

        return result.reduce((acc, item) => {
            acc[item.status] = item._count._all;
            return acc;
        }, {});
    }

    async countAllRequestedDocumentsByDueDate(clientTenantId) {
        const now = new Date();

        const overdueCount = await this.model.count({
            where: {
                clientTenantId:clientTenantId,
                dueDate: {
                    lt: now,
                },
            },
        });

        return overdueCount
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }
}

export default ClientRequestedDocumentsRepository;
