import prismaService from "../../../config/prisma.js";

class DepartmentRepository {
    constructor() {
        this.prisma = prismaService.getClient();
        this.model = this.prisma.department;
    }

    async create(data) {
        return await this.model.create({ data });
    }

    async createTenantDepartment(tenantId, tx) {
        return await tx.department.create({
            data: {
                name: "Administration",
                module: "TENANT",
                createdByTenantId: tenantId,
                description: "This is the owner of this organization",
                access: {
                    canEdit: true,
                    canDelete: false
                }
            }
        });
    }

    async createAdminDepartment(tx) {
        return await tx.department.create({
            data: {
                name: "Administration",
                module: "ADMIN",
                description: "This is the super Admin",
                access: {
                    canEdit: true,
                    canDelete: false
                }
            }
        });
    }

    async findOne(query) {
        return await this.model.findUnique({
            where: query,
        });
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

export default DepartmentRepository;