import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClientRepository from "../../infrastructure/clientRepository.js";
import ClientService from "../../application/clientService.js";
import ReferralCodeGenerator from "../../../../utilities/generateCode.js";
import ClientTenantRepository from "../../infrastructure/clientTenantRepository.js";
import ItemRepository from "../../../pipeline/infrastructure/itemRepository.js";

class ClientController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.clientRepository = new ClientRepository(this.prisma.client);
        this.clientTenantRepository = new ClientTenantRepository(this.prisma.clientTenant);
        this.itemRepository = new ItemRepository(this.prisma.pipelineItem);
        this.generateCode = new ReferralCodeGenerator(12);
        this.service = new ClientService({ clientRepository: this.clientRepository, clientTenantRepository: this.clientTenantRepository, generateCode: this.generateCode, prisma: this.prisma, itemRepository: this.itemRepository });
    }

    createClientCandidate = expressAsyncHandler(async (req, res) => {
        const candidate = await this.service.createClientCandidate(req.body);

        if (!candidate) {
            res.status(500).json({ message: 'Failed to create client candidate' });
        }

        return res.status(201).json({
            message: "candidate created successfully",
            status: 'ok',
            data: candidate
        });
    });

}

export default ClientController;