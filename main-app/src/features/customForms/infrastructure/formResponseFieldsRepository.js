import BaseRepository from "./baseRepository.js";

class FormResponseFieldsRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllByResponseId(responseId) {
        return await this.model.findMany({
            where: { formResponseId: responseId },
            include: {
                formField: true
            }
        });
    }
}

export default FormResponseFieldsRepository;
