import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClinicalReportHistoryDto {
    static createHistoryDto = (req, res, next) => {
        const schema = Joi.object({
            clinicalReportId: Joi.string()
                .uuid()
                .required(),
            action: Joi.string()
                .min(1)
                .required(),
            details: Joi.string()
                .optional()
                .allow(null, ""),
            createdBy: Joi.string()
                .uuid()
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateHistoryDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),
            action: Joi.string()
                .min(1)
                .optional(),
            details: Joi.string()
                .optional()
                .allow(null, ""),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClinicalReportHistoryDto;
