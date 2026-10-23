import { is } from "date-fns/locale";
import BaseRepository from "./baseRepository.js";

class ClinicalReportTemplateRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }
}

export default ClinicalReportTemplateRepository;