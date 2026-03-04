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

    async getTenantPayments(tenantId, filter = {}) {
        return await this.model.findMany({
            where: {
                tenantId,
                ...filter,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
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