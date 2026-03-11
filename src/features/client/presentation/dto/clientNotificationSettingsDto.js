import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClientNotificationSettingsDto {
    static createNotificationSettingsDto = (req, res, next) => {
        const schema = Joi.object({
            tenantClientId: Joi.string()
                .uuid()
                .required(),
            reschedule: Joi.boolean().required(),
            starts: Joi.boolean().required(),
            completed: Joi.boolean().required(),
            awaitingReview: Joi.boolean().required(),
            approvedReschedule: Joi.boolean().required(),
        });

        Validator.validateRequest(req, next, schema);
    };

}

export default ClientNotificationSettingsDto;
