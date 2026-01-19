import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClinicalReportSectionDto {
    static createReportSectionDto = (req, res, next) => {
        const schema = Joi.object({
            section: Joi.string()
                .min(1)
                .required(),
            content: Joi.object()
                .required(),
            clinicalReportId: Joi.string()
                .uuid()
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateReportSectionDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),
            section: Joi.string()
                .min(1)
                .optional(),
            content: Joi.object()
                .optional(),
            clinicalReportId: Joi.string()
                .uuid()
                .optional(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClinicalReportSectionDto;
