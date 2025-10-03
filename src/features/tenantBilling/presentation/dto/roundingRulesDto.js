import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class RoundingRulesDto {
    static createRoundingRuleDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required(),
            ruleType: Joi.string().min(1).required(),
            ruleName: Joi.string().min(1).required(),
            description: Joi.string().min(1).required(),
            standardUnit: Joi.number().integer().required(),
            roundingRule: Joi.object().required(),
            isDeleted: Joi.boolean().default(false),
            isActive: Joi.boolean().default(true),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateRoundingRuleDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            tenantId: Joi.string().uuid().required(),
            ruleType: Joi.string().min(1),
            ruleName: Joi.string().min(1),
            description: Joi.string().min(1),
            standardUnit: Joi.number().integer(),
            roundingRule: Joi.object(),
            isDeleted: Joi.boolean(),
            isActive: Joi.boolean(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default RoundingRulesDto;
