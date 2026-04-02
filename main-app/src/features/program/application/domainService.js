class DomainService {
    constructor({ domainRepository }) {
        this.domainRepository = domainRepository;
    }

    async createDomain(data) {
        const domainExists = await this.domainRepository.findFirst({
            AND: [
                { name: data.name },
                { isDeleted: false },
                { tenantId: data.tenantId },
                { domainType: data.domainType }
            ]
        });

        if (domainExists) {
            throw new Error("This Domain already exists.");
        }

        const newDomain = await this.domainRepository.create(data);

        if (!newDomain) {
            throw new Error("Failed to create Domain");
        }

        return newDomain;
    }

    async updateDomain(data) {
        const domain = await this.domainRepository.findOne({ id: data.id })

        if (!domain) {
            throw new Error("Domain not found");
        }

        const update = await this.domainRepository.update(data.id, {
            name: data.name || domain.name,
            description: data.description || domain.description,
            domainType: data.domainType || domain.domainType,
            isDeleted: data.isDeleted ?? domain.isDeleted,
        });

        if (!update) {
            throw new Error("Failed to update domain");
        }

        return update;
    }

    async getAllTenantDomain(tenantId, type) {
        const domain = await this.domainRepository.findAll({
            tenantId,
            isDeleted: false,
            ...(type && { domainType: type })
        });

        if (!domain) {
            throw new Error("Domain not found")
        }

        return domain;
    }

}

export default DomainService;