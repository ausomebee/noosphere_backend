import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClinicalReportTemplateDto {
    static createTemplateDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required(),
            title: Joi.string().min(2).max(150).required(),
            isActive: Joi.boolean().default(true),
            isDeleted: Joi.boolean().default(false),
            sections: Joi.array()
                .items(
                    Joi.object({
                        section: Joi.string().min(2).max(150).required(),
                        content: Joi.object().required()
                    })
                )
                .min(1)
                .optional()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateTemplateDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "any.required": "Template ID is required for update",
                "string.guid": "Template ID must be a valid UUID"
            }),
            title: Joi.string().min(2).max(150).optional(),
            isActive: Joi.boolean().optional(),
            isDeleted: Joi.boolean().optional(),
            sections: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.string().uuid().optional(),
                        section: Joi.string().min(2).max(150).optional(),
                        content: Joi.object().optional()
                    })
                )
                .optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClinicalReportTemplateDto;
