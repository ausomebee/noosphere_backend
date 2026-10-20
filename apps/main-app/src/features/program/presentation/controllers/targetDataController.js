import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import TargetDataRepository from "../../infrastructure/targetDataRepository.js";
import TargetDataService from "../../application/targetDataService.js";
import TargetData from "../../domain/targetData.js";

class TargetDataController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.targetDataRepository = new TargetDataRepository(this.prisma.clientTargetDataCollection)
        this.service = new TargetDataService({ targetDataRepository: this.targetDataRepository });
    }

    createTargetData = expressAsyncHandler(async (req, res) => {
        const targetData = new TargetData(req.body);
        const createdTargetData = await this.service.createTargetData(targetData.createTargetData);

        if (!createdTargetData) {
            res.status(500).json({ message: 'Failed to create target data' });
        }

        return res.status(201).json({
            message: "target data created successfully",
            status: 'ok',
            data: createdTargetData
        });
    });

    getClientTargetData = expressAsyncHandler(async (req, res) => {
        const targetData = await this.service.getClientTargetData(req.params);

        if (!targetData) {
            res.status(500).json({ message: 'Failed to fetch target data' });
        }

        return res.status(201).json({
            message: "target data fetched successfully",
            status: 'ok',
            data: targetData
        });
    });

}

export default TargetDataController;