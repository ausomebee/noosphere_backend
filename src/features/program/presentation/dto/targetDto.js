import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

const jsonRequired = Joi.alternatives().try(
  Joi.object().unknown(true),
  Joi.array().items(Joi.any())
);

const jsonOptional = Joi.alternatives()
  .try(Joi.valid(null), Joi.object().unknown(true), Joi.array().items(Joi.any()))
  .allow(null);

class TargetDto {
    static createTargetDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().min(1).max(255).required(),
            description: Joi.string().trim().min(1).max(5000).required(),
            programId: Joi.string().uuid().required(),
            sd: Joi.string().trim().min(1).max(255).required(),
            expectedResponse: Joi.string().trim().min(1).max(2000).required(),
            teachingProcedure: Joi.string().trim().min(1).max(5000).required(),
            promptingStrategy: Joi.string().trim().min(1).max(2000).required(),
            dataCollectionType: Joi.string().trim().min(1).max(100).required(),
            baselineDataRequired: Joi.boolean().required(),
            numberOfTrials: Joi.number().integer().min(1).max(100000).optional(),
            numberOfTasks: Joi.number().integer().min(1).max(100000).optional(),
            taskSteps: jsonOptional,   
            masteryMetric: Joi.string().trim().min(1).max(255).required(),
            masteryCriteria: jsonRequired.required(),
            id: Joi.string().uuid().required(),
            createdAt: Joi.forbidden(),
            updatedAt: Joi.forbidden(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateTargetDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().min(1).max(255).optional(),
            description: Joi.string().trim().min(1).max(5000).optional(),
            programId: Joi.string().uuid().optional(),
            sd: Joi.string().trim().min(1).max(255).optional(),
            expectedResponse: Joi.string().trim().min(1).max(2000).optional(),
            teachingProcedure: Joi.string().trim().min(1).max(5000).optional(),
            promptingStrategy: Joi.string().trim().min(1).max(2000).optional(),
            dataCollectionType: Joi.string().trim().min(1).max(100).optional(),
            baselineDataRequired: Joi.boolean().optional(),
            numberOfTrials: Joi.number().integer().min(1).max(100000).optional(),
            numberOfTasks: Joi.number().integer().min(1).max(100000).optional(),
            taskSteps: jsonOptional,
            masteryMetric: Joi.string().trim().min(1).max(255).optional(),
            masteryCriteria: jsonRequired.optional(),
            id: Joi.string().uuid().required(),
            createdAt: Joi.forbidden(),
            updatedAt: Joi.forbidden(),
        });

        Validator.validateRequest(req, next, schema);
    };

}

export default TargetDto;