class PayrollCycleService {
    constructor({ payrollCycleRepository }) {
        this.payrollCycleRepository = payrollCycleRepository;
    }

    async createPayrollCycle(data) {
        const exists = await this.payrollCycleRepository.findFirstDynamic({
            where: { name: data.name, tenantId: data.tenantId },
            select: { name: true }
        });

        if (exists) {
            throw new Error("This Payroll Cycle already exists.");
        }

        return await this.payrollCycleRepository.create(data);
    }

    async updatePayrollCycle(data) {
        const payrollCycle = await this.payrollCycleRepository.findOne({ id: data.id });

        if (!payrollCycle) {
            throw new Error("Payroll Cycle not found");
        }

        return await this.payrollCycleRepository.update(data.id, {
            ...payrollCycle,
            ...data
        });
    }

    async getSinglePayrollCycle(data) {
        const payrollCycle = await this.payrollCycleRepository.findOne({ id: data.id });

        if (!payrollCycle) {
            throw new Error("Payroll Cycle not found");
        }

        return payrollCycle;
    }

    async getTenantPayrollCycles(tenantId) {
        return await this.payrollCycleRepository.findAll({ tenantId });
    }

    async getPayrollCyclesStatsByTenant(tenantId) {
        const cycles = await this.payrollCycleRepository.findPayrollCyclesWithStatsByTenant(tenantId);

        return cycles.map(cycle => {
            const numberOfStaffs = cycle.payrolCycleStaffs.length;

            let totalPayrollValue = 0;

            cycle.payrolCycleStaffs.forEach(staffRecord => {
                const payroll = staffRecord.staff.TenantStaffPayroll[0]; // assuming one payroll per staff
                if (!payroll) return;

                let grossPay = 0;
                payroll.incomeItems.forEach(item => {
                    const rate = item.rate;
                    if (item.type === "Flat Rate") {
                        grossPay += rate.rate || 0;
                    } else if (item.type === "Percentage based") {
                        grossPay += (payroll.ratePerHour ? Number(payroll.ratePerHour) : 0) * (rate.unit || 0) / 100;
                    } else if (item.type === "Time based") {
                        const hours = (rate.unitMinutes || 0) / 60;
                        grossPay += (payroll.ratePerHour ? Number(payroll.ratePerHour) : 0) * hours * (rate.unit || 1);
                    }
                });

                let totalDeductions = 0;
                payroll.deductions.forEach(ded => {
                    const rate = ded.rate;
                    if (ded.type === "Flat Rate") {
                        totalDeductions += rate.rate || 0;
                    } else if (ded.type === "Percentage based") {
                        totalDeductions += grossPay * ((rate.unit || 0) / 100);
                    }
                });

                const netPay = Math.max(0, grossPay - totalDeductions);

                totalPayrollValue += netPay;
            });

            const startDate = new Date(cycle.startDate);
            const payPeriod = new Date(startDate);
            payPeriod.setDate(startDate.getDate() + cycle.interval);

            return {
                payrollDate: cycle.startDate,
                payPeriod: payPeriod.toISOString().split("T")[0],
                numberOfStaffs,
                totalPayrollValue
            };
        });
    }
}

export default PayrollCycleService;
