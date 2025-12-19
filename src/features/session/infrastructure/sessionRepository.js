import BaseRepository from "./baseRepository.js";

class SessionRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            select: populate
        });
    }

    async findOneAndPopulate(id) {
        return await this.model.findUnique({
            where: { id },
            include: {
                appointment: {
                    include: {
                        client: true,
                        clinicians: true,
                        session: true
                    }
                },
                approver: true,
                sessionDatas: true,
                sessionApprovals: true,
                timesheetHistories: { include: { staff: { select: { fullName: true } } } },
                authorizationsUsed: {
                    include: {
                        clientAuthorizationServices: {
                            include: { serviceCode: true }
                        }
                    }
                }
            }
        });
    }

}

export default SessionRepository;
