import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClientFilesDto {
    static createClientFileDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string()
                .min(1)
                .required(),
            url: Joi.string()
                .uri()
                .required(),
            size: Joi.string()
                .min(1)
                .required(),
            fileType: Joi.string()
                .min(1)
                .required(),
            folderId: Joi.string()
                .uuid()
                .required(),
            uploadedBy: Joi.string()
                .uuid()
                .optional(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateClientFileDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),
            name: Joi.string()
                .min(1)
                .optional(),
            url: Joi.string()
                .uri()
                .optional(),
            size: Joi.string()
                .min(1)
                .optional(),
            fileType: Joi.string()
                .min(1)
                .optional(),
            folderId: Joi.string()
                .uuid()
                .optional(),
            uploadedBy: Joi.string()
                .uuid()
                .optional(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClientFilesDto;
