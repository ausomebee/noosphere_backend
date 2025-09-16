import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class InformationDto {
    static createInformationDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string()
                .uuid()
                .required(),
            name: Joi.string()
                .min(1)
                .required(),
            email: Joi.string()
                .email()
                .required(),
            phoneNumber: Joi.string()
                .pattern(/^[0-9+\-\s()]+$/)
                .required(),
            website: Joi.string()
                .required(),
            practiceNPI: Joi.string()
                .alphanum()
                .min(1)
                .required(),
            streetAddress: Joi.string()
                .min(1)
                .required(),
            city: Joi.string()
                .min(1)
                .required(),
            state: Joi.string()
                .min(1)
                .required(),
            country: Joi.string()
                .min(1)
                .required(),
            zipCode: Joi.string()
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateInformationDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),
            tenantId: Joi.string()
                .uuid()
                .required(),
            name: Joi.string()
                .min(1)
                .required(),
            email: Joi.string()
                .email()
                .required(),
            phoneNumber: Joi.string()
                .pattern(/^[0-9+\-\s()]+$/)
                .required(),
            website: Joi.string()
                .required(),
            practiceNPI: Joi.string()
                .alphanum()
                .min(1)
                .required(),
            streetAddress: Joi.string()
                .min(1)
                .required(),
            city: Joi.string()
                .min(1)
                .required(),
            state: Joi.string()
                .min(1)
                .required(),
            country: Joi.string()
                .min(1)
                .required(),
            zipCode: Joi.string()
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };

}

export default InformationDto;