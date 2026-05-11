class InvoiceRepository {
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

    async findAllAndPopulate(filter = {}, pop) {
        return await this.model.findMany({
            where: filter,
            include: pop
        });
    }

    async getTenantInvoices(tenantId, filter = {}, page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;

        const [invoices, total] = await Promise.all([
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
            data: invoices,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }

    async getAllInvoices(page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;

        const [invoices, total] = await Promise.all([
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
            data: invoices,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }

    async getTenantInvoicesByStatus(tenantId, status) {
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

    async getInvoiceTokenHistory(tenantId) {
        const invoices = await this.model.findMany({
            where: { tenantId },
            include: {
                invoiceTokens: {
                    orderBy: { createdAt: "asc" },
                },
                Payment: true,
            },
            orderBy: { createdAt: "asc" },
        });

        if (!invoices || invoices.length === 0) {
            throw new Error("No invoices found for this tenant");
        }

        const history = [];

        for (const invoice of invoices) {
            const tokens = invoice.invoiceTokens;

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];

                history.push({
                    event: i === 0 ? "PAYMENT_LINK_GENERATED" : "PAYMENT_LINK_REGENERATED",
                    time: token.createdAt,
                    invoiceId: invoice.id,
                    tokenId: token.id,
                });

                if (new Date() > token.expiresAt && !token.used) {
                    history.push({
                        event: "PAYMENT_LINK_EXPIRED",
                        time: token.expiresAt,
                        invoiceId: invoice.id,
                        tokenId: token.id,
                    });
                }

                if (token.used) {
                    const payment = invoice.Payment.find(
                        (p) => p.invoiceId === invoice.id
                    );

                    if (payment) {
                        history.push({
                            event: "PAYMENT_LINK_PAID",
                            time: payment.createdAt,
                            invoiceId: invoice.id,
                            tokenId: token.id,
                        });
                    }
                }
            }
        }

        return history.sort((a, b) => new Date(a.time) - new Date(b.time));
    }

    async findOne(query) {
        return await this.model.findUnique({
            where: query,
        });
    }

    async findOneAndPopulate(query, pop) {
        return await this.model.findUnique({
            where: query,
            include: pop
        });
    }

    async update(id, data) {
        return await this.model.update({
            where: { id },
            data,
        });
    }

    async delete(id) {
        return await this.model.delete({
            where: { id },
        });
    }

    async totalBilled(query) {
        return await this.model.aggregate({
            where: query,
            _sum: {
                total: true,
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

export default InvoiceRepository;