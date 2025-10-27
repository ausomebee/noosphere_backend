import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class FormFieldDto {
    static createFormFieldDto = (req, res, next) => {
        const schema = Joi.object({
            formId: Joi.string().uuid().required(),
            fieldType: Joi.string()
                .valid("text", "number", "email", "date", "select", "checkbox", "radio", "textarea")
                .required(),
            label: Joi.string().min(2).max(100).required(),
            placeholder: Joi.string().allow(null, ""),
            options: Joi.array().items(Joi.string()).optional(),
            isRequired: Joi.boolean().default(false),
            order: Joi.number().integer().min(1).optional()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateFormFieldDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "any.required": "Form Field ID is required for update",
                "string.guid": "Form Field ID must be a valid UUID"
            }),
            formId: Joi.string().uuid().required(),
            fieldType: Joi.string()
                .valid("text", "number", "email", "date", "select", "checkbox", "radio", "textarea")
                .optional(),
            label: Joi.string().min(2).max(100).optional(),
            placeholder: Joi.string().allow(null, ""),
            options: Joi.array().items(Joi.string()).optional(),
            isRequired: Joi.boolean().default(false),
            order: Joi.number().integer().min(1).optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default FormFieldDto;
