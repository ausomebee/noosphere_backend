import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

 class EmailService {
    constructor() {
        this.client = new SESv2Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
    }

    async sendTenantEmail({ tenantSlug, to, subject, html, text, replyTo }) {
        const fromAddress = `${tenantSlug}@noospherehub.net`;

        const command = new SendEmailCommand({
            FromEmailAddress: `"${this.formatTenantName(tenantSlug)}" <${fromAddress}>`,
            Destination: {
                ToAddresses: to
            },
            ReplyToAddresses: replyTo ? [replyTo] : [fromAddress],
            Content: {
                Simple: {
                    Subject: { Data: subject },
                    Body: {
                        Html: html ? { Data: html } : undefined,
                        Text: text ? { Data: text } : undefined
                    }
                }
            }
        });

        try {
            const response = await this.client.send(command);
            return {
                messageId: response.MessageId,
                from: fromAddress,
                to
            };
        } catch (error) {
            console.error("SES email send failed:", error);
            throw error;
        }
    }

    formatTenantName(slug) {
        return slug
            .replace(/-/g, " ")
            .replace(/\b\w/g, char => char.toUpperCase());
    }
}

const emailService = new EmailService();
export default emailService;