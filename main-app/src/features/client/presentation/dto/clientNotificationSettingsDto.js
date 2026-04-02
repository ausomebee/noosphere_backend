import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClientNotificationSettingsDto {
    static createNotificationSettingsDto = (req, res, next) => {
        const schema = Joi.object({
            tenantClientId: Joi.string()
                .uuid()
                .required(),
            appointmentScheduled: Joi.boolean().required(),
            appointmentRescheduled: Joi.boolean().required(),
            appointmentAboutToStart: Joi.boolean().required(),
            appointmentStarted: Joi.boolean().required(),
            appointmentCancelled: Joi.boolean().required(),
            appointmentCompletedAwaitingFeedback: Joi.boolean().required(),
            documentRequested: Joi.boolean().required(),
            formShared: Joi.boolean().required(),
            authorizationAboutToExpire: Joi.boolean().required(),
            authorizationExpired: Joi.boolean().required(),
            authorizationUnitsAlmostExhausted: Joi.boolean().required(),
            authorizationUnitsExhausted: Joi.boolean().required(),
            signatureRequested: Joi.boolean().required(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClientNotificationSettingsDto;