class Target {
    constructor({name, id, description, programId, sd, expectedResponse, teachingProcedure, promptingStrategy, dataCollectionType, baselineDataRequired, numberOfTrials, numberOfTasks, taskSteps, masteryMetric, masteryCriteria, initialStatus, notes, attachment}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.programId = programId;
        this.sd = sd;
        this.expectedResponse = expectedResponse;
        this.teachingProcedure = teachingProcedure;
        this.promptingStrategy = promptingStrategy;
        this.dataCollectionType = dataCollectionType;
        this.baselineDataRequired = baselineDataRequired;
        this.numberOfTrials = numberOfTrials;
        this.numberOfTasks = numberOfTasks;
        this.taskSteps = taskSteps;
        this.masteryMetric = masteryMetric;
        this.masteryCriteria = masteryCriteria;
        this.initialStatus = initialStatus;
        this.notes = notes;
        this.attachment = attachment;
    }

    get createTarget() {
        return {
            name: this.name,
            description: this.description,
            programId: this.programId,
            sd: this.sd,
            expectedResponse: this.expectedResponse,
            teachingProcedure: this.teachingProcedure,
            promptingStrategy: this.promptingStrategy,
            dataCollectionType: this.dataCollectionType,
            baselineDataRequired: this.baselineDataRequired,
            numberOfTrials: this.numberOfTrials,
            numberOfTasks: this.numberOfTasks,
            taskSteps: this.taskSteps,
            masteryMetric: this.masteryMetric,
            masteryCriteria: this.masteryCriteria,
            initialStatus: this.initialStatus,
            notes: this.notes,
            attachment: this.attachment,
        };
    }
}

export default Target;