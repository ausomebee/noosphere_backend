class ClientProgramService {
    constructor({ clientProgramRepository, targetRepository, clientTargetRepository }) {
        this.clientProgramRepository = clientProgramRepository;
        this.targetRepository = targetRepository;
        this.clientTargetRepository = clientTargetRepository;
    }

    async createClientProgram(data) {
        const clientProgramExists = await this.clientProgramRepository.findFirst({
            AND: [
                { clientId: data.clientId },
                { programId: data.programId },
            ]
        });

        if (clientProgramExists) {
            throw new Error("This ClientProgram already exists.");
        }

        const newClientProgram = await this.clientProgramRepository.create(data);

        if (!newClientProgram) {
            throw new Error("Failed to create ClientProgram");
        }

        const targets = await this.targetRepository.findAll({
            programId: data.programId,
            isDeleted: false
        });

        if (targets.length > 0) {
            for (const t of targets) {
                const clientTargetExists = await this.clientTargetRepository.findFirst({
                    AND: [
                        { clientId: data.clientId },
                        { targetId: t.id },
                    ]
                });

                if (clientTargetExists) continue;

                const newClientTarget = await this.clientTargetRepository.create({
                    clientId: data.clientId,
                    targetId: t.id,
                });

                if (!newClientTarget) {
                    throw new Error("Failed to create ClientTarget");
                }
            }
        }

        return newClientProgram;
    }

    async getAllClientProgram(clientId) {
        const program = await this.clientProgramRepository.findAllAndPopulate({
            clientId,
        }, { program: true });

        if (!program) {
            throw new Error("program not found")
        }

        return program;
    }

}

export default ClientProgramService;