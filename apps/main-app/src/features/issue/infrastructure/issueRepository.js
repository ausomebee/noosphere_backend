import BaseRepository from "./baseRepository.js";

class IssueRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async findOneAndPopulate(query) {
        return await this.model.findUnique({
            where: query,
            include: {
                assignedTo: {
                    select: {
                        firstName: true, lastName: true
                    }
                },
                tenant: {
                    select: {
                        companyName: true
                    }
                },
                loggedBy: {
                    select: {
                        firstName: true, lastName: true
                    }
                },
                comments: {
                    include: {
                        commentBy: {
                            select: { firstName: true, lastName: true }
                        }
                    }
                },
                Logs: {
                    include: {
                        admin: {
                            select: { firstName: true, lastName: true }
                        }
                    }
                },
            }
        });
    }

    async findAllAndPopulate(query) {
        return await this.model.findMany({
            where: query,
            include: {
                assignedTo: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                tenant: {
                    select: {
                        companyName: true
                    }
                },
                loggedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                comments: {
                    include: {
                        commentBy: {
                            select: {
                                firstName: true,
                                lastName: true,
                            }
                        }
                    }
                },
                Logs: {
                    include: {
                        admin: {
                            select: {
                                firstName: true,
                                lastName: true,
                            }
                        }
                    }
                },
            }
        });
    }

    async totalCountDynamic(query) {
        return await this.model.aggregate({
            where: query,
            _count: {
                _all: true,
            },
        });
    }

    async countIssuesByCategory(query = {}) {
        return await this.model.groupBy({
            by: ['category'],
            where: query,
            _count: {
                category: true
            }
        });
    }

    async averageResolutionTime() {
        return await this.model.findMany({
            where: { status: "Resolved" },
            select: {
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async tenantAverageResolutionTime(tenantId) {
        return await this.model.findMany({
            where: { status: "Resolved", tenantId: tenantId },
            select: {
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async totalCount(where = {}) {
        return await this.model.count({ where });
    }

    async groupedCounts(by, count, where = {}) {
        return await this.model.groupBy({
            by: [by],
            where,
            _count: count,
        });
    }

    async tenants(adminIds) {
        return await this.model.findMany({
            where: {
                adminId: { in: adminIds },
            },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }

}

export default IssueRepository;
