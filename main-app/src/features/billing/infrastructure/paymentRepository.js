import BaseRepository from "./baseRepository.js";

class PaymentRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async findAllAndPopulate(filter = {}) {
        return await this.model.findMany({
            where: filter,
            include: {
                tenant: {
                    select: {
                        companyName: true
                    }
                }
            }
        });
    }

    async getAllPayments(page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;

        const [payments, total] = await Promise.all([
            this.model.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    tenant: {
                        select: {
                            id: true,
                            companyName: true
                        }
                    }
                },
                skip,
                take: pageSize,
            }),
            this.model.count({}),
        ]);

        return {
            data: payments,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }

    async getTenantPayments(tenantId, filter = {}, page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;

        const [payments, total] = await Promise.all([
            this.model.findMany({
                where: {
                    tenantId,
                    ...filter,
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: pageSize,
            }),
            this.model.count({
                where: {
                    tenantId,
                    ...filter,
                },
            }),
        ]);

        return {
            data: payments,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }

    async getTenantPaymentsByStatus(tenantId, status) {
        return await this.model.findMany({
            where: {
                tenantId,
                status,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async totalCount(query) {
        return await this.model.aggregate({
            where: query,
            _count: {
                _all: true,
            },
        });
    }

}

export default PaymentRepository;