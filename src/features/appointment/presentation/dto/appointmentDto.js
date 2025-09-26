import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class AppointmentDto {
    static createAppointmentDto = (req, res, next) => {
        const schema = Joi.object({
            clientId: Joi.string()
                .uuid()
                .required(),
            tenantId: Joi.string()
                .uuid()
                .required(),
            sessionId: Joi.string()
                .uuid()
                .required(),
            clinicians: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.string().uuid().required(),
                    })
                )
                .min(1)
                .required(),
            service: Joi.array().items(Joi.object()),
            date: Joi.date().required(),
            isRecurring: Joi.boolean().default(false),
            startTime: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
                .required()
                .messages({
                    "string.pattern.base": "startTime must be in HH:mm or HH:mm:ss format",
                }),

            endTime: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
                .required()
                .messages({
                    "string.pattern.base": "endTime must be in HH:mm or HH:mm:ss format",
                }),
            recurrence: Joi.object().default({}),
            isBillable: Joi.boolean().default(true),
            serviceLocation: Joi.string().min(1).required(),
            requiresTravel: Joi.boolean().default(false),
            colourCode: Joi.string().min(1).required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateAppointmentDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            clientId: Joi.string().uuid(),
            tenantId: Joi.string()
                .uuid()
                .required(),
            sessionId: Joi.string().uuid(),
            clinicians: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.string().uuid().required(),
                    })
                )
                .min(1),
            service: Joi.array().items(Joi.object()),
            date: Joi.date(),
            isRecurring: Joi.boolean(),
            startTime: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
                .optional()
                .messages({
                    "string.pattern.base": "startTime must be in HH:mm or HH:mm:ss format",
                }),
            endTime: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
                .optional()
                .messages({
                    "string.pattern.base": "endTime must be in HH:mm or HH:mm:ss format",
                }),
            recurrence: Joi.object().optional(),
            isBillable: Joi.boolean(),
            serviceLocation: Joi.string().min(1),
            requiresTravel: Joi.boolean(),
            colourCode: Joi.string().min(1),
            relatedAppointment: Joi.string().uuid().allow(null),
            isCanceled: Joi.boolean(),
            reasonForCancel: Joi.string().allow(null, ''),
            rescheduled: Joi.boolean(),
            rescheduleAccepted: Joi.boolean(),
            forAll: Joi.boolean().default(false),
            canceledBy: Joi.string().allow(null, '')
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default AppointmentDto;