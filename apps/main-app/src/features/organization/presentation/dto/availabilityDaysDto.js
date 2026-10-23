import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class AvailabilityDaysDto {
    static createAvailabilityDayDto = (req, res, next) => {
        const schema = Joi.object({
            dayOfWeek: Joi.string()
                .min(1)
                .required(),
            available: Joi.boolean()
                .required(),
            from: Joi.string()
                .min(1)
                .required(),
            to: Joi.string()
                .min(1)
                .required(),
            availabilityId: Joi.string()
                .uuid()
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateAvailabilityDayDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),
            dayOfWeek: Joi.string()
                .min(1)
                .optional(),
            available: Joi.boolean()
                .optional(),
            from: Joi.string()
                .min(1)
                .optional(),
            to: Joi.string()
                .min(1)
                .optional(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default AvailabilityDaysDto;
