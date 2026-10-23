import prismaService from "../../../config/prisma.js";

class RoleRepository {
    constructor() {
        this.prisma = prismaService.getClient();
        this.model = this.prisma.role;
    }

    async create(data) {
        return await this.model.create({ data });
    }

    async findOne(query) {
        return await this.model.findUnique({
            where: query,
            include: {
                roleModuleAccesses: true,
            }
        });
    }

    async findFirst(query) {
        const { where, include } = query;
        return await this.model.findFirst({
            where,
            include
        });
    }

    async createTenantRole(dataAccessLevel, createdByTenantId, tx) {
        return await tx.role.create({
            data: {
                name: "Admin",
                dataAccessLevel: dataAccessLevel,
                systemModule: "TENANT",
                createdByTenantId: createdByTenantId,
            }
        });
    }

    async createAdminRole(dataAccessLevel, createdByAdminId, tx) {
        return await tx.role.create({
            data: {
                name: "Admin",
                dataAccessLevel: dataAccessLevel,
                systemModule: "ADMIN",
                createdByAdminId: createdByAdminId
            }
        });
    }

    async findAll(filter = {}) {
        return await this.model.findMany({
            where: filter,
            include: {
                roleModuleAccesses: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async update(id, data) {
        return await this.model.update({
            where: { id },
            data,
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

export default RoleRepository;