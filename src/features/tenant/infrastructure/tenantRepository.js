import prismaService from "../../../config/prisma.js";

class TenantRepository {
    constructor() {
        this.prisma = prismaService.getClient();
        this.model = this.prisma.tenant;
        this.staff = this.prisma.tenantStaff;
    }

    async create(data) {
        return await this.model.create({ data });
    }

    async createAdminStaff(data, tx) {
        return await tx.tenantStaff.create({
            data: {
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                roleId: data.roleId,
                tenantId: data.tenantId,
                phoneNumber: data.phoneNumber,
                stage: data.stage
            }
        });
    }

    async txCreate(data, tx) {
        return await tx.tenant.create({ data });
    }

    async findOne(query) {
        return await this.model.findUnique({
            where: query,
        });
    }

    async findOneStaff(query) {
        return await this.staff.findUnique({
            where: query,
        });
    }

    async findFirst(query) {
        return await this.model.findFirst({
            where: query,
        });
    }

    async findFirstDynamic(query) {
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

    async findFirstDynamicStaff(query) {
        const { where, include, select, orderBy, take, skip } = query;

        return await this.staff.findFirst({
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

export default TenantRepository;