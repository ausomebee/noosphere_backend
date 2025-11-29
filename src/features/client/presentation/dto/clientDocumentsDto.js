import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClientDocumentsDto {
    static createClientDocumentDto = (req, res, next) => {
        const schema = Joi.object({
            tenantClientId: Joi.string().uuid().required(),
            requestId: Joi.string().uuid().optional(),
            name: Joi.string().min(2).max(150).required(),
            documentDetails: Joi.object().required(),
            isDeleted: Joi.boolean().default(false),
            createdBy: Joi.string()
                .uuid()
                .optional()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateClientDocumentDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "any.required": "Document ID is required for update",
                "string.guid": "Document ID must be a valid UUID"
            }),
            name: Joi.string().min(2).max(150).optional(),
            documentDetails: Joi.object().optional(),
            isDeleted: Joi.boolean().optional(),
            createdBy: Joi.string()
                .uuid()
                .optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClientDocumentsDto;
