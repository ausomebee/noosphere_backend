import expressAsyncHandler from 'express-async-handler';
import ProspectService from '../../application/prospectService.js';
import auditLogger from '../../../logs/application/auditLogger.js';

class ProspectController {
    constructor() {
        this.service = new ProspectService();
    }

    sendEmail = expressAsyncHandler(async (req, res) => {
        const result = await this.service.sendEmail(req.body);

        await auditLogger.log(req, {
            tenantId: req.user?.tenantId || req.body.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Prospect Management",
            action: "sent a prospect email",
            reason: "Prospect email sent",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({
            message: 'Prospect email sent successfully',
            status: 'ok',
            data: result,
        });
    });
}

export default ProspectController;
