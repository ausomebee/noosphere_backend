import BaseRepository from "./baseRepository.js";

class ClinicalReportRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    async findOneAndPopulate(query, populate) {
        return await this.model.findUnique({
            where: query,
            include: populate
        });
    }

    async findAllByStatus(tenantId, status) {
        return await this.model.findMany({
            where: {
                tenantId: tenantId,
                status: status
            }
        });
    }
}

export default ClinicalReportRepository;