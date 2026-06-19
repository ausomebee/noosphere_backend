import expressAsyncHandler from 'express-async-handler';
import ProspectService from '../../application/prospectService.js';

class ProspectController {
    constructor() {
        this.service = new ProspectService();
    }

    sendEmail = expressAsyncHandler(async (req, res) => {
        const result = await this.service.sendEmail(req.body);

        return res.status(200).json({
            message: 'Prospect email sent successfully',
            status: 'ok',
            data: result,
        });
    });
}

export default ProspectController;
