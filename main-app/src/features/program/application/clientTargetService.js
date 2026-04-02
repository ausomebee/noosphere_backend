class ClientTargetService {
    constructor({ clientTargetRepository }) {
        this.clientTargetRepository = clientTargetRepository;
    }

    async createClientTarget(data) {
        const clientTargetExists = await this.clientTargetRepository.findFirst({
            AND: [
                { clientId: data.clientId },
                { targetId: data.targetId },
            ]
        });

        if (clientTargetExists) {
            throw new Error("This ClientTarget already exists.");
        }

        const newClientTarget = await this.clientTargetRepository.create(data);

        if (!newClientTarget) {
            throw new Error("Failed to create ClientTarget");
        }

        return newClientTarget;
    }

    async getAllClientTargets(data) {
        const { clientId, targetId } = data;
        const clientTargets = await this.clientTargetRepository.findAllAndPopulate({ clientId, targetId }, {
            target: {
                include: { program: { include: { domain: true } } }
            }
        });

        if (!clientTargets) {
            throw new Error("Client Targets not found")
        }

        return clientTargets;
    }
}

export default ClientTargetService;