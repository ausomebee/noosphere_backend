class CompensationTypeService {
    constructor({ compensationTypeRepository }) {
        this.compensationTypeRepository = compensationTypeRepository;
    }

    async createCompensationType(data) {
        const exists = await this.compensationTypeRepository.findFirstDynamic({
            where: { name: data.name, tenantId: data.tenantId },
            select: { name: true }
        });

        if (exists) {
            throw new Error("This Compensation Type already exists.");
        }

        return await this.compensationTypeRepository.create(data);
    }

    async updateCompensationType(data) {
        const compensationType = await this.compensationTypeRepository.findOne({ id: data.id });

        if (!compensationType) {
            throw new Error("Compensation Type not found");
        }

        return await this.compensationTypeRepository.update(data.id, {
            ...compensationType,
            ...data
        });
    }

    async getSingleCompensationType(data) {
        const compensationType = await this.compensationTypeRepository.findOne({ id: data.id });

        if (!compensationType) {
            throw new Error("Compensation Type not found");
        }

        return compensationType;
    }

    async getTenantCompensationTypes(tenantId) {
        return await this.compensationTypeRepository.findAll({ tenantId });
    }
}

export default CompensationTypeService;
