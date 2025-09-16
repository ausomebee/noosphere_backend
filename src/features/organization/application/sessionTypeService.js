class OrganizationSessionTypesService {
    constructor({ organizationSessionTypesRepository }) {
        this.organizationSessionTypesRepository = organizationSessionTypesRepository;
    }

    async createOrganizationSessionType(data) {
        const existingType = await this.organizationSessionTypesRepository.findFirstDynamic({
            where: { name: data.name, tenantId: data.tenantId },
            select: { name: true }
        });

        if (existingType) {
            throw new Error("This session type already exists.");
        }

        const newType = await this.organizationSessionTypesRepository.create(data);

        if (!newType) {
            throw new Error("Failed to create OrganizationSessionType");
        }

        return newType;
    }

    async updateOrganizationSessionType(data) {
        const type = await this.organizationSessionTypesRepository.findOne({ id: data.id });

        if (!type) {
            throw new Error("OrganizationSessionType not found");
        }

        const update = await this.organizationSessionTypesRepository.update(data.id, {
            tenantId: data.tenantId || type.tenantId,
            name: data.name || type.name,
            category: data.category || type.category,
            service: data.service || type.service,
            staffRolesAllowed: data.staffRolesAllowed || type.staffRolesAllowed,
            locationsAllowed: data.locationsAllowed || type.locationsAllowed,
            defaultDuration: data.defaultDuration || type.defaultDuration,
            isActive: data.isActive !== undefined ? data.isActive : type.isActive,
            isBillable: data.isBillable !== undefined ? data.isBillable : type.isBillable,
        });

        if (!update) {
            throw new Error("Failed to update OrganizationSessionType");
        }

        return update;
    }

    async getOrganizationSessionType(id) {
        const type = await this.organizationSessionTypesRepository.findOne({ id });

        if (!type) {
            throw new Error("OrganizationSessionType not found");
        }

        return type;
    }

    async getTenantSessionTypes(tenantId) {
        const sessionTypes = await this.organizationSessionTypesRepository.findAll({ tenantId });

        if (!sessionTypes) {
            throw new Error("Session types not found");
        }

        return sessionTypes;
    }

}

export default OrganizationSessionTypesService;
