import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClinicalReportDto {
    static createReportDto = (req, res, next) => {
        const schema = Joi.object({
            title: Joi.string().min(2).max(150).required(),
            tenantId: Joi.string().uuid().required(),
            clientTenantId: Joi.string().uuid().required(),
            creatorId: Joi.string().uuid().required(),
            approverId: Joi.string().uuid().optional().allow(null),
            status: Joi.string()
                .default("DRAFT"),
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

    static updateReportDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "any.required": "Clinical Report ID is required for update",
                "string.guid": "Clinical Report ID must be a valid UUID"
            }),
            title: Joi.string().min(2).max(150).optional(),
            approverId: Joi.string().uuid().optional().allow(null),
            status: Joi.string()
                .optional(),
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

export default ClinicalReportDto;
