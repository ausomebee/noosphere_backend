import BaseRepository from "./baseRepository.js";

class TenantDeactivationRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async getDeactivationLogs(page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            this.model.findMany({
                where: { reactivationDate: null },
                include: {
                    tenant: {
                        select: {
                            id: true,
                            companyName: true,
                            email: true
                        }
                    },
                    deactivatedBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                orderBy: { deactivatedAt: "desc" },
                skip,
                take: limit
            }),
            this.model.count({
                where: { reactivationDate: null }
            })
        ]);

        return {
            data: logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getReactivationLogs(page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            this.model.findMany({
                where: { NOT: { reactivationDate: null } },
                include: {
                    tenant: {
                        select: {
                            id: true,
                            companyName: true,
                            email: true
                        }
                    },
                    deactivatedBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                orderBy: { reactivationDate: "desc" },
                skip,
                take: limit
            }),
            this.model.count({
                where: { NOT: { reactivationDate: null } }
            })
        ]);

        return {
            data: logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

}

export default TenantDeactivationRepository;