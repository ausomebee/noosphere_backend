import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClientProgramDto {
    static createClientProgramDto = (req, res, next) => {
        const schema = Joi.object({
            clientId: Joi.string().uuid().required(),
            programId: Joi.string().uuid().required(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClientProgramDto;