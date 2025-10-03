class ServiceCodesService {
    constructor({ serviceCodesRepository }) {
        this.serviceCodesRepository = serviceCodesRepository;
    }

    async createServiceCode(data) {
        const codeExists = await this.serviceCodesRepository.findFirstDynamic({
            where: { code: data.code, tenantId: data.tenantId },
            select: { code: true }
        });

        if (codeExists) {
            throw new Error("This Service Code already exists.");
        }

        const newServiceCode = await this.serviceCodesRepository.create(data);

        if (!newServiceCode) {
            throw new Error("Failed to create Service Code");
        }

        return newServiceCode;
    }

    async updateServiceCode(data) {
        const serviceCode = await this.serviceCodesRepository.findOne({ id: data.id });

        if (!serviceCode) {
            throw new Error("Service Code not found");
        }

        return await this.serviceCodesRepository.update(data.id, {
            ...serviceCode,
            ...data
        });
    }

    async getSingleServiceCode(data) {
        const serviceCode = await this.serviceCodesRepository.findOne({ id: data.id });

        if (!serviceCode) {
            throw new Error("Service Code not found");
        }

        return serviceCode;
    }

    async getTenantServiceCodes(tenantId) {
        return await this.serviceCodesRepository.findAll({ tenantId });
    }
}

export default ServiceCodesService;
