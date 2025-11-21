import Client from "../domain/client.js";
import MailService from '../../../utilities/nodemailer.js';
import argon2 from "argon2";

class ClientService {
    constructor({ clientRepository, clientTenantRepository, generateCode, prisma, itemRepository }) {
        this.clientRepository = clientRepository;
        this.clientTenantRepository = clientTenantRepository;
        this.itemRepository = itemRepository;
        this.generateCode = generateCode;
        this.prisma = prisma;
    }

    async createClientCandidate(data) {
        const existingClient = await this.clientTenantRepository.findFirstDynamic({
            where: {
                tenantId: data.tenantId,
                client: {
                    OR: [
                        { email: data.email },
                        { phoneNumber: data.phoneNumber },
                    ],
                },
            },
            include: {
                client: true,
            },
        });

        if (existingClient?.email === data.email) {
            throw new Error("This email is already taken.");
        }

        if (existingClient?.phoneNumber === data.phoneNumber) {
            throw new Error("This phone number is already taken.");
        }

        const createData = new Client(data);

        const newCandidate = await this.prisma.$transaction(async (tx) => {
            const client = await this.clientRepository.txCreate(createData.createClient, tx);
            const clientTenant = await this.clientTenantRepository.txCreate({ ...createData.createClientTenant, clientId: client.id }, tx);
            const pipelineItem = await this.itemRepository.txCreate({
                clientId: client.id,
                tenantId: clientTenant.tenantId,
                pipelineStageId: data.pipelineStageId,
                assignToTenantStaff: data.assignToTenantStaff
            }, tx)

            return { pipelineItem, client };
        }, { timeout: 10_000 });

        if (!newCandidate) {
            throw new Error("Failed to create candidate");
        }

        return { ...newCandidate.pipelineItem, email: newCandidate.client.email };
    }

    async updateClient(data) {
        const client = await this.clientRepository.findOne({ id: data.id })

        if (!client) {
            throw new Error("client not found");
        }

        const update = await this.clientRepository.update(data.id, {
            email: data.email || client.email,
            phoneNumber: data.phoneNumber || client.phoneNumber,
            fullName: data.fullName || client.fullName,
            isDeleted: data.isDeleted ?? client.isDeleted,
            DOB: data.DOB || client.DOB,
            gender: data.gender || client.gender,
            streetAddress: data.streetAddress || client.streetAddress,
            city: data.city || client.city,
            state: data.state || client.state,
            country: data.country || client.country,
            zipCode: data.zipCode || client.zipCode,
            password: data.password || client.password,
            isVerified: data.isVerified ?? client.isVerified,
        });

        if (!update) {
            throw new Error("Failed to update client");
        }

        return update;
    }

    async getTenantClients(tenantId) {
        const clients = await this.clientTenantRepository.findAllAndPopulate({ tenantId }, { client: true });

        if (!clients) {
            throw new Error("clients not found")
        }

        return clients;
    }
}

export default ClientService;