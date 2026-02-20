import BaseRepository from "./baseRepository.js";

class PayrollRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }
    
    async findOneAndPopulate(query, populate) {
        return await this.model.findFirst({
            where: query,
            include: populate
        });
    }
}

export default PayrollRepository;