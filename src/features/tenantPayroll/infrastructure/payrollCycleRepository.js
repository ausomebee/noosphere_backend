import BaseRepository from "./baseRepository.js";

class PayrollCycleRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    async findPayrollCyclesWithStatsByTenant(tenantId) {
        return await this.model.findMany({
            where: {
                tenantId,
                isDeleted: false,
                isActive: true
            },
            include: {
                payrolCycleStaffs: {
                    include: {
                        staff: {
                            include: {
                                TenantStaffPayroll: {
                                    where: { isDeleted: false },
                                    include: {
                                        incomeItems: {
                                            where: { isDeleted: false, isActive: true }
                                        },
                                        deductions: {
                                            where: { isDeleted: false, isActive: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}

export default PayrollCycleRepository;
