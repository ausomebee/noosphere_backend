class ProgramService {
    constructor({ programRepository }) {
        this.programRepository = programRepository;
    }

    async createProgram(data) {
        const newProgram = await this.programRepository.create(data);

        if (!newProgram) {
            throw new Error("Failed to create Program");
        }

        return newProgram;
    }

    async updateProgram(data) {
        const program = await this.programRepository.findOne({ id: data.id })

        if (!program) {
            throw new Error("Program not found");
        }

        const update = await this.programRepository.update(data.id, {
            name: data.name || program.name,
            description: data.description || program.description,
            isDeleted: data.isDeleted ?? program.isDeleted,
        });

        if (!update) {
            throw new Error("Failed to update program");
        }

        return update;
    }

    async getAllDomainPrograms(domainId) {
        const programs = await this.programRepository.findAll({
            domainId,
            isDeleted: false,
            isCustom: false,
        });

        if (!programs) {
            throw new Error("Programs not found")
        }

        return programs;
    }

    async getProgram(id) {
        const programs = await this.programRepository.findOneAndPopulate({
            id: id,
            isDeleted: false,
            isCustom: false,
        }, {
            target: true
        });

        if (!programs) {
            throw new Error("Programs not found")
        }

        return programs;
    }

    async getAllTenantPrograms(tenantId) {
        const programs = await this.programRepository.findAll({
            isDeleted: false,
            isCustom: false,
            domain: {
                tenantId: tenantId,
                isDeleted: false
            }
        });

        if (!programs) {
            throw new Error("Programs not found")
        }

        return programs;
    }
}

export default ProgramService;