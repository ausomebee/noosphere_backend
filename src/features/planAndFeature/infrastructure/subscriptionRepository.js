import BaseRepository from "./baseRepository.js";

class SubscriptionRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    async totalCount(query) {
        return await this.model.aggregate({
            where: query,
            _count: {
                _all: true,
            },
        });
    }

    async findAllAndPopulate(filter = {}) {
        return await this.model.findMany({
            where: filter,
            include: {
                tenant: true,
                plan: {
                    select: {
                        name: true
                    }
                },
                payment: true
            }
        });
    }

}

export default SubscriptionRepository;