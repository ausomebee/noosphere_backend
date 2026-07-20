import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClientRequestedDocumentsDto {
    static createRequestedDocumentDto = (req, res, next) => {
        const schema = Joi.object({
            tenantClientId: Joi.string().uuid().required(),
            name: Joi.string().min(2).max(150).required(),
            description: Joi.string().min(2).max(300).optional(),
            allowMultiple: Joi.boolean().default(false),
            dueDate: Joi.date().required(),
            isDeleted: Joi.boolean().default(false)
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateRequestedDocumentDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "any.required": "Requested Document ID is required for update",
                "string.guid": "Requested Document ID must be a valid UUID"
            }),
            name: Joi.string().min(2).max(150).optional(),
            description: Joi.string().min(2).max(300).optional(),
            allowMultiple: Joi.boolean().optional(),
            dueDate: Joi.date().optional(),
            isDeleted: Joi.boolean().optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClientRequestedDocumentsDto;
