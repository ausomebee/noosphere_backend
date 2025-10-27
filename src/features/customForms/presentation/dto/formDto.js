import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class FormDto {
    static createFormDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required(),
            name: Joi.string().min(2).max(150).required(),
            formFields: Joi.array()
                .items(
                    Joi.object({
                        fieldType: Joi.string()
                            .valid("text", "number", "email", "date", "select", "checkbox", "radio", "textarea")
                            .required(),
                        label: Joi.string().min(2).max(100).required(),
                        placeholder: Joi.string().allow(null, ""),
                        options: Joi.array().items(Joi.string()).optional(),
                        isRequired: Joi.boolean().default(false),
                        order: Joi.number().integer().min(1).optional()
                    })
                )
                .min(1)
                .optional()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateFormDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "any.required": "Form ID is required for update",
                "string.guid": "Form ID must be a valid UUID"
            }),
            tenantId: Joi.string().uuid().required(),
            name: Joi.string().min(2).max(150).optional(),
            formFields: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.string().uuid().optional(),
                        fieldType: Joi.string()
                            .valid("text", "number", "email", "date", "select", "checkbox", "radio", "textarea")
                            .optional(),
                        label: Joi.string().min(2).max(100).optional(),
                        placeholder: Joi.string().allow(null, ""),
                        options: Joi.array().items(Joi.string()).optional(),
                        isRequired: Joi.boolean().default(false),
                        order: Joi.number().integer().min(1).optional()
                    })
                )
                .optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default FormDto;
