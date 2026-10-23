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

    async getAllTenantTargets(tenantId) {
        const targets = await this.targetRepository.findAll({
            program: {
                isDeleted: false,
                isCustom: false,
                domain: {
                    tenantId: tenantId,
                    isDeleted: false
                }
            },
            isDeleted: false
        });

        if (!targets) {
            throw new Error("Targets not found")
        }

        return targets;
    }

    async getAllProgramTargets(programId) {
        const targets = await this.targetRepository.findAll({
            programId,
            isDeleted: false,
            isCustom: false,
        });

        if (!targets) {
            throw new Error("Targets not found")
        }

        return targets;
    }

    async getSingleTarget(id) {
        const target = await this.targetRepository.findOneAndPopulate({ id }, { program: { include: { domain: true } } });

        if (!target) {
            throw new Error("Target not found")
        }

        return target;
    }

    async findTargetWithFirstSessionData(targetId) {
        const target = await this.targetRepository.findTargetWithFirstSessionData( targetId );

        if (!target) {
            throw new Error("Target not found")
        }

        if (!target.baselineDataRequired) {
            throw new Error("Target baseline data not required")
        }

        return target;
    }

    async duplicateTarget(id) {
        const target = await this.targetRepository.findOne({ id });

        if (!target) {
            throw new Error("Target not found")
        }

        const duplicatedTarget = await this.targetRepository.create({
            ...target,
            name: `${target.name} (Copy)`,
            id: undefined,
        });

        if (!duplicatedTarget) {
            throw new Error("Failed to duplicate target");
        }

        return duplicatedTarget;
    }

}

export default TargetService;