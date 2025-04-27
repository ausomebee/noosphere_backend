import TokenService from '../../../utilities/generate_token.js';
import bcrypt from 'bcryptjs'
import ClientRepository from '../infrastructure/clientRepository.js';

class ClientService {
    constructor() {
        this.repository = new ClientRepository()
        this.token = new TokenService()
    }

    async createCient(data) {
        const clientExists = await this.repository.findFirst({
            where: {
                OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
            },
            select: {
                email: true,
                phoneNumber: true,
                tenantLinks: true
            }
        });
console.log(clientExists)
        if (clientExists && !clientExists?.tenantLinks.includes(data.tenantId)) {
            const addClient = await this.repository.createClientTenant({ ...data.createClientTenant, clientId: clientExists.id })

            if (!addClient) {
                throw new Error("Failed to add client");
            }

            return addClient;
        }

        if (clientExists?.email === data.email) {
            throw new Error("This email is already taken.");
        }

        if (clientExists?.phoneNumber === data.phoneNumber) {
            throw new Error("This phone number is already taken.");
        }

        const hashedPass = await bcrypt.hash(data.password, 10);
        data.password = hashedPass;

        const newClient = await this.repository.prisma.$transaction(async (tx) => {
            const client = await this.repository.txCreateClient(data.createClient, tx);
            const clientTenant = await this.repository.txCreateClientTenant({ ...data.createClientTenant, clientId: client.id }, tx);

            return client;
        });

        if (!newClient) {
            throw new Error("Failed to create client");
        }

        return newClient;
    }

    async createClientTenant(data) {
        const clientExists = await this.repository.findFirst({
            where: { id: data.clientId },
            select: {
                email: true,
                phoneNumber: true,
                tenantLinks: true
            }
        });

        if (!clientExists) {
            throw new Error("Client not found.");
        }

        if (clientExists?.tenantLinks.includes(data.tenantId)) {
            throw new Error("Tenant is already included.");
        }

        const addTenantClient = await this.repository.createClientTenant(data);

        if (!addTenantClient) {
            throw new Error("Failed to add client");
        }

        return addTenantClient;
    }

    async clientSignin(data) {
        const client = await this.repository.findOne({
            email: data.email
        });

        if (!client) {
            throw new Error("You don't have an account")
        }

        if (!bcrypt.compareSync(data.password, client.password)) {
            throw new Error('Incorrect password')
        }

        return { ...client, token: this.token.generateToken(client.id) };
    }
}

export default ClientService;