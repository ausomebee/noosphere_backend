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

    async getInvoiceTokenHistory(invoiceId) {
        const invoice = await this.model.findFirst({
            where: { id: invoiceId },
            include: {
                invoiceTokens: true,
                Payment: true,
            },
        });

        if (!invoice) {
            throw new Error("Invoice not found");
        }

        const history = [];

        for (const token of invoice.invoiceTokens) {

            history.push({
                event: "PAYMENT_LINK_GENERATED",
                time: token.createdAt,
                tokenId: token.id,
            });

            if (new Date() > token.expiresAt && !token.used) {
                history.push({
                    event: "PAYMENT_LINK_EXPIRED",
                    time: token.expiresAt,
                    tokenId: token.id,
                });
            }

            if (token.used) {
                const payment = invoice.Payment.find(
                    (p) => p.invoiceId === invoiceId
                );

                if (payment) {
                    history.push({
                        event: "PAYMENT_LINK_PAID",
                        time: payment.createdAt,
                        tokenId: token.id,
                    });
                }
            }
        }

        if (invoice.invoiceTokens.length > 1) {
            const sortedTokens = invoice.invoiceTokens.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );

            for (let i = 1; i < sortedTokens.length; i++) {
                history.push({
                    event: "PAYMENT_LINK_REGENERATED",
                    time: sortedTokens[i].createdAt,
                    tokenId: sortedTokens[i].id,
                });
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