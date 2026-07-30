import BaseRepository from "./baseRepository.js";

class NotificationsRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate,
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}

export default NotificationsRepository;
