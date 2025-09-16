class OrganizationDiagnosisCodesService {
    constructor({ organizationDiagnosisCodesRepository }) {
        this.organizationDiagnosisCodesRepository = organizationDiagnosisCodesRepository;
    }

    async createOrganizationDiagnosisCode(data) {
        const existingCode = await this.organizationDiagnosisCodesRepository.findFirstDynamic({
            where: { code: data.code, tenantId: data.tenantId },
            select: { code: true }
        });

        if (existingCode) {
            throw new Error("This diagnosis code already exists.");
        }

        const newCode = await this.organizationDiagnosisCodesRepository.create(data);

        if (!newCode) {
            throw new Error("Failed to create OrganizationDiagnosisCode");
        }

        return newCode;
    }

    async updateOrganizationDiagnosisCode(data) {
        const code = await this.organizationDiagnosisCodesRepository.findOne({ id: data.id });

        if (!code) {
            throw new Error("OrganizationDiagnosisCode not found");
        }

        const update = await this.organizationDiagnosisCodesRepository.update(data.id, {
            tenantId: data.tenantId || code.tenantId,
            code: data.code || code.code,
            description: data.description || code.description,
            isActive: data.isActive !== undefined ? data.isActive : code.isActive,
        });

        if (!update) {
            throw new Error("Failed to update OrganizationDiagnosisCode");
        }

        return update;
    }

    async getOrganizationDiagnosisCode(id) {
        const code = await this.organizationDiagnosisCodesRepository.findOne({ id });

        if (!code) {
            throw new Error("OrganizationDiagnosisCode not found");
        }

        return code;
    }

    async getTenantDiagnosisCodes(tenantId) {
        const codes = await this.organizationDiagnosisCodesRepository.findAll({ tenantId });

        if (!codes) {
            throw new Error("Diagnosis codes not found");
        }

        return codes;
    }
}

export default OrganizationDiagnosisCodesService;
