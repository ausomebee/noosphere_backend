import BaseRepository from "./baseRepository.js";

class PipelineRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async findByModule(module) {
        return await this.model.findMany({
            where: { module: module },
        });
    }

    async txCreate(data, tx) {
        return await tx.Pipeline.create({ data });
    }

    async overview(tenantId) {
        return await this.model.findFirst({
            where: {
                createdByTenantId: tenantId,
                isActive: true,
            },
            orderBy: {
                createdAt: "asc",
            },
            select: {
                id: true,
                name: true,
                pipelineStages: {
                    orderBy: { order: "asc" },
                    select: {
                        name: true,
                        colourCode: true,
                        order: true,
                        _count: {
                            select: {
                                pipelineItem: true
                            }
                        }
                    }
                }
            }
        });
    }


}

export default PipelineRepository;