import TokenService from "../../../utilities/generate_token.js";
import ReferralCodeGenerator from "../../../utilities/generateCode.js";
import MailService from "../../../utilities/nodemailer.js";
import emailService from "../../../utilities/ses.js";
import Client from "../domain/client.js";
import argon2 from "argon2";
import templateRenderer from "../../../utilities/templateRenderer.js";

const buildClientLoginUrl = (baseUrl, subdomain) => {
    const normalizedBaseUrl = (baseUrl || 'http://noospherehub.net').trim().replace(/\/+$/, '');
    const url = new URL(/^[a-z][a-z\d+\-.]*:\/\//i.test(normalizedBaseUrl) ? normalizedBaseUrl : `https://${normalizedBaseUrl}`);

    url.hostname = `www.${subdomain}.${url.hostname.replace(/^www\./, '')}`;

    return `${url.origin}/client/intialLogin`;
};

class ClientService {
    constructor({ clientRepository, clientTenantRepository, generateCode, prisma, itemRepository }) {
        this.clientRepository = clientRepository;
        this.clientTenantRepository = clientTenantRepository;
        this.itemRepository = itemRepository;
        this.generateCode = generateCode;
        this.prisma = prisma;
        this.generateCode = new ReferralCodeGenerator(12)
        this.token = TokenService;
    }

    async createClientCandidate(data, tenant) {
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

        if (existingClient?.client.email === data.email) {
            throw new Error("This email is already taken.");
        }

        if (existingClient?.client.phoneNumber === data.phoneNumber) {
            throw new Error("This phone number is already taken.");
        }

        const generatedPass = this.generateCode.generateStrongPassword()
        const hashedPass = await argon2.hash(generatedPass)
        const createData = new Client(data);

        const newCandidate = await this.prisma.$transaction(async (tx) => {
            const client = await this.clientRepository.txCreate(createData.createClient, tx);
            const clientTenant = await this.clientTenantRepository.txCreate({ ...createData.createClientTenant, clientId: client.id, password: hashedPass }, tx);
            let pipelineItem
            if (data.pipelineStageId) {
                pipelineItem = await this.itemRepository.txCreate({
                    clientId: client.id,
                    tenantId: clientTenant.tenantId,
                    pipelineStageId: data.pipelineStageId,
                    assignToTenantStaff: data.assignToTenantStaff
                }, tx)
            }

            return { pipelineItem, client, clientTenant };
        }, { timeout: 10_000 });

        if (!newCandidate) {
            throw new Error("Failed to create candidate");
        }

        const attachments = [
            {
                filename: "Logowrap.png",
                path: "Logowrap.png",
                cid: "unique@image",
                contentType: "Logowrap/png",
            }
        ]

        const clientLoginUrl = buildClientLoginUrl(process.env.CLIENT_URL, tenant.subdomain);

        const html = templateRenderer.render('client-welcome.html', {
            preferredName: createData.preferredName,
            companyName: tenant.companyName,
            subdomain: tenant.subdomain,
            email: createData.email,
            password: generatedPass,
            clientLoginUrl
        });
        const sendMail = await emailService.sendTenantEmail({
            tenantSlug: tenant.subdomain,
            to: [data.email],
            subject: "Welcome to Noosphere",
            html: html
        });

        if (!sendMail.messageId) {
            throw new Error("Failed to send mail");
        }

        return {
            ...(newCandidate.pipelineItem || {}),
            email: newCandidate.client.email,
            tenantClientId: newCandidate.clientTenant.id
        };
    }

    async initiatePasswordReset(email) {
        const client = await this.clientTenantRepository.findFirstDynamic({
            where: {
                client: {
                    email,
                },
            },
            include: {
                client: true,
                tenant: true
            },
        });

        const attachments = [
            {
                filename: "Logowrap.png",
                path: "Logowrap.png",
                cid: "unique@image",
                contentType: "Logowrap/png",
            }
        ]

        const html = templateRenderer.render('client-password-reset.html', {
            subdomain: client.tenant.subdomain,
            clientId: client.id
        });

        const sendMail = await emailService.sendTenantEmail({
            tenantSlug: client.tenant.subdomain,
            to: [email],
            subject: "Initiate password reset",
            html: html
        });

        if (!sendMail.messageId) {
            throw new Error("Failed to send mail");
        }

        return "email sent successfully";
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
            avatarUrl: data.avatarUrl || client.avatarUrl,
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
            isVerified: data.isVerified ?? client.isVerified,
            isDeleted: data.isDeleted ?? client.isDeleted,
            password: data.password || client.password,
        });

        const clientTenant = await this.clientTenantRepository.findFirst({ clientId: data.id })

        const updateClientTenant = await this.clientTenantRepository.update(clientTenant.id, {
            dbAccess: data.dbAccess ?? client.dbAccess,
            active: data.active ?? client.active,
            stage: data.stage || client.stage,
            clinicians: data.assignToClinicians
                ? { set: data.assignToClinicians }
                : undefined,
            requestAppointment: data.requestAppointment ?? client.requestAppointment,
            documentAccess: data.documentAccess ?? client.documentAccess
        });

        if (!update) {
            throw new Error("Failed to update client");
        }

        return { ...update, clientTenantId: clientTenant.id };
    }

    async getClientsByClinician(staffId, tenantId) {
        const clients = await this.clientRepository.getClientsByClinician(staffId, tenantId);
        if (!clients) {
            throw new Error("clients not found")
        }

        return clients;
    }

    async getTenantClients(tenantId, actor) {
        const clients = await this.clientTenantRepository.findAllAndPopulate(
            await this.buildClientAccessWhere({ tenantId }, actor),
            { client: { include: { payer: true } }, clinicians: true }
        );
        if (!clients) {
            throw new Error("clients not found")
        }

        return clients;
    }

    async getSingleClient(clientId, actor) {
        const client = await this.clientTenantRepository.findFirstDynamic({
            where: await this.buildClientAccessWhere({ clientId }, actor),
            include: {
                client: {
                    include: { payer: true }
                },
                clinicians: true
            },
        });

        if (!client) {
            throw new Error("clients not found")
        }

        return client;
    }

    /**
     * Produces the ClientTenant filter implied by the authenticated user's role.
     * GLOBAL sees every record in the requested tenant; INDIVIDUAL sees their own
     * assignments; TEAM additionally sees assignments belonging to their team.
     */
    async buildClientAccessWhere(baseWhere, actor) {
        if (!actor) {
            return { AND: [baseWhere, { id: { in: [] } }] };
        }

        if (actor.type === "CLIENT") {
            return {
                AND: [
                    baseWhere,
                    { clientId: actor.clientId },
                    { tenantId: actor.tenantId },
                ],
            };
        }

        const level = actor.superAdmin ? "GLOBAL" : actor.role?.dataAccessLevel;
        if (level === "GLOBAL") return baseWhere;

        if (actor.type === "STAFF") {
            const staffIds = await this.getAccessibleStaffIds(actor, level);
            return {
                AND: [
                    baseWhere,
                    { tenantId: actor.tenantId },
                    {
                        OR: [
                            { createdBy: { in: staffIds } },
                            { clinicians: { some: { id: { in: staffIds } } } },
                        ],
                    },
                ],
            };
        }

        if (actor.type === "ADMIN") {
            const tenantIds = await this.getAccessibleTenantIds(actor, level);
            return { AND: [baseWhere, { tenantId: { in: tenantIds } }] };
        }

        return { AND: [baseWhere, { id: { in: [] } }] };
    }

    async getAccessibleStaffIds(actor, level) {
        if (level !== "TEAM") return [actor.id];

        const teams = await this.prisma.teams.findMany({
            where: {
                tenantId: actor.tenantId,
                isActive: true,
                isDeleted: false,
                OR: [
                    { teamLeadId: actor.id },
                    { teamMembers: { some: { staffId: actor.id } } },
                ],
            },
            select: {
                teamLeadId: true,
                teamLead: {
                    select: {
                        role: {
                            select: { dataAccessLevel: true },
                        },
                    },
                },
                teamMembers: {
                    select: {
                        staffId: true,
                        staff: {
                            select: {
                                role: {
                                    select: { dataAccessLevel: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        const staffIds = [actor.id];

        for (const team of teams) {
            if (team.teamLeadId && team.teamLead?.role?.dataAccessLevel !== "GLOBAL") {
                staffIds.push(team.teamLeadId);
            }

            for (const member of team.teamMembers || []) {
                const accessLevel = member.staff?.role?.dataAccessLevel;
                if (member.staffId && accessLevel !== "GLOBAL") {
                    staffIds.push(member.staffId);
                }
            }
        }

        return [...new Set(staffIds)];
    }

    async getAccessibleTenantIds(actor, level) {
        let adminIds = [actor.id];

        if (level === "TEAM") {
            const departments = await this.prisma.department.findMany({
                where: {
                    isActive: true,
                    isDeleted: false,
                    OR: [
                        { teamLeadId: actor.id },
                        { departmentMembers: { some: { adminId: actor.id } } },
                    ],
                },
                select: {
                    teamLeadId: true,
                    departmentMembers: { select: { adminId: true } },
                },
            });
            adminIds = [...new Set([actor.id, ...departments.flatMap((department) => [
                department.teamLeadId,
                ...department.departmentMembers.map((member) => member.adminId),
            ])])];
        }

        const tenants = await this.prisma.tenant.findMany({
            where: { assignToAdmin: { in: adminIds }, isDeleted: false },
            select: { id: true },
        });
        return tenants.map((tenant) => tenant.id);
    }

    async updateTenantClient(data) {
        const client = await this.clientTenantRepository.findFirst({ id: data.clientTenantId })

        if (!client) {
            throw new Error("client not found");
        }

        if (data.password) {
            const hashedPass = await argon2.hash(data.password)
            data.password = hashedPass
        }

        const updatePayload = {
            dbAccess: data.dbAccess ?? client.dbAccess,
            active: data.active ?? client.active,
            stage: data.stage ?? client.stage,
            clinicians: data.assignToClinicians
                ? { set: data.assignToClinicians }
                : undefined,
            requestAppointment: data.requestAppointment ?? client.requestAppointment,
            documentAccess: data.documentAccess ?? client.documentAccess,
            password: data.password || client.password,
            passwordChanged: data.passwordChanged ?? client.passwordChanged
        };

        const updated = await this.clientTenantRepository.update(client.id, updatePayload);

        if (!updated) {
            throw new Error("Failed to update client");
        }

        return updated;
    }

    async login(data) {
        const client = await this.clientRepository.findFirstDynamic({
            where: {
                email: data.email,
                tenantLinks: {
                    some: {
                        tenant: {
                            OrganizationInformation: {
                                subDomain: data.subDomain,
                            },
                        },
                    },
                },
            },
            include: {
                tenantLinks: true
            },
        });

        if (!client) {
            throw new Error("You don't have an account")
        }

        if (!(await argon2.verify(client.tenantLinks[0].password, data.password))) {
            throw new Error('Incorrect password')
        }

        const claims = {
            id: client.tenantLinks[0].id,
        }

        const { tenantLinks, ...clientData } = client;
        const sanitizedLinks = tenantLinks.map(({ password: _cp, ...link }) => link);
        return { ...clientData, tenantLinks: sanitizedLinks, accessToken: this.token.generateAccessToken(claims), refreshToken: this.token.generateRefreshToken(tenantLinks[0]?.id, "CLIENT") };
    }

    async updateClientPassword(data) {
        const existingClient = await this.clientTenantRepository.findOne({ id: data.clientTenantId });

        if (!existingClient.active) {
            throw new Error("This client does not exist.");
        }

        if (!(await argon2.verify(existingClient.password, data.currentPassword))) {
            throw new Error('Incorrect password')
        }

        const hashedPass = await argon2.hash(data.newPassword)
        const updated = await this.clientTenantRepository.update(data.clientTenantId, {
            password: hashedPass,
        });

        if (!updated) {
            throw new Error("Failed to update password");
        }

        return updated;
    }

    async countAllClients() {
        return await this.clientRepository.countAllClients();
    }

    async countClientsOfPaidTenants() {
        return await this.clientRepository.countClientsOfPaidTenants();
    }
}

export default ClientService;
