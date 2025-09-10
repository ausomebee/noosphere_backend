class ClientProgramService {
    constructor({ clientProgramRepository }) {
        this.clientProgramRepository = clientProgramRepository;
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

        return newClientProgram;
    }

}

export default ClientProgramService;