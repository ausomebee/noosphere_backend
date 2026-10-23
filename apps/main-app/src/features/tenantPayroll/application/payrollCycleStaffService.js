class PayrollCycleStaffService {
    constructor({ payrollCycleStaffRepository }) {
        this.payrollCycleStaffRepository = payrollCycleStaffRepository;
    }

    async createPayrollCycleStaff(data) {
        const exists =
            await this.payrollCycleStaffRepository.findFirstDynamic({
                where: {
                    payrollCycleId: data.payrollCycleId,
                    staffId: data.staffId
                },
                select: { id: true }
            });

        if (exists) {
            throw new Error(
                "This staff is already assigned to this payroll cycle."
            );
        }

        return await this.payrollCycleStaffRepository.create(data);
    }

    async updatePayrollCycleStaff(data) {
        const record =
            await this.payrollCycleStaffRepository.findOne({
                id: data.id
            });

        if (!record) {
            throw new Error("Payroll cycle staff record not found");
        }

        return await this.payrollCycleStaffRepository.update(
            data.id,
            {
                ...record,
                ...data
            }
        );
    }

    async getSinglePayrollCycleStaff(data) {
        const record =
            await this.payrollCycleStaffRepository.findOne({
                id: data.id
            });

        if (!record) {
            throw new Error("Payroll cycle staff record not found");
        }

        return record;
    }

    async getPayrollCycleStaffs(payrollCycleId) {
        const records = await this.payrollCycleStaffRepository.findPayrollCycleStaffWithDetails(payrollCycleId);

        return records.map(record => {
            const staff = record.staff;
            const payrolls = staff.TenantStaffPayroll;

            const payroll = payrolls[0];

            let grossPay = 0;
            if (payroll) {
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

                const netPay = grossPay - totalDeductions;

                return {
                    staffName: staff.fullName,
                    grossPay,
                    netPay,
                    paymentSchedule: payroll.paymentSchedule,
                    record
                };
            }

            return {
                staffName: staff.fullName,
                grossPay: 0,
                netPay: 0,
                paymentSchedule: "N/A",
                record
            };
        });
    }

    async deletePayrollCycleStaff(data) {
        const record = await this.getSinglePayrollCycleStaff({ id: data.id });

        if (!record) {
            throw new Error("Payroll cycle staff record not found");
        }

        return await this.payrollCycleStaffRepository.delete(data.id);
    }

}

export default PayrollCycleStaffService;
