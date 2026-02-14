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
                status: status,
                isDeleted: false
            },
            include: {
                creator: { select: { fullName: true } },
                client: { select: { client: { select: { firstName: true, lastName: true } } } },
                approver: { select: { fullName: true } },
                clinicalReportChangeRequests: true
            }
        });
    }

    async findAllByStatusForClient(clientTenantId, status) {
        return await this.model.findMany({
            where: {
                clientTenantId: clientTenantId,
                status: status,
                isDeleted: false
            },
            include: {
                creator: { select: { fullName: true } },
                client: { select: { client: { select: { firstName: true, lastName: true } } } },
                approver: { select: { fullName: true } },
                clinicalReportChangeRequests: true
            }
        });
    }

    async findAllByApproverAndStatus(approverId) {
        return await this.model.findMany({
            where: {
                approverId: approverId,
                status: "SUBMITTED",
                isDeleted: false
            },
            include: {
                creator: { select: { fullName: true } },
                client: { select: { client: { select: { firstName: true, lastName: true } } } },
                approver: { select: { fullName: true } },
                clinicalReportChangeRequests: true
            }
        });
    }
}

export default ClinicalReportRepository;