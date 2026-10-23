import BaseRepository from "./baseRepository.js";

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

    async getSessionsBySessionType(tenantId, sessionTypeId) {
        return await this.model.findMany({
            where: {
                appointment: {
                    tenantId: tenantId,
                    sessionId: sessionTypeId,
                },
            },
            include: {
                appointment: true,
            },
        });
    }

    async getSessionsByServiceCode(tenantId, serviceCodeId) {
        return await this.model.findMany({
            where: {
                appointment: {
                    tenantId: tenantId,
                    appointmentServices: {
                        some: {
                            serviceCodeId: serviceCodeId,
                        },
                    },
                },
            },
            include: {
                appointment: {
                    include: {
                        appointmentServices: true,
                    },
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

    async getTenantSessionCounts({ tenantId, groupBy = "month" }) {
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
            WHERE a."tenantId" = $1
            AND s."startTime" >= NOW() - INTERVAL '${interval}'
            GROUP BY period
            ORDER BY MIN(s."startTime") ASC;
        `;

        return this.prisma.$queryRawUnsafe(query, tenantId);
    }

    async getClientSessions(clientId) {
        return await this.model.findMany({
            where: { appointment: { clientId } },
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

    async getTargetPerformanceGraphData(targetId, clientId) {
        // Get all sessions for the client with the specific target data
        const sessions = await this.model.findMany({
            where: {
                appointment: {
                    clientId: clientId
                },
                sessionDatas: {
                    some: {
                        targetId: targetId
                    }
                }
            },
            include: {
                appointment: {
                    select: {
                        date: true
                    }
                },
                sessionDatas: {
                    where: {
                        targetId: targetId
                    }
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        });

        // Initialize 12 months data structure
        const monthsData = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            monthName: new Date(2000, i).toLocaleString('default', { month: 'short' }),
            data: []
        }));

        // Process each session
        sessions.forEach(session => {
            const sessionDate = new Date(session.appointment.date);
            const monthIndex = sessionDate.getMonth(); // 0-11

            session.sessionDatas.forEach(sessionData => {
                const performanceMetric = this.extractPerformanceMetric(sessionData.data);

                if (performanceMetric !== null) {
                    monthsData[monthIndex].data.push({
                        date: session.appointment.date,
                        sessionId: session.id,
                        ...performanceMetric
                    });
                }
            });
        });

        // Calculate monthly aggregates
        const graphData = monthsData.map(month => {
            const aggregate = this.calculateMonthlyAggregate(month.data);

            return {
                month: month.month,
                monthName: month.monthName,
                sessionCount: month.data.length,
                ...aggregate,
                rawData: month.data
            };
        });

        return graphData;
    }

    // Helper method to extract performance metrics based on data type
    extractPerformanceMetric(data) {
        // Check for different data collection types

        // 1. Discrete Trial with percentage correct
        if (data.percentageCorrect !== undefined) {
            return {
                type: 'percentage',
                value: data.percentageCorrect,
                trials: data.trials?.length || 0
            };
        }

        // 2. Discrete Trial with correct/incorrect trials
        if (data.trials && Array.isArray(data.trials)) {
            const hasPerformance = data.trials.some(t => t.performance);

            if (hasPerformance) {
                const correctCount = data.trials.filter(t =>
                    t.performance === 'correct'
                ).length;
                const totalTrials = data.trials.length;

                return {
                    type: 'percentage',
                    value: totalTrials > 0 ? (correctCount / totalTrials) * 100 : 0,
                    trials: totalTrials,
                    correct: correctCount,
                    incorrect: totalTrials - correctCount
                };
            }

            // Latency data
            if (data.trials[0]?.latency !== undefined) {
                const latencies = data.trials.map(t => t.latency);
                const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;

                return {
                    type: 'latency',
                    value: avgLatency,
                    trials: latencies.length,
                    min: Math.min(...latencies),
                    max: Math.max(...latencies),
                    allLatencies: latencies
                };
            }
        }

        // 3. Task Analysis with steps
        if (data.steps && Array.isArray(data.steps)) {
            const completedSteps = data.steps.filter(s =>
                s.performance === 'FPP' || s.performance === 'I'
            ).length;
            const totalSteps = data.steps.length;

            return {
                type: 'task_analysis',
                value: totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0,
                steps: totalSteps,
                completed: completedSteps
            };
        }

        // 4. Frequency/Rate data
        if (data.numberOfOccurrence !== undefined) {
            const value = data.duration
                ? (data.numberOfOccurrence / data.duration) * 60 // Rate per minute
                : data.numberOfOccurrence; // Raw frequency

            return {
                type: data.duration ? 'rate' : 'frequency',
                value: value,
                occurrences: data.numberOfOccurrence,
                duration: data.duration || null
            };
        }

        // 5. Duration only
        if (data.duration !== undefined && data.numberOfOccurrence === undefined) {
            return {
                type: 'duration',
                value: data.duration,
                unit: 'seconds'
            };
        }

        return null;
    }

    // Helper method to calculate monthly aggregates
    calculateMonthlyAggregate(monthData) {
        if (monthData.length === 0) {
            return {
                average: null,
                min: null,
                max: null,
                trend: null
            };
        }

        const values = monthData.map(d => d.value);
        const average = values.reduce((a, b) => a + b, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);

        // Calculate trend (positive if improving, negative if declining)
        let trend = null;
        if (values.length > 1) {
            const firstHalf = values.slice(0, Math.ceil(values.length / 2));
            const secondHalf = values.slice(Math.ceil(values.length / 2));
            const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
            trend = secondAvg - firstAvg;
        }

        // Get the most common data type
        const dataType = monthData[0].type;

        return {
            average: Math.round(average * 100) / 100,
            min: Math.round(min * 100) / 100,
            max: Math.round(max * 100) / 100,
            trend: trend !== null ? Math.round(trend * 100) / 100 : null,
            dataType: dataType
        };
    }

    // Optional: Get data for a specific year
    async getTargetPerformanceGraphDataByYear(targetId, clientId, year = new Date().getFullYear()) {
        const sessions = await this.model.findMany({
            where: {
                appointment: {
                    clientId: clientId,
                    date: {
                        gte: `${year}-01-01`,
                        lte: `${year}-12-31`
                    }
                },
                sessionDatas: {
                    some: {
                        targetId: targetId
                    }
                }
            },
            include: {
                appointment: {
                    select: {
                        date: true
                    }
                },
                sessionDatas: {
                    where: {
                        targetId: targetId
                    }
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        });

        // Same processing logic as above...
        // (You can extract the processing logic into a separate method)

        return this.processSessionsIntoMonthlyData(sessions);
    }
}

export default SessionRepository;
