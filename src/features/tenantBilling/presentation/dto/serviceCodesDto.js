import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ServiceCodesDto {
    static createServiceCodeDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required(),
            code: Joi.string().min(1).required(),
            description: Joi.string().min(1).required(),
            modifiers: Joi.object().required(),
            isDeleted: Joi.boolean().default(false),
            isActive: Joi.boolean().default(true),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateServiceCodeDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            tenantId: Joi.string().uuid().required(),
            code: Joi.string().min(1),
            description: Joi.string().min(1),
            modifiers: Joi.object(),
            isDeleted: Joi.boolean(),
            isActive: Joi.boolean(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ServiceCodesDto;
