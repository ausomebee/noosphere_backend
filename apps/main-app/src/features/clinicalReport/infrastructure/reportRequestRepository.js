import BaseRepository from "./baseRepository.js";

class ClinicalReportChangeRequestRepository extends BaseRepository {
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

    async findAllByClinicalReport(clinicalReportId) {
        return await this.model.findMany({
            where: {
                clinicalReportId
            },
            include: {
                clinicalReport: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                client: {
                    select: {
                        client: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                approver: {
                    select: {
                        fullName: true
                    }
                }
            }
        });
    }

    async findAllUnviewedByApprover(approverId) {
        return await this.model.findMany({
            where: {
                approverId,
                viewed: false
            },
            include: {
                clinicalReport: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                client: {
                    select: {
                        client: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        });
    }

    async markAsViewed(id) {
        return await this.model.update({
            where: { id },
            data: { viewed: true }
        });
    }
}

export default ClinicalReportChangeRequestRepository;
