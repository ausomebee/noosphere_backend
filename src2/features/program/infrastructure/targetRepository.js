import BaseRepository from "./baseRepository.js";

class TargetRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async findOneAndPopulate(query, populate) {
        return await this.model.findFirst({
            where: query,
            include: populate
        });
    }

    async findTargetWithFirstSessionData(targetId) {
        return await this.model.findFirst({
            where: {
                id: targetId
            },
            include: {
                sessionDatas: {
                    take: 1,
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });
    }
}

export default TargetRepository;