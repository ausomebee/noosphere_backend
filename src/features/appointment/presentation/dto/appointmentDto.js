import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class AppointmentDto {
    static createAppointmentDto = (req, res, next) => {
        const schema = Joi.object({
            clientId: Joi.string()
                .uuid()
                .required(),
            sessionId: Joi.string()
                .uuid()
                .required(),
            clinicians: Joi.array()
                .items(Joi.string().uuid())
                .min(1)
                .required(),
            service: Joi.object().required(),
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
}

export default AppointmentDto;