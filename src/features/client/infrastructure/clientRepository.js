import prismaService from "../../../config/prisma.js";

class ClientRepository {
    constructor() {
        this.prisma = prismaService.getClient();
        this.model = this.prisma.client;
        this.clientTenant = this.prisma.clientTenant;
    }

    async create(data) {
        return await this.model.create({ data });
    }

    async createClientTenant(data) {
        return await this.clientTenant.create({ data });
    }

    async txCreateClient(data, tx) {
        return await tx.client.create({ data });
    }

    async txCreateClientTenant(data, tx) {
        return await tx.clientTenant.create({ data });
    }

    async findOne(query) {
        return await this.model.findUnique({
            where: query,
        });
    }

    async findFirst(query) {
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

    async findAll(query = {}) {
        const { where, include, select, orderBy, take, skip } = query;

        return await this.model.findMany({
            where,
            include,
            select,
            orderBy,
            take,
            skip,
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

}

export default ClientRepository;