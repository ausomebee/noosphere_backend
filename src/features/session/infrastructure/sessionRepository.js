import BaseRepository from "./baseRepository.js";
import { Prisma } from "@prisma/client";

class SessionRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma.session);
        this.prisma = prisma;
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

    async countClientSessions(id) {
        return await this.model.count({
            where: {
                appointment: {
                    clientId: id,
                },
            },
        });
    }

    async countTenantSessions(id) {
        return await this.model.count({
            where: {
                appointment: {
                    tenantId: id,
                },
            },
        });
    }

    async countClientAwaitingApproval(id) {
        return await this.model.count({
            where: {
                appointment: {
                    clientId: id,
                },
                clientApprovalStatus: "PENDING"
            },
        });
    }

    async avgSessionDuration(id) {
        return await this.prisma.$queryRaw`
        SELECT 
            AVG(EXTRACT(EPOCH FROM (s."endTime" - s."startTime"))) AS avg_seconds
        FROM "Session" s
        JOIN "Appointment" a ON a.id = s."appointmentId"
        WHERE a."clientId" = ${id}
            AND s."endTime" IS NOT NULL
            AND s."startTime" IS NOT NULL
            AND s."endTime" > s."startTime"
        `;
    }

    async getSessionCounts({ clientId, groupBy = "month" }) {
        if (!["month", "year"].includes(groupBy)) throw new Error("Invalid groupBy value");

        const interval = groupBy === "year" ? "6 years" : "6 months";

        const periodFormat = groupBy === "year" ? "YYYY" : "Mon YYYY";

        const query = `
            SELECT
            TO_CHAR(s."startTime", '${periodFormat}') AS period,
            COUNT(*)::int AS session_count
            FROM "Session" s
            JOIN "Appointment" a
            ON a.id = s."appointmentId"
            WHERE a."clientId" = $1
            AND s."startTime" >= NOW() - INTERVAL '${interval}'
            GROUP BY period
            ORDER BY MIN(s."startTime") ASC;
        `;

        return this.prisma.$queryRawUnsafe(query, clientId);
    }

}

export default SessionRepository;
