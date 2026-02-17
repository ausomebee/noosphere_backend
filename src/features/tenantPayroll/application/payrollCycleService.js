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
}

export default PayrollCycleService;
