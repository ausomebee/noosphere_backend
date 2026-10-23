import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class DocumentDto {
    static updateDocumentDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            documentsUrl: Joi.object().required(),
            tenantStaffId: Joi.string().uuid().required(),
            isDeleted: Joi.boolean().optional()
        });

        Validator.validateRequest(req, next, schema);
    };

    static createDocumentDto = (req, res, next) => {
        const schema = Joi.object({
            documentsUrl: Joi.object().required(),
            tenantStaffId: Joi.string().uuid().required(),
        });

        Validator.validateRequest(req, next, schema);
    };

}

export default DocumentDto;