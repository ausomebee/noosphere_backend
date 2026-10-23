import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClinicalReportChangeRequestDto {
    static createChangeRequestDto = (req, res, next) => {
        const schema = Joi.object({
            clinicalReportId: Joi.string()
                .uuid()
                .required(),

            description: Joi.string()
                .min(1)
                .required(),

            clientTenantId: Joi.string()
                .uuid()
                .optional()
                .allow(null),

            approverId: Joi.string()
                .uuid()
                .optional()
                .allow(null)
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateChangeRequestDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),

            description: Joi.string()
                .min(1)
                .optional(),

            viewed: Joi.boolean()
                .optional(),

            approverId: Joi.string()
                .uuid()
                .optional()
                .allow(null)
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClinicalReportChangeRequestDto;
