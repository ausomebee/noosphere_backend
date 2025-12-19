class InformationService {
    constructor({ informationRepository }) {
        this.informationRepository = informationRepository;
    }

    async createInformation(data) {
        const informationExists = await this.informationRepository.findFirstDynamic({
            where: { name: data.name },
            select: { name: true }
        });

        if (informationExists) {
            throw new Error("This information already exists.");
        }

        const newInformation = await this.informationRepository.create(data);

        if (!newInformation) {
            throw new Error("Failed to create Information");
        }

        return newInformation;
    }

    async updateInformation(data) {
        const information = await this.informationRepository.findOne({ id: data.id })

        if (!information) {
            throw new Error("Information not found");
        }

        const update = await this.informationRepository.update(data.id, {
            tenantId: data.tenantId || information.tenantId,
            name: data.name || information.name,
            email: data.email || information.email,
            phoneNumber: data.phoneNumber || information.phoneNumber,
            website: data.website || information.website,
            practiceNPI: data.practiceNPI || information.practiceNPI,
            streetAddress: data.streetAddress || information.streetAddress,
            city: data.city || information.city,
            state: data.state || information.state,
            country: data.country || information.country,
            zipCode: data.zipCode || information.zipCode,
        });

        if (!update) {
            throw new Error("Failed to update Information");
        }

        return update;
    }

    async getInformation(tenantId) {
        const information = await this.informationRepository.findOne({ tenantId });

        if (!information) {
            throw new Error("Information not found")
        }

        return information;
    }

    async checkDomain(domain) {
        const information = await this.informationRepository.findOne({ subDomain: domain });

        if (information) {
            throw new Error("Domain already exists")
        }

        return "valid domain";
    }
    
}

export default InformationService;