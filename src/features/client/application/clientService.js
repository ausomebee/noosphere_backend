import Client from "../domain/client.js";

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

            return { pipelineItem, client, clientTenant };
        }, { timeout: 10_000 });

        if (!newCandidate) {
            throw new Error("Failed to create candidate");
        }

        return { ...newCandidate.pipelineItem, email: newCandidate.client.email, tenantClientId: newCandidate.clientTenant.id };
    }

    async updateClient(data) {
        const client = await this.clientRepository.findOne({ id: data.id })

        if (!client) {
            throw new Error("client not found");
        }

        const update = await this.clientRepository.update(data.id, {
            firstName: data.firstName || client.firstName,
            lastName: data.lastName || client.lastName,
            preferredName: data.preferredName || client.preferredName,
            email: data.email || client.email,
            phoneNumber: data.phoneNumber || client.phoneNumber,
            DOB: data.DOB || client.DOB,
            gender: data.gender || client.gender,
            primaryPayer: data.primaryPayer || client.primaryPayer,
            streetAddress: data.streetAddress || client.streetAddress,
            city: data.city || client.city,
            state: data.state || client.state,
            country: data.country || client.country,
            zipCode: data.zipCode || client.zipCode,
            caregiverName: data.caregiverName || client.caregiverName,
            caregiverRelationship: data.caregiverRelationship || client.caregiverRelationship,
            caregiverPhone: data.caregiverPhone || client.caregiverPhone,
            caregiverEmail: data.caregiverEmail || client.caregiverEmail,
            caregiverStreetAddress: data.caregiverStreetAddress || client.caregiverStreetAddress,
            caregiverCity: data.caregiverCity || client.caregiverCity,
            caregiverState: data.caregiverState || client.caregiverState,
            caregiverCountry: data.caregiverCountry || client.caregiverCountry,
            caregiverZip: data.caregiverZip || client.caregiverZip,
            documents: data.documents || client.documents,
            isVerified: data.isVerified ?? client.isVerified,
            isDeleted: data.isDeleted ?? client.isDeleted,
            password: data.password || client.password,
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

    async updateTenantClient(data) {
        const client = await this.clientTenantRepository.findFirst({ clientId: data.clientId })

        if (!client) {
            throw new Error("client not found");
        }

        const update = await this.clientTenantRepository.update(client.id, {
            dbAccess: data.dbAccess ?? client.dbAccess,
            active: data.active ?? client.active,
            stage: data.stage || client.stage,
            requestAppointment: data.requestAppointment ?? client.requestAppointment,
            documentAccess: data.documentAccess ?? client.documentAccess
        });

        if (!update) {
            throw new Error("Failed to update client");
        }

        return update;
    }


}

export default ClientService;