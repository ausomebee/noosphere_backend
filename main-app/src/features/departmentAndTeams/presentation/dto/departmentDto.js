import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class DepartmentDto {
    static createDepartmentDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string()
                .min(1)
                .required(),
            createdByAdminId: Joi.string()
                .uuid()
                .optional(),
            teamLeadId: Joi.string()
                .uuid()
                .required(),
            members: Joi.array()
                .items(Joi.string().uuid())
                .optional()
                .default([]),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateDepartmentDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),
            name: Joi.string()
                .min(1)
                .optional(),
            createdByAdminId: Joi.string()
                .uuid()
                .optional(),
            teamLeadId: Joi.string()
                .uuid()
                .optional(),
            members: Joi.array()
                .items(Joi.string().uuid())
                .optional(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default DepartmentDto;
