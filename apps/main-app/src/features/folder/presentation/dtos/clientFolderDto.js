import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClientFolderDto {
    static createClientFolderDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string()
                .min(1)
                .required(),
            clientTenantId: Joi.string()
                .uuid()
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateClientFolderDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),
            name: Joi.string()
                .min(1)
                .optional(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClientFolderDto;
