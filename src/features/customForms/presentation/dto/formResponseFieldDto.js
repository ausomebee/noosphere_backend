import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class FormResponseFieldDto {
    static createFormResponseFieldDto = (req, res, next) => {
        const schema = Joi.object({
            formResponseId: Joi.string().uuid().required(),
            fieldId: Joi.string().uuid().required(),
            value: Joi.alternatives()
                .try(Joi.string(), Joi.number(), Joi.boolean(), Joi.array())
                .required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateFormResponseFieldDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "any.required": "Form Response Field ID is required for update",
                "string.guid": "Form Response Field ID must be a valid UUID"
            }),
            formResponseId: Joi.string().uuid().required(),
            fieldId: Joi.string().uuid().required(),
            value: Joi.alternatives()
                .try(Joi.string(), Joi.number(), Joi.boolean(), Joi.array())
                .required()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default FormResponseFieldDto;
