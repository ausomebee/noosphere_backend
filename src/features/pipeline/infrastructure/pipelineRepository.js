import prismaService from "../../../config/prisma.js";

class PipelineRepository {
    constructor() {
        this.prisma = prismaService.getClient();
        this.model = this.prisma.pipeline;
        this.stage = this.prisma.pipelineStage;
        this.item = this.prisma.pipelineItem;
    }

    async create(data) {
        return await this.model.create({ data });
    }

    async createItem(data) {
        return await this.item.create({ data });
    }

    async createStage(data) {
        return await this.stage.create({ data });
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

    async findFirstStage(query) {
        return await this.stage.findFirst({
            where: query,
        });
    }

    async findFirstItem(query) {
        return await this.item.findFirst({
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

export default PipelineRepository;