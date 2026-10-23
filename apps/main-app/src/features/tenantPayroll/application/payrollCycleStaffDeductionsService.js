class PayrollCycleStaffDeductionsService {
    constructor({ payrollCycleStaffDeductionsRepository }) {
        this.payrollCycleStaffDeductionsRepository =
            payrollCycleStaffDeductionsRepository;
    }

    async createPayrollCycleStaffDeduction(data) {
        const exists =
            await this.payrollCycleStaffDeductionsRepository.findFirstDynamic({
                where: {
                    name: data.name,
                    payrollCycleStaffId: data.payrollCycleStaffId
                },
                select: { name: true }
            });

        if (exists) {
            throw new Error("This Deduction already exists for this staff.");
        }

        return await this.payrollCycleStaffDeductionsRepository.create(data);
    }

    async updatePayrollCycleStaffDeduction(data) {
        const deduction =
            await this.payrollCycleStaffDeductionsRepository.findOne({
                id: data.id
            });

        if (!deduction) {
            throw new Error("Deduction not found");
        }

        return await this.payrollCycleStaffDeductionsRepository.update(
            data.id,
            {
                ...deduction,
                ...data
            }
        );
    }

    async getSinglePayrollCycleStaffDeduction(data) {
        const deduction =
            await this.payrollCycleStaffDeductionsRepository.findOne({
                id: data.id
            });

        if (!deduction) {
            throw new Error("Deduction not found");
        }

        return deduction;
    }

    async getStaffDeductions(payrollCycleStaffId) {
        return await this.payrollCycleStaffDeductionsRepository.findAll({
            payrollCycleStaffId
        });
    }

    async createManyPayrollCycleStaffDeductions(dataArray) {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            throw new Error("No deductions provided");
        }

        const { tenantId, payrollCycleStaffId } = dataArray[0];

        const existingDeductions =
            await this.payrollCycleStaffDeductionsRepository.findAll({
                tenantId,
                payrollCycleStaffId
            });

        const existingNames = new Set(
            existingDeductions.map(d => d.name.toLowerCase())
        );

        const newDeductions = dataArray.filter(
            item => !existingNames.has(item.name.toLowerCase())
        );

        if (newDeductions.length === 0) {
            throw new Error("All deductions already exist for this staff.");
        }

        return await this.payrollCycleStaffDeductionsRepository.insertMany(
            newDeductions
        );
    }

}

export default PayrollCycleStaffDeductionsService;
