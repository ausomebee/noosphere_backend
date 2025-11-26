import BaseRepository from "./baseRepository.js";

class ClientAuthorizationRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async txCreate(data, tx) {
        return tx.clientAuthorization.create({ data });
    }

    async countAllClientAuthorizations() {
        return this.model.count();
    }
}

export default ClientAuthorizationRepository;
