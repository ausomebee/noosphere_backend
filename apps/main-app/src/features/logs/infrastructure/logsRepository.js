class LogsRepository {
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

    async getTenantLogs({ tenantId, adminId, featureNames = [], page = 1, limit = 20 }) {
        const skip = (page - 1) * limit;

        const where = {
            tenantId,
            ...(adminId !== undefined && { adminId }),
            ...(featureNames.length > 0 && {
                feature: {
                    in: featureNames,
                },
            }),
        };

        const [logs, total] = await Promise.all([
            this.model.findMany({
                where,
                include: {
                    admin: true,
                    client: true,
                    tenant: true,
                    issue: true,
                    subscription: true,
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

    async getTenantLogsGroupedByFeature({ tenantId, featureNames = [], page = 1, limit = 20 }) {
        const skip = (page - 1) * limit;

        const where = {
            tenantId,
            ...(featureNames.length > 0 && {
                feature: {
                    in: featureNames,
                },
            }),
        };

        const [logs, total] = await Promise.all([
            this.model.findMany({
                where,
                include: {
                    admin: true,
                    client: true,
                    tenant: true,
                    issue: true,
                    subscription: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            this.model.count({ where }),
        ]);

        // Group logs by feature
        const grouped = logs.reduce((acc, log) => {
            const key = log.feature || "unknown";
            if (!acc[key]) acc[key] = [];
            acc[key].push(log);
            return acc;
        }, {});

        return {
            data: grouped,
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
}

export default LogsRepository