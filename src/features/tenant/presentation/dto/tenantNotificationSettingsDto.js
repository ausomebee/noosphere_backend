import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class TenantNotificationSettingsDto {
    static createNotificationSettingsDto = (req, res, next) => {
        const schema = Joi.object({
            userId: Joi.string()
                .uuid()
                .required(),
            settings: Joi.array().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateNotificationSettingsDto = (req, res, next) => {
        const schema = Joi.object({
            settings: Joi.array()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default TenantNotificationSettingsDto;