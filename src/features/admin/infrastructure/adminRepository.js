import prismaService from "../../../config/prisma.js";

class AdminRepository {
    constructor() {
        this.prisma = prismaService.getClient();
        this.model = this.prisma.admin;
        this.superAdminChoices = this.prisma.superAdminChoices;
    }

    async create(data) {
        return await this.model.create({ data });
    }

    async createChoice(data) {
        return await this.superAdminChoices.create({ data });
    }

    async txCreate(data, tx) {
        return await tx.admin.create({ data });
    }

    async findOne(query) {
        return await this.model.findUnique({
            where: query,
        });
    }

    async findOneChoice(query) {
        return await this.superAdminChoices.findUnique({
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
            data: { ...data },
        });
    }

    async updateChoice(id, data) {
        return await this.superAdminChoices.update({
            where: { id },
            data: { ...data },
        });
    }

    async updateWithField(field, value, data) {
        const record = await this.model.findUnique({
            where: { [field]: value },
        });

        if (!record) return { count: 0 };

        return await this.model.update({
            where: { [field]: value },
            data,
        });
    }

    async delete(id) {
        return await this.model.delete({
            where: { id },
        });
    }

}

export default AdminRepository;