import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class DepartmentMembersDto {
    static createDepartmentMemberDto = (req, res, next) => {
        const schema = Joi.object({
            departmentId: Joi.string()
                .uuid()
                .required(),
            adminId: Joi.string()
                .uuid()
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static removeDepartmentMemberDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default DepartmentMembersDto;
