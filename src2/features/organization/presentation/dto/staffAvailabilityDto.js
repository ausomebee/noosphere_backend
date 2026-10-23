import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class StaffAvailabilityDto {
    static createStaffAvailabilityDto = (req, res, next) => {
        const schema = Joi.object({
            staffId: Joi.string()
                .uuid()
                .required(),

            availabilityDays: Joi.array()
                .items(
                    Joi.object({
                        dayOfWeek: Joi.string().min(1).required(),
                        available: Joi.boolean().required(),
                        from: Joi.string().min(1).required(),
                        to: Joi.string().min(1).required(),
                    })
                )
                .min(1)
                .required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateStaffAvailabilityDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),

            availabilityDays: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.string().uuid().required(),
                        dayOfWeek: Joi.string().min(1).optional(),
                        available: Joi.boolean().optional(),
                        from: Joi.string().min(1).optional(),
                        to: Joi.string().min(1).optional(),
                    })
                )
                .min(1)
                .required()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default StaffAvailabilityDto;
