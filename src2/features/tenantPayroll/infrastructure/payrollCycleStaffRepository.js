import BaseRepository from "./baseRepository.js";

class PayrollCycleStaffRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    async findPayrollCycleStaffWithDetails(payrollCycleId) {
        return await this.model.findMany({
            where: { payrollCycleId },
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
                },
                payrollCycle: true
            }
        });
    }

}

export default PayrollCycleStaffRepository;
