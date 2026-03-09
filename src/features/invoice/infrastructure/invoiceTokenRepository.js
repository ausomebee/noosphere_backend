class InvoiceTokenRepository {
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

}

export default InvoiceTokenRepository;