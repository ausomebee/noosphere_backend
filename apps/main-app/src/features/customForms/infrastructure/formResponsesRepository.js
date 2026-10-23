import BaseRepository from "./baseRepository.js";

class FormResponsesRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    async findSingleWithFields(id) {
        return await this.model.findUnique({
            where: { id },
            include: {
                fields: {
                    include: {
                        formField: true
                    }
                }
            }
        });
    }
}

export default FormResponsesRepository;
