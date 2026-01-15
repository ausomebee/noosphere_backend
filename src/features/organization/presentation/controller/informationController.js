import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import InformationRepository from "../../infrastucture/informationRepository.js";
import InformationService from "../../application/informationService.js";
import Information from "../../domain/information.js";

class InformationController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.informationRepository = new InformationRepository(this.prisma.organizationInformation)
        this.service = new InformationService({ informationRepository: this.informationRepository });
    }

    createInformation = expressAsyncHandler(async (req, res) => {
        const informationData = new Information(req.body);
        const information = await this.service.createInformation(informationData.createInformation);

        if (!information) {
            res.status(500).json({ message: 'Failed to create information' });
        }

        return res.status(201).json({
            message: "information created successfully",
            status: 'ok',
            data: information
        });
    });

    updateInformation = expressAsyncHandler(async (req, res) => {
        const information = await this.service.updateInformation(req.body);

        if (!information) {
            res.status(500).json({ message: 'Failed to update information' });
        }

        return res.status(201).json({
            message: "information updated successfully",
            status: 'ok',
            data: information
        });
    });

    getInformation = expressAsyncHandler(async (req, res) => {
        const information = await this.service.getInformation(req.params.tenantId);

        if (!information) {
            res.status(500).json({ message: 'Failed to fetch information' });
        }

        return res.status(201).json({
            message: "information fetched successfully",
            status: 'ok',
            data: information
        });
    });

}

export default InformationController;