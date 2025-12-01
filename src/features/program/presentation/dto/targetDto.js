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
        console.log(req.body)
        if (typeof req.body.promptingStrategy === "string") {
            if (
                req.body.promptingStrategy.trim().startsWith("[") ||
                req.body.promptingStrategy.trim().startsWith("{")
            ) {
                try {
                    req.body.promptingStrategy = JSON.parse(req.body.promptingStrategy);
                } catch {
                    // Not valid JSON, fall through
                }
            }
            if (typeof req.body.promptingStrategy === "string") {
                req.body.promptingStrategy = req.body.promptingStrategy
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean);
            }
        } else if (
            req.body.promptingStrategy &&
            !Array.isArray(req.body.promptingStrategy)
        ) {
            req.body.promptingStrategy = [req.body.promptingStrategy];
        }

        ["taskSteps", "masteryCriteria"].forEach((field) => {
            if (
                typeof req.body[field] === "string" &&
                (req.body[field].startsWith("{") || req.body[field].startsWith("["))
            ) {
                try {
                    req.body[field] = JSON.parse(req.body[field]);
                } catch (e) {
                    // Invalid JSON, leave as-is; Joi will catch
                }
            }
        });

        const schema = Joi.object({
            name: Joi.string().trim().min(1).max(255).required(),
            description: Joi.string().trim().min(1).max(5000).required(),
            programId: Joi.string().uuid().optional(),
            sd: Joi.string().trim().min(1).max(255).required(),
            expectedResponse: Joi.string().trim().min(1).max(2000).required(),
            teachingProcedure: Joi.string().trim().min(1).max(5000).required(),
            promptingStrategy: Joi.array().items(Joi.string().trim().min(1).max(255)).required(),
            dataCollectionType: Joi.string().trim().min(1).max(100).required(),
            baselineDataRequired: Joi.boolean().required(),
            numberOfTrials: Joi.number().integer().min(1).max(100000).optional(),
            numberOfTasks: Joi.number().integer().min(1).max(100000).optional(),
            taskSteps: jsonOptional,
            initialStatus: Joi.string().trim().min(1).max(255).required(),
            notes: Joi.string().trim().max(5000).required(),
            masteryMetric: Joi.string().trim().min(1).max(255).required(),
            masteryCriteria: jsonRequired.required(),
            id: Joi.forbidden(),
            createdAt: Joi.forbidden(),
            updatedAt: Joi.forbidden(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static createCustomTargetDto = (req, res, next) => {
        if (typeof req.body.promptingStrategy === "string") {
            if (
                req.body.promptingStrategy.trim().startsWith("[") ||
                req.body.promptingStrategy.trim().startsWith("{")
            ) {
                try {
                    req.body.promptingStrategy = JSON.parse(req.body.promptingStrategy);
                } catch {
                    // Not valid JSON, fall through
                }
            }
            if (typeof req.body.promptingStrategy === "string") {
                req.body.promptingStrategy = req.body.promptingStrategy
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean);
            }
        } else if (
            req.body.promptingStrategy &&
            !Array.isArray(req.body.promptingStrategy)
        ) {
            req.body.promptingStrategy = [req.body.promptingStrategy];
        }

        ["taskSteps", "masteryCriteria"].forEach((field) => {
            if (
                typeof req.body[field] === "string" &&
                (req.body[field].startsWith("{") || req.body[field].startsWith("["))
            ) {
                try {
                    req.body[field] = JSON.parse(req.body[field]);
                } catch (e) {
                    // Invalid JSON, leave as-is; Joi will catch
                }
            }
        });

        const schema = Joi.object({
            name: Joi.string().trim().min(1).max(255).required(),
            description: Joi.string().trim().min(1).max(5000).required(),
            clientId: Joi.string().uuid().required(),
            programId: Joi.string().uuid().optional(),
            sd: Joi.string().trim().min(1).max(255).required(),
            expectedResponse: Joi.string().trim().min(1).max(2000).required(),
            teachingProcedure: Joi.string().trim().min(1).max(5000).required(),
            promptingStrategy: Joi.array().items(Joi.string().trim().min(1).max(255)).required(),
            dataCollectionType: Joi.string().trim().min(1).max(100).required(),
            baselineDataRequired: Joi.boolean().required(),
            numberOfTrials: Joi.number().integer().min(1).max(100000).optional(),
            numberOfTasks: Joi.number().integer().min(1).max(100000).optional(),
            taskSteps: jsonOptional,
            initialStatus: Joi.string().trim().min(1).max(255).required(),
            notes: Joi.string().trim().max(5000).required(),
            masteryMetric: Joi.string().trim().min(1).max(255).required(),
            masteryCriteria: jsonRequired.required(),
            id: Joi.forbidden(),
            createdAt: Joi.forbidden(),
            updatedAt: Joi.forbidden(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateTargetDto = (req, res, next) => {
        if (typeof req.body.promptingStrategy === "string") {
            if (
                req.body.promptingStrategy.trim().startsWith("[") ||
                req.body.promptingStrategy.trim().startsWith("{")
            ) {
                try {
                    req.body.promptingStrategy = JSON.parse(req.body.promptingStrategy);
                } catch {
                    // Not valid JSON, fall through
                }
            }
            if (typeof req.body.promptingStrategy === "string") {
                req.body.promptingStrategy = req.body.promptingStrategy
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean);
            }
        } else if (
            req.body.promptingStrategy &&
            !Array.isArray(req.body.promptingStrategy)
        ) {
            req.body.promptingStrategy = [req.body.promptingStrategy];
        }

        ["taskSteps", "masteryCriteria"].forEach((field) => {
            if (
                typeof req.body[field] === "string" &&
                (req.body[field].startsWith("{") || req.body[field].startsWith("["))
            ) {
                try {
                    req.body[field] = JSON.parse(req.body[field]);
                } catch (e) {
                    // Invalid JSON, leave as-is; Joi will catch
                }
            }
        });

        const schema = Joi.object({
            name: Joi.string().trim().min(1).max(255).optional(),
            description: Joi.string().trim().min(1).max(5000).optional(),
            sd: Joi.string().trim().min(1).max(255).optional(),
            expectedResponse: Joi.string().trim().min(1).max(2000).optional(),
            teachingProcedure: Joi.string().trim().min(1).max(5000).optional(),
            promptingStrategy: Joi.array().items(Joi.string().trim().min(1).max(255)).required(),
            dataCollectionType: Joi.string().trim().min(1).max(100).optional(),
            baselineDataRequired: Joi.boolean().optional(),
            numberOfTrials: Joi.number().integer().min(1).max(100000).optional(),
            numberOfTasks: Joi.number().integer().min(1).max(100000).optional(),
            taskSteps: jsonOptional,
            masteryMetric: Joi.string().trim().min(1).max(255).optional(),
            masteryCriteria: jsonOptional,
            initialStatus: Joi.string().trim().min(1).max(255).optional(),
            notes: Joi.string().trim().max(5000).optional(),
            id: Joi.string().uuid().required(),
            createdAt: Joi.forbidden(),
            updatedAt: Joi.forbidden(),
        });

        Validator.validateRequest(req, next, schema);
    };

}

export default TargetDto;