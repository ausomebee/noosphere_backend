import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPasswordError = "Password must be strong. At least one upper case letter, one lower case letter, one digit, one special character, and at least 8 characters long.";

class FeatureDto {
    static createFeatureDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().required(),
            description: Joi.string().trim().required(),
            featureGroupId: Joi.string().trim().required(),
            managedBy: Joi.string().trim().required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateFeatureDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            name: Joi.string().trim().optional(),
            description: Joi.string().trim().optional(),
            managedBy: Joi.string().trim().optional(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static assignFeatureToPlanDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            applicablePlans: Joi.array().items(Joi.string().trim()).required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateActivityDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
            active: Joi.boolean().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static createFeatureGroupDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static moveFeatureDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            featureGroupId: Joi.string().uuid().required().messages({
                "string.empty": "feature group ID is required",
                "string.guid": "feature group ID must be a valid UUID"
            })
        });

        Validator.validateRequest(req, next, schema);
    };
    
    static updateFeatureGroupDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            name: Joi.string().trim().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static deleteFeatureGroupDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            administratorPassword: Joi.string()
                .regex(strongPasswordRegex)
                .trim().required()
                .messages({
                    "string.pattern.base": stringPasswordError,
                })
        });

        Validator.validateRequest(req, next, schema);
    };

    static checkIdDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            })
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

}

export default FeatureDto;