import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPasswordError = "Password must be strong. At least one upper case letter, one lower case letter, one digit, one special character, and at least 8 characters long.";

class PlanDto {
    static createBillingPlanDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().required(),
            planType: Joi.string().required(),
            colourCode: Joi.string().required(),
            description: Joi.string().required(),
            pricePerMonth: Joi.object({
                price: Joi.number().positive().required(),
                currency: Joi.string().uppercase().length(3).required()
            }).required(),
            pricePerYear: Joi.object({
                price: Joi.number().positive().required(),
                currency: Joi.string().uppercase().length(3).required()
            }).required(),
            forClient: Joi.number().integer().min(0).required(),
            forStaff: Joi.number().integer().min(0).required(),
            forStorage: Joi.number().min(0).required(),
            extraFeaturesEnabled: Joi.boolean().default(false),
            tenantId: Joi.string().uuid().optional().allow(null),
            adminId: Joi.string().uuid().optional().allow(null),
            features: Joi.object({
                connect: Joi.array().items(
                    Joi.object({
                        id: Joi.string().uuid().required()
                    })
                ).min(1).required()
            }).required(),
            extraFeatures: Joi.object({
                connect: Joi.array().items(
                    Joi.object({
                        id: Joi.string().uuid().required()
                    })
                ).min(1).required()
            }).required(),
            extraFeaturesWithPrice: Joi.array().items(
                Joi.object({
                    id: Joi.string().uuid().required(),
                    pricePerMonth: Joi.object({
                        price: Joi.number().required(),
                        currency: Joi.string().valid('USD').required()
                    }).required(),
                    pricePerYear: Joi.object({
                        price: Joi.number().required(),
                        currency: Joi.string().valid('USD').required()
                    }).required()
                })
            )
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

    static activityDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            active: Joi.boolean().required(),
            administratorPassword: Joi.string()
                .regex(strongPasswordRegex)
                .trim().required()
                .messages({
                    "string.pattern.base": stringPasswordError,
                })
        });

        Validator.validateRequest(req, next, schema);
    };

    static planTypeDto = (req, res, next) => {
        const schema = Joi.object({
            planType: Joi.string().required()
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static deletePlanDto = (req, res, next) => {
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

}

export default PlanDto;