import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class OrganizationDiagnosisCodesDto {
    static createDiagnosisCodeDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string()
                .uuid()
                .required(),
            code: Joi.string()
                .min(1)
                .required(),
            description: Joi.string()
                .min(1)
                .required(),
            isActive: Joi.boolean()
                .default(true)
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateDiagnosisCodeDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),
            tenantId: Joi.string()
                .uuid()
                .required(),
            code: Joi.string()
                .min(1)
                .required(),
            description: Joi.string()
                .min(1)
                .required(),
            isActive: Joi.boolean()
                .required()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default OrganizationDiagnosisCodesDto;
