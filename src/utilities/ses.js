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

    buildRawEmail({
        from,
        to,
        subject,
        html,
        text,
        attachmentBuffer,
        attachmentName = "clinical-report.pdf"
    }) {
        const boundary = `NextPart_${Date.now()}`;
        const altBoundary = `ALT-${boundary}`;

        const base64Pdf = attachmentBuffer.toString("base64");

        const message =
            `From: ${from}\r\n` +
            `To: ${to.join(", ")}\r\n` +
            `Subject: ${subject}\r\n` +
            `MIME-Version: 1.0\r\n` +
            `Content-Type: multipart/mixed; boundary="${boundary}"\r\n` +
            `\r\n` +

            `--${boundary}\r\n` +
            `Content-Type: multipart/alternative; boundary="${altBoundary}"\r\n` +
            `\r\n` +

            `--${altBoundary}\r\n` +
            `Content-Type: text/plain; charset="UTF-8"\r\n` +
            `Content-Transfer-Encoding: 7bit\r\n` +
            `\r\n` +
            `${text || ""}\r\n` +
            `\r\n` +

            `--${altBoundary}\r\n` +
            `Content-Type: text/html; charset="UTF-8"\r\n` +
            `Content-Transfer-Encoding: 7bit\r\n` +
            `\r\n` +
            `${html || ""}\r\n` +
            `\r\n` +

            `--${altBoundary}--\r\n` +
            `\r\n` +

            `--${boundary}\r\n` +
            `Content-Type: application/pdf; name="${attachmentName}"\r\n` +
            `Content-Disposition: attachment; filename="${attachmentName}"\r\n` +
            `Content-Transfer-Encoding: base64\r\n` +
            `\r\n` +
            `${base64Pdf}\r\n` +
            `\r\n` +

            `--${boundary}--\r\n`;

        return Buffer.from(message);
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

    async sendTenantEmailWithAttachment({
        tenantSlug,
        to,
        subject,
        html,
        text,
        replyTo,
        attachmentBuffer,
        attachmentName
    }) {
        const fromAddress = `${tenantSlug}@noospherehub.net`;
        const from = `"${this.formatTenantName(tenantSlug)}" <${fromAddress}>`;

        const rawMessage = this.buildRawEmail({
            from,
            to,
            subject,
            html,
            text,
            attachmentBuffer,
            attachmentName
        });

        const command = new SendEmailCommand({
            FromEmailAddress: from,
            Destination: {
                ToAddresses: to
            },
            ReplyToAddresses: replyTo ? [replyTo] : [fromAddress],
            Content: {
                Raw: {
                    Data: rawMessage
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
            console.error("SES raw email send failed:", error);
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