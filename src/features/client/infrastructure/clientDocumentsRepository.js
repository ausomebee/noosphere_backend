import BaseRepository from "./baseRepository.js";

class ClientDocumentsRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async txCreate(data, tx) {
        return tx.clientDocuments.create({ data });
    }

    async countAllClientDocuments() {
        return this.model.count();
    }
}

export default ClientDocumentsRepository;
