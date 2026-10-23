import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class TeamsDto {
    static createTeamDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string()
                .min(1)
                .required(),
            tenantId: Joi.string()
                .uuid()
                .required(),
            teamLeadId: Joi.string()
                .uuid()
                .optional(),
            members: Joi.array()
                .items(Joi.string().uuid())
                .optional()
                .default([]),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateTeamDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),
            name: Joi.string()
                .min(1)
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

export default TeamsDto;
