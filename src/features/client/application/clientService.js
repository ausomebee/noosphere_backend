import ReferralCodeGenerator from "../../../utilities/generateCode.js";
import MailService from "../../../utilities/nodemailer.js";
import Client from "../domain/client.js";
import argon2 from "argon2";

class ClientService {
    constructor({ clientRepository, clientTenantRepository, generateCode, prisma, itemRepository }) {
        this.clientRepository = clientRepository;
        this.clientTenantRepository = clientTenantRepository;
        this.itemRepository = itemRepository;
        this.generateCode = generateCode;
        this.prisma = prisma;
        this.generateCode = new ReferralCodeGenerator(12)
    }

    async createClientCandidate(data, information) {
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

        const html = `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Welcome to NooSphere</title>
                <style type="text/css">
                    body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                    table { border-collapse: collapse !important; }
                    
                    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                    
                    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                </style>
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
                
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5;">
                    <tr>
                    <td align="center" style="padding: 0;">
                        
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff;">
                        
                        <tr>
                            <td align="center" style="padding: 0; height: 60px; background: linear-gradient(90deg, #8B5CF6 0%, #EC4899 50%, #EF4444 100%);">
                            <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:60px;">
                                <v:fill type="gradient" color="#8B5CF6" color2="#EF4444" angle="90" />
                            </v:rect>
                            </td>
                        </tr>
                        
                        <tr>
                            <td align="center" style="padding: 40px 40px 30px 40px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                <td align="center">
                                    <img src="cid:unique@image" alt="NooSphere" width="180" height="40" style="display: block; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #000000;" />
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        
                        <tr>
                            <td align="center" style="padding: 0 40px 10px 40px;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 400; color: #1a1a1a; line-height: 1.4;">
                                Hello ${createData.preferredName},<br/>Welcome to ${information.name}
                            </h1>
                            </td>
                        </tr>
                        
                        <tr>
                            <td align="center" style="padding: 10px 40px 30px 40px;">
                            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #666666; font-weight: 400;">
                                An account has been created for you on NooSphere.<br/>
                                Please log in to access your information and begin using<br/>
                                your client portal.
                            </p>
                            </td>
                        </tr>
                        
                        <tr>
                            <td align="center" style="padding: 0 40px 30px 40px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f9fa; border-radius: 8px;">
                                <tr>
                                <td style="padding: 24px 24px 20px 24px;">
                                    
                                    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; color: #666666;">
                                    Log in here: <a href="https://www.${information.subDomain}.noosphere.org" style="color: #2563eb; text-decoration: none; font-weight: 500;">https://www.${information.subDomain}.noosphere.org</a>
                                    </p>
                                    
                                    <p style="margin: 0 0 4px 0; font-size: 14px; line-height: 1.5; color: #1a1a1a;">
                                    <strong style="font-weight: 600;">Email:</strong> ${createData.email}
                                    </p>
                                    
                                    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; color: #1a1a1a;">
                                    <strong style="font-weight: 600;">Temporary Password:</strong> ${generatedPass}
                                    </p>
                                    
                                    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; color: #666666;">
                                    When you log in for the first time, please change your password to something memorable and secure.
                                    </p>
                                    
                                    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; color: #666666;">
                                    If you need help, we're just a message away at<br/>
                                    <a href="mailto:support@${information.subDomain}.noosphere.com" style="color: #2563eb; text-decoration: none;">support@${information.subDomain}.noosphere.com</a>
                                    </p>
                                    <p style="margin: 0 0 4px 0; font-size: 14px; line-height: 1.5; color: #666666;">
                                    Warmly,
                                    </p>
                                    <p style="margin: 0 0 4px 0; font-size: 14px; line-height: 1.5; color: #666666;">
                                    The Tenant XYZ Team
                                    </p>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        
                        </table>
                        
                    </td>
                    </tr>
                </table>
                
                </body>
            </html>
        `
        const sendMail = await MailService.sendMail(createData.email, "Welcome to Noosphere", null, html, attachments)

        if (!sendMail.success) {
            throw new Error("Failed to send mail");
        }

        return { ...newCandidate.pipelineItem, email: newCandidate.client.email, tenantClientId: newCandidate.clientTenant.id };
    }

    async initiatePasswordReset(id) {
        const client = await this.clientTenantRepository.findFirstDynamic({
            where: { id },
            include: {
                client: true,
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

        const html = `
        <!DOCTYPE html
            PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">

        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Reset your password</title>
            <style type="text/css">
                body,
                table,
                td,
                a {
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }

                table,
                td {
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                }

                img {
                    -ms-interpolation-mode: bicubic;
                    border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
                }

                body {
                    height: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                }

                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            </style>
        </head>

        <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5;">
                <tr>
                    <td align="center" style="padding: 0;">

                        <table border="0" cellpadding="0" cellspacing="0" width="600"
                            style="max-width: 600px; background-color: #ffffff;">

                            <tr>
                                <td align="center"
                                    style="padding: 0; height: 90px; background: linear-gradient(90deg, #8B5CF6 0%, #EC4899 35%, #F97316 65%, #3B82F6 100%);">
                                    <div style="height: 90px;"></div>
                                </td>
                            </tr>

                            <tr>
                                <td align="center" style="padding: 60px 40px 40px 40px;">

                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center" style="padding: 40px 40px 30px 40px;">
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td align="center">
                                                            <img src="cid:unique@image" alt="NooSphere" width="180" height="40"
                                                                style="display: block; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #000000;" />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td align="center" style="padding: 0 0 30px 0;">
                                                <h1
                                                    style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 32px; font-weight: 700; color: #000000; line-height: 1.3;">
                                                    Reset your password</h1>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td align="center" style="padding: 0 0 10px 0;">
                                                <p
                                                    style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; color: #6B7280; line-height: 1.6;">
                                                    We received a request to reset our password.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 0 0 30px 0;">
                                                <p
                                                    style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; color: #6B7280; line-height: 1.6;">
                                                    Follow the link to create a new password.</p>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td align="center" style="padding: 0 0 40px 0;">
                                                <p
                                                    style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; color: #6B7280; line-height: 1.6;">
                                                    If this was not you, kindly ignore this email.</p>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td align="center" style="padding: 0;">
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td align="center"
                                                            style="border-radius: 100px; background-color: #0066FF;">
                                                            <a href="#" target="_blank"
                                                                style="display: inline-block; padding: 18px 0; width: 500px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 100px;">Reset
                                                                password</a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>

                                    </table>

                                </td>
                            </tr>

                            <tr>
                                <td style="height: 80px;"></td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>
        </body>

        </html>
        `

        const sendMail = await MailService.sendMail(client.client.email, "Password Reset", null, html, attachments)

        if (!sendMail.success) {
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

    async getTenantClients(tenantId) {
        console.log(tenantId)
        const clients = await this.clientTenantRepository.findAllAndPopulate({ tenantId }, { client: { include: { payer: true } }, clinicians: true });
        if (!clients) {
            throw new Error("clients not found")
        }

        return clients;
    }

    async getSingleClient(clientId) {
        const client = await this.clientTenantRepository.findFirstDynamic({
            where: {
                clientId: clientId
            },
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

        return client;
    }
}

export default ClientService;