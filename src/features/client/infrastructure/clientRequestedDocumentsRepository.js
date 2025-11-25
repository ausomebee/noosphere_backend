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
}

export default ClientRequestedDocumentsRepository;
