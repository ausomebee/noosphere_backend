import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class TeamMembersDto {
    static createTeamMemberDto = (req, res, next) => {
        const schema = Joi.object({
            teamId: Joi.string()
                .uuid()
                .required(),
            staffId: Joi.string()
                .uuid()
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static removeTeamMemberDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default TeamMembersDto;
