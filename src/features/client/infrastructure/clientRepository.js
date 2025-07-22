import BaseRepository from "./baseRepository.js";

class ClientRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async txCreate(data, tx) {
        return await tx.client.create({ data });
    }

    async countAllClientss() {
        return await this.model.count();
    }

}

export default ClientRepository;