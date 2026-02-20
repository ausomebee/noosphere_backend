import BaseRepository from "./baseRepository.js";

class PayrollCycleStaffDeductionsRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    async insertMany(data) {
        return await this.model.createMany({
            data,
            skipDuplicates: true 
        });
    }
}

export default PayrollCycleStaffDeductionsRepository;
