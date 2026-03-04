class ServerRequestRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return await this.model.create({ data });
    }

    async findFirst(query) {
        return await this.model.findFirst({
            where: query,
        });
    }

    async findAll(filter = {}) {
        return await this.model.findMany({
            where: filter,
        });
    }

    async findOne(query) {
        return await this.model.findUnique({
            where: query,
        });
    }

    async update(id, data) {
        return await this.model.update({
            where: { id },
            data,
        });
    }

    async getTenantLogs({ tenantId, page = 1, limit = 20, statusCodes = [] }) {
        const skip = (page - 1) * limit;

        const where = {
            tenantId,
            ...(statusCodes.length > 0 && {
                statusCode: {
                    in: statusCodes,
                },
            }),
        };

        const [logs, total] = await Promise.all([
            this.model.findMany({
                where,
                include: {
                    tenant: true,
                    admin: true,
                    tenantStaff: true,
                    client: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            this.model.count({ where }),
        ]);

        return {
            data: logs,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async delete(id) {
        return await this.model.delete({
            where: { id },
        });
    }

    async findFirstDynamic(query) {
        const { where, include, select, orderBy, take, skip } = query;
        return await this.model.findFirst({ where, include, select, orderBy, take, skip });
    }

    async getLogsByDateRange({ tenantId, startDate, endDate, page = 1, limit = 20 }) {
        const skip = (page - 1) * limit;

        const where = {
            tenantId,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };

        const [logs, total] = await Promise.all([
            this.model.findMany({
                where,
                include: {
                    tenant: true,
                    admin: true,
                    tenantStaff: true,
                    client: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            this.model.count({ where }),
        ]);

        return {
            data: logs,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}

export default ServerRequestRepository;