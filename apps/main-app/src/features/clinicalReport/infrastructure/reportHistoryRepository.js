import BaseRepository from "./baseRepository.js";

class ClinicalReportHistoryRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    async findAllWithCreatedBy(query) {
        return await this.model.findMany({
            where: query,
            include: {
                staff: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: {
                            select: { name: true }
                        }
                    }
                }
            }
        });
    }
}

export default ClinicalReportHistoryRepository;