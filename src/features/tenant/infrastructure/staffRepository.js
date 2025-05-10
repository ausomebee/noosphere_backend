import BaseRepository from "./baseRepository.js";

class StaffRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async txCreate(data, tx) {
        return await tx.tenantStaff.create({ data });
    }
}

export default StaffRepository;