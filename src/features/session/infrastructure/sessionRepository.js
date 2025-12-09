import BaseRepository from "./baseRepository.js";

class SessionRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            select: populate
        });
    }
}

export default SessionRepository;
