import BaseRepository from "./baseRepository.js";

class StaffRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async txCreate(data, tx) {
        return await tx.tenantStaff.create({ data });
    }

    async staffExistsWithRole(email) {
        return await this.model.findFirst({
            where: {
                email,
                isDeleted: false,
                tenant: {
                    isDeleted: false,
                },
            },
            include: {
                role: {
                    select: {
                        name: true,
                        roleModuleAccesses: true
                    }
                }
            }
        });
    }

    async getStaffsWithTeamAccess(tenantId) {
        return await this.model.findMany({
            where: {
                tenantId,
                role: {
                    dataAccessLevel: {
                        in: ['TEAM', 'GLOBAL'],
                    },
                },
                isDeleted: false,
            },
            include: {
                role: {
                    select: {
                        name: true,
                        dataAccessLevel: true,
                    },
                },
            },
        });
    }

    async updateAll(tenantId, data) {
        return await this.model.updateMany({
            where: { tenantId },
            data: { ...data },
        });
    }

    async totalStaff(tenantId) {
        return await this.model.count({
            where: { tenantId, isDeleted: false }
        });
    }

    async countAllStaffs() {
        return await this.model.count({
            where: { isDeleted: false }
        });
    }

    async countStaffsOfPaidTenants() {
        return await this.model.count({
            where: {
                isDeleted: false,
                tenant: {
                    Subscription: {
                        some: { status: 'ACTIVE' }
                    }
                }
            }
        });
    }

    async cliniciansPerClient(tenantId) {
        return await this.model.findMany({
            where: {
                tenantId,
                isDeleted: false,
            },
            select: {
                id: true,
                fullName: true,
                _count: {
                    select: {
                        ClientTenant: true,
                    },
                },
            },
        });
    }

    async availableStaff(tenantId) {
        const now = new Date();
        const jsDay = now.toLocaleString("en-US", { weekday: "long" });

        const dayMap = {
            Monday: "MONDAY",
            Tuesday: "TUESDAY",
            Wednesday: "WEDNESDAY",
            Thursday: "THURSDAY",
            Friday: "FRIDAY",
            Saturday: "SATURDAY",
            Sunday: "SUNDAY",
        };

        const currentDay = dayMap[jsDay];
        const currentTime = now.toTimeString().slice(0, 5);

        return await this.model.count({
            where: {
                tenantId,
                isDeleted: false,
                staffAvailabilities: {
                    some: {
                        availabilityDays: {
                            some: {
                                dayOfWeek: currentDay,
                                available: true,
                                from: { lte: currentTime },
                                to: { gte: currentTime }
                            }
                        }
                    }
                }
            }
        });
    }

    async findAvailableByTenantAndTimeRange(tenantId, dayOfWeek, startTime, endTime) {
        return await this.model.findMany({
            where: {
                tenantId,
                staffAvailabilities: {
                    some: {
                        availabilityDays: {
                            some: {
                                dayOfWeek,
                                available: true,
                                from: { lte: startTime },
                                to: { gte: endTime }
                            }
                        }
                    }
                }
            }
        });
    }

    async getStaffByPaymentSchedule(tenantId, paymentSchedule) {
        return await this.model.findMany({
            where: {
                tenantId,
                isDeleted: false,
                active: true,
                TenantStaffPayroll: {
                    some: {
                        paymentSchedule,
                        isDeleted: false
                    }
                }
            },
            include: {
                TenantStaffPayroll: {
                    where: {
                        paymentSchedule,
                        isDeleted: false
                    },
                    include: {
                        deductions: true,
                        incomeItems: true
                    }
                }
            }
        });
    }

    async findStaffWithPayrollByTenant(tenantId) {
        return await this.model.findMany({
            where: {
                tenantId,
                isDeleted: false
            },
            include: {
                TenantStaffPayroll: {
                    where: { isDeleted: false },
                    include: {
                        incomeItems: {
                            where: {
                                isDeleted: false,
                                isActive: true
                            }
                        },
                        deductions: {
                            where: {
                                isDeleted: false,
                                isActive: true
                            }
                        }
                    }
                }
            }
        });
    }

    async findStaffWithPayrollByTenantAndDateRange(tenantId, startDate, endDate, paymentSchedule) {
        return await this.model.findMany({
            where: {
                tenantId,
                isDeleted: false,
                TenantStaffPayroll: {
                    some: {
                        paymentSchedule,
                        isDeleted: false
                    }
                },
                appointments: {
                    some: {
                        sessions: {
                            some: {
                                startTime: {
                                    gte: new Date(startDate),
                                    lte: new Date(endDate)
                                }
                            }
                        }
                    }
                }
            },
            include: {
                TenantStaffPayroll: {
                    where: { isDeleted: false },
                    include: {
                        incomeItems: {
                            where: {
                                isDeleted: false,
                                isActive: true
                            }
                        },
                        deductions: {
                            where: {
                                isDeleted: false,
                                isActive: true
                            }
                        }
                    }
                }
            }
        });
    }

}

export default StaffRepository;
