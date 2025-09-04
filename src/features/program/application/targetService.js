class TargetService {
    constructor({ targetRepository }) {
        this.targetRepository = targetRepository;
    }

    async createTarget(data) {
        const targetExists = await this.targetRepository.findFirst({
            AND: [
                { name: data.name },
                { isDeleted: false },
                { programId: data.programId }
            ]
        });

        if (targetExists) {
            throw new Error("This Target already exists.");
        }

        const newTarget = await this.targetRepository.create(data);

        if (!newTarget) {
            throw new Error("Failed to create Target");
        }

        return newTarget;
    }

    async updateTarget(data) {
        const target = await this.targetRepository.findOne({ id: data.id })

        if (!target) {
            throw new Error("Target not found");
        }

        const update = await this.targetRepository.update(data.id, {
            name: data.name || target.name,
            description: data.description || target.description,
            programId: data.programId || target.programId,
            sd: data.sd || target.sd,
            expectedResponse: data.expectedResponse || target.expectedResponse,
            teachingProcedure: data.teachingProcedure || target.teachingProcedure,
            promptingStrategy: data.promptingStrategy || target.promptingStrategy,
            dataCollectionType: data.dataCollectionType || target.dataCollectionType,
            baselineDataRequired: data.baselineDataRequired ?? target.baselineDataRequired,
            numberOfTrials: data.numberOfTrials ?? target.numberOfTrials,
            numberOfTasks: data.numberOfTasks ?? target.numberOfTasks,
            taskSteps: data.taskSteps || target.taskSteps,
            masteryMetric: data.masteryMetric || target.masteryMetric,
            masteryCriteria: data.masteryCriteria || target.masteryCriteria,
            isDeleted: data.isDeleted ?? target.isDeleted,
        });

        if (!update) {
            throw new Error("Failed to update target");
        }

        return update;
    }

    async getAllProgramTargets(programId) {
        const targets = await this.targetRepository.findAll({
            programId
        });

        if (!targets) {
            throw new Error("Targets not found")
        }

        return targets;
    }

}

export default TargetService;