class PayrollRecordService {
    constructor({ payrollRecordRepository }) {
        this.payrollRecordRepository = payrollRecordRepository;
    }

    async createPayrollRecord(data) {
        const exists = await this.payrollRecordRepository.findFirstDynamic({
            where: {
                payrollCycleId: data.payrollCycleId,
                from: data.from,
                to: data.to
            },
            select: { id: true }
        });

        if (exists) {
            throw new Error("A Payroll Record for this period already exists.");
        }

        return await this.payrollRecordRepository.create(data);
    }

    async updatePayrollRecord(data) {
        const payrollRecord = await this.payrollRecordRepository.findOne({ id: data.id });

        if (!payrollRecord) {
            throw new Error("Payroll Record not found");
        }

        return await this.payrollRecordRepository.update(data.id, {
            ...payrollRecord,
            ...data
        });
    }

    async getSinglePayrollRecord(data) {
        const payrollRecord = await this.payrollRecordRepository.findOne({ id: data.id });

        if (!payrollRecord) {
            throw new Error("Payroll Record not found");
        }

        return payrollRecord;
    }

    async getPayrollRecordsByCycle(payrollCycleId) {
        return await this.payrollRecordRepository.findAll({ payrollCycleId });
    }

    async getTenantPayrollRecords(tenantId) {
        return await this.payrollRecordRepository.findAllAndPopulate({
            payrollCycle: {
                tenantId: tenantId
            },
        }, { payrollCycle: true });
    }
}

export default PayrollRecordService;
