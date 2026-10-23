class InsuranceTypeService {
    constructor({ insuranceTypeRepository }) {
        this.insuranceTypeRepository = insuranceTypeRepository;
    }

    async createInsuranceType(data) {
        const exists = await this.insuranceTypeRepository.findFirstDynamic({
            where: { name: data.name, tenantId: data.tenantId },
            select: { name: true }
        });

        if (exists) {
            throw new Error("This Insurance Type already exists.");
        }

        return await this.insuranceTypeRepository.create(data);
    }

    async updateInsuranceType(data) {
        const insuranceType = await this.insuranceTypeRepository.findOne({ id: data.id });

        if (!insuranceType) {
            throw new Error("Insurance Type not found");
        }

        return await this.insuranceTypeRepository.update(data.id, {
            ...insuranceType,
            ...data
        });
    }

    async getSingleInsuranceType(data) {
        const insuranceType = await this.insuranceTypeRepository.findOne({ id: data.id });

        if (!insuranceType) {
            throw new Error("Insurance Type not found");
        }

        return insuranceType;
    }

    async getTenantInsuranceTypes(tenantId) {
        return await this.insuranceTypeRepository.findAll({ tenantId });
    }
}

export default InsuranceTypeService;
