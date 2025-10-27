import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class FormResponseDto {
    static createFormResponseDto = (req, res, next) => {
        const schema = Joi.object({
            formId: Joi.string().uuid().required(),
            tenantId: Joi.string().uuid().required(),
            submittedBy: Joi.string().min(2).max(150).required(),
            responseFields: Joi.array()
                .items(
                    Joi.object({
                        fieldId: Joi.string().uuid().required(),
                        value: Joi.alternatives()
                            .try(Joi.string(), Joi.number(), Joi.boolean(), Joi.array())
                            .required(),
                    })
                )
                .min(1)
                .required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateFormResponseDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "any.required": "Form Response ID is required for update",
                "string.guid": "Form Response ID must be a valid UUID"
            }),
            formId: Joi.string().uuid().required(),
            tenantId: Joi.string().uuid().required(),
            submittedBy: Joi.string().min(2).max(150).optional(),
            responseFields: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.string().uuid().optional(),
                        fieldId: Joi.string().uuid().required(),
                        value: Joi.alternatives()
                            .try(Joi.string(), Joi.number(), Joi.boolean(), Joi.array())
                            .required(),
                    })
                )
                .optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default FormResponseDto;
