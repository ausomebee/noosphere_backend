import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class DomainDto {
    static createDomainDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().min(1).max(255).required(),
            description: Joi.string().trim().min(1).max(5000).required(),
            tenantId: Joi.string().uuid().required(),
            domainType: Joi.string()
                .valid('SKILL_ACQUISITION', 'BEHAVIOR_REDUCTION')
                .required(),
            id: Joi.forbidden(),
            createdAt: Joi.forbidden(),
            updatedAt: Joi.forbidden(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateDomainDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().min(1).max(255).optional(),
            description: Joi.string().trim().min(1).max(5000).optional(),
            domainType: Joi.string()
                .valid('SKILL_ACQUISITION', 'BEHAVIOR_REDUCTION')
                .optional(),
            id: Joi.string().uuid().optional(),
            createdAt: Joi.forbidden(),
            updatedAt: Joi.forbidden(),
        });

        Validator.validateRequest(req, next, schema);
    };

}

export default DomainDto;