import BaseRepository from "./baseRepository.js";

class ClientRequestedDocumentsRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async txCreate(data, tx) {
        return tx.clientRequestedDocuments.create({ data });
    }

    async countAllRequestedDocuments() {
        return this.model.count();
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }
}

export default ClientRequestedDocumentsRepository;
