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
                .items(Joi.string().uuid())
                .min(1)
                .required(),
            service: Joi.array().items(Joi.object()),
            date: Joi.date().required(),
            isRecurring: Joi.boolean().default(false),
            startTime: Joi.date().required(),
            endTime: Joi.date().required(),
            recurrence: Joi.object().default({}),
            isBillable: Joi.boolean().default(true),
            serviceLocation: Joi.string().min(1).required(),
            requiresTravel: Joi.boolean().default(false),
            colourCode: Joi.string().min(1).required(),
            relatedAppointment: Joi.string().uuid().optional()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateAppointmentDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            clientId: Joi.string().uuid(),
            sessionId: Joi.string().uuid(),
            clinicians: Joi.array().items(Joi.string().uuid()).min(1),
            service: Joi.array().items(Joi.object()),
            date: Joi.date(),
            isRecurring: Joi.boolean(),
            startTime: Joi.date(),
            endTime: Joi.date(),
            recurrence: Joi.object(),
            isBillable: Joi.boolean(),
            serviceLocation: Joi.string().min(1),
            requiresTravel: Joi.boolean(),
            colourCode: Joi.string().min(1),
            relatedAppointment: Joi.string().uuid().allow(null),
            isCanceled: Joi.boolean(),
            reasonForCancel: Joi.string().allow(null, ''),
            rescheduled: Joi.boolean(),
            rescheduleAccepted: Joi.boolean(),
            forAll: Joi.boolean().default(false)
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default AppointmentDto;