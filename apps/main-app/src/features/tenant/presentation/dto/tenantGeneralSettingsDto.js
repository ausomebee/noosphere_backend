import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class TenantGeneralSettingsDto {
    static createSettingsDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string()
                .uuid()
                .required(),
            dateFormat: Joi.string()
                .min(1)
                .required(),
            timeFormat: Joi.string()
                .min(1)
                .required(),
            currency: Joi.string()
                .min(1)
                .required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateSettingsDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string()
                .uuid()
                .required(), 
            dateFormat: Joi.string()
                .optional(),
            timeFormat: Joi.string()
                .optional(),
            currency: Joi.string()
                .optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default TenantGeneralSettingsDto;
