class AppointmentServiceRepository {
    constructor(model, prisma) {
        this.model = model;
        this.prisma = prisma;
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

    async delete(id) {
        return await this.model.delete({
            where: { id },
        });
    }

    async findFirstDynamic(query) {
        const { where, include, select, orderBy, take, skip } = query;
        return await this.model.findFirst({ where, include, select, orderBy, take, skip });
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }
}

export default AppointmentServiceRepository;
