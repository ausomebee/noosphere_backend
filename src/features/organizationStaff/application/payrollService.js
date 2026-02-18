class PayrollService {
    constructor({ payrollRepository }) {
        this.payrollRepository = payrollRepository;
    }

    async updatePayroll(data) {
        const payroll = await this.payrollRepository.findOne({ id: data.id });

        if (!payroll) {
            throw new Error("Payroll not found");
        }

        const update = await this.payrollRepository.update(data.id, {
            paymentSchedule: data.paymentSchedule || payroll.paymentSchedule,
            ratePerHour: data.ratePerHour || payroll.ratePerHour,
            tenantStaffId: data.tenantStaffId || payroll.tenantStaffId,
            minimumHours: data.minimumHours || payroll.minimumHours,
            incomeItems: {
                set: data.incomeItems || payroll.incomeItems
            },
            deductions: {
                set: data.deductions || payroll.deductions
            },
            isDeleted: data.isDeleted ?? payroll.isDeleted
        });

        if (!update) {
            throw new Error("Failed to update payroll");
        }

        return update;
    }

    async getTenantStaffPayrolls(tenantStaffId) {
        const payrolls = await this.payrollRepository.findAllAndPopulate({ tenantStaffId, isDeleted: false }, { deductions: true, incomeItems: true });

        if (!payrolls) {
            throw new Error("Payrolls not found");
        }

        return payrolls;
    }

    async getPayroll(id) {
        const payroll = await this.payrollRepository.findFirst({ id });

        if (!payroll) {
            throw new Error("Payroll not found");
        }

        return payroll;
    }

}

export default PayrollService;