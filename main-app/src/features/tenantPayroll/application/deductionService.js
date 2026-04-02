class DeductionService {
    constructor({ deductionRepository }) {
        this.deductionRepository = deductionRepository;
    }

    async createDeduction(data) {
        const exists = await this.deductionRepository.findFirstDynamic({
            where: { name: data.name, tenantId: data.tenantId },
            select: { name: true }
        });

        if (exists) {
            throw new Error("This Deduction already exists.");
        }

        return await this.deductionRepository.create(data);
    }

    async updateDeduction(data) {
        const deduction = await this.deductionRepository.findOne({ id: data.id });

        if (!deduction) {
            throw new Error("Deduction not found");
        }

        return await this.deductionRepository.update(data.id, {
            ...deduction,
            ...data
        });
    }

    async getSingleDeduction(data) {
        const deduction = await this.deductionRepository.findOne({ id: data.id });

        if (!deduction) {
            throw new Error("Deduction not found");
        }

        return deduction;
    }

    async getTenantDeductions(tenantId) {
        return await this.deductionRepository.findAll({ tenantId });
    }
}

export default DeductionService;
