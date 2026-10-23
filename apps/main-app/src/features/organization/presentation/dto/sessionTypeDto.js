import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class OrganizationSessionTypesDto {
    static createSessionTypeDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string()
                .uuid()
                .required(),
            name: Joi.string()
                .min(1)
                .required(),
            category: Joi.string()
                .min(1)
                .required(),
            service: Joi.array()
                .required(),
            staffRolesAllowed: Joi.array()
                .items(Joi.string())
                .min(1)
                .required(),
            locationsAllowed: Joi.array()
                .required(),
            defaultDuration: Joi.number()
                .integer()
                .min(1)
                .required(),
            isActive: Joi.boolean()
                .default(true),
            isBillable: Joi.boolean()
                .default(false),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateSessionTypeDto = (req, res, next) => {
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
            category: Joi.string()
                .min(1)
                .required(),
            service: Joi.array()
                .required(),
            staffRolesAllowed: Joi.array()
                .items(Joi.string())
                .required(),
            locationsAllowed: Joi.array()
                .items(Joi.string())
                .required(),
            defaultDuration: Joi.number()
                .integer()
                .min(1)
                .required(),
            isActive: Joi.boolean()
                .required(),
            isBillable: Joi.boolean()
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default OrganizationSessionTypesDto;
