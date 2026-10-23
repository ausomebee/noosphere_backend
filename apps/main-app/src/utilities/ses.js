import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { readFile } from "node:fs/promises";

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

    sanitizeHeader(value) {
        if (!value) return '';
        return String(value).replace(/[\r\n]/g, '');
    }

    get fromAddress() {
        const from = process.env.SES_FROM_EMAIL || process.env.MAIL_USER;
        if (!from) throw new Error("SES_FROM_EMAIL (or MAIL_USER) is not configured");
        return this.sanitizeHeader(from);
    }

    async sendMail(to, subject, text, html = null, attachments = null) {
        const recipients = Array.isArray(to) ? to : [to];
        try {
            this.validateEmails(recipients);
            const fromAddress = this.fromAddress;
            let content;
            if (attachments?.length) {
                const raw = await this.buildRawMimeEmail({ fromAddress, to: recipients, subject, text, html, attachments });
                content = { Raw: { Data: raw } };
            } else {
                content = {
                    Simple: {
                        Subject: { Data: this.sanitizeHeader(subject) },
                        Body: {
                            Html: html ? { Data: html } : undefined,
                            Text: text ? { Data: text } : undefined
                        }
                    }
                };
            }

            const response = await this.client.send(new SendEmailCommand({
                FromEmailAddress: `"Noosphere" <${fromAddress}>`,
                Destination: { ToAddresses: recipients },
                Content: content
            }));
            return { success: true, messageId: response.MessageId };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async buildRawMimeEmail({ fromAddress, to, subject, text, html, attachments }) {
        const boundary = `Noosphere_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const altBoundary = `Alt_${boundary}`;
        const parts = [
            `From: "Noosphere" <${this.sanitizeHeader(fromAddress)}>`,
            `To: ${to.map(email => this.sanitizeHeader(email)).join(", ")}`,
            `Subject: ${this.encodeMimeHeader(subject)}`,
            "MIME-Version: 1.0",
            `Content-Type: multipart/mixed; boundary="${boundary}"`,
            "",
            `--${boundary}`,
            `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
            "",
            `--${altBoundary}`,
            'Content-Type: text/plain; charset="UTF-8"',
            "Content-Transfer-Encoding: base64",
            "",
            this.splitBase64(Buffer.from(text || "").toString("base64")),
            `--${altBoundary}`,
            'Content-Type: text/html; charset="UTF-8"',
            "Content-Transfer-Encoding: base64",
            "",
            this.splitBase64(Buffer.from(html || "").toString("base64")),
            `--${altBoundary}--`
        ];

        for (const attachment of attachments) {
            const content = attachment.content ?? (attachment.path ? await readFile(attachment.path) : null);
            if (!content) throw new Error(`Attachment ${attachment.filename || "(unnamed)"} has no content or path`);
            const data = Buffer.isBuffer(content) ? content : Buffer.from(content);
            const filename = this.sanitizeHeader(attachment.filename || "attachment").replace(/[\"\\]/g, "_");
            const mimeType = this.sanitizeHeader(attachment.contentType || "application/octet-stream");
            parts.push(
                `--${boundary}`,
                `Content-Type: ${mimeType}; name="${filename}"`,
                `Content-Disposition: ${attachment.cid ? "inline" : "attachment"}; filename="${filename}"`,
                "Content-Transfer-Encoding: base64",
                ...(attachment.cid ? [`Content-ID: <${this.sanitizeHeader(attachment.cid)}>`] : []),
                "",
                this.splitBase64(data.toString("base64"))
            );
        }
        parts.push(`--${boundary}--`, "");
        return Buffer.from(parts.join("\r\n"));
    }

    encodeMimeHeader(value) {
        const sanitized = this.sanitizeHeader(value);
        return /^[\x20-\x7E]*$/.test(sanitized)
            ? sanitized
            : `=?UTF-8?B?${Buffer.from(sanitized).toString("base64")}?=`;
    }

    splitBase64(base64String, lineLength = 76) {
        const regex = new RegExp(`.{1,${lineLength}}`, 'g');
        return base64String.match(regex)?.join('\r\n') || '';
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateEmails(emails) {
        if (!Array.isArray(emails) || emails.length === 0) {
            throw new Error('Email recipients must be a non-empty array');
        }

        emails.forEach(email => {
            if (!this.validateEmail(email)) {
                throw new Error(`Invalid email address: ${email}`);
            }
        });
    }
 
    buildRawEmail({
        from,
        to,
        subject,
        html,
        text,
        replyTo,
        attachmentBuffer,
        attachmentName = "clinical-report.pdf",
        attachmentMimeType = "application/pdf"
    }) {
        // Generate unique boundaries
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const boundary = `NextPart_${timestamp}_${random}`;
        const altBoundary = `ALT-${boundary}`;

        // Encode attachment and split into lines
        const base64Pdf = this.splitBase64(attachmentBuffer.toString("base64"));

        // Sanitize all header values
        const sanitizedFrom = this.sanitizeHeader(from);
        const sanitizedSubject = this.sanitizeHeader(subject);
        const sanitizedReplyTo = replyTo ? this.sanitizeHeader(replyTo) : null;
        const sanitizedAttachmentName = this.sanitizeHeader(attachmentName);

        // Build MIME message
        const message =
            `From: ${sanitizedFrom}\r\n` +
            `To: ${to.map(email => this.sanitizeHeader(email)).join(", ")}\r\n` +
            (sanitizedReplyTo ? `Reply-To: ${sanitizedReplyTo}\r\n` : '') +
            `Subject: ${sanitizedSubject}\r\n` +
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
            `Content-Type: ${attachmentMimeType}; name="${sanitizedAttachmentName}"\r\n` +
            `Content-Disposition: attachment; filename="${sanitizedAttachmentName}"\r\n` +
            `Content-Transfer-Encoding: base64\r\n` +
            `\r\n` +
            `${base64Pdf}\r\n` +
            `\r\n` +

            `--${boundary}--\r\n`;

        return Buffer.from(message);
    }

    async sendTenantEmail({ tenantSlug, to, subject, html, text, replyTo }) {
        // Validate email addresses
        this.validateEmails(to);

        const fromAddress = this.fromAddress;

        const command = new SendEmailCommand({
            FromEmailAddress: `"Noosphere" <${fromAddress}>`,
            Destination: {
                ToAddresses: to
            },
            ReplyToAddresses: replyTo ? [replyTo] : [fromAddress],
            Content: {
                Simple: {
                    Subject: { Data: this.sanitizeHeader(subject) },
                    Body: {
                        Html: html ? { Data: html } : undefined,
                        Text: text ? { Data: text } : undefined
                    }
                }
            }
        });

        try {
            const response = await this.client.send(command);

            console.log('Email sent successfully', {
                messageId: response.MessageId,
                from: fromAddress,
                to: to,
                subject: subject
            });

            return {
                messageId: response.MessageId,
                from: fromAddress,
                to
            };
        } catch (error) {
            console.error("SES email send failed:", {
                error: error.message,
                code: error.code || error.name,
                from: fromAddress,
                to: to,
                subject: subject
            });
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
        attachmentName,
        attachmentMimeType
    }) {
        // Validate email addresses
        this.validateEmails(to);

        // Validate attachment
        if (!attachmentBuffer || !Buffer.isBuffer(attachmentBuffer)) {
            throw new Error('Attachment buffer is required and must be a Buffer');
        }

        // Check attachment size (AWS SES limit is 10MB for raw messages)
        const attachmentSizeMB = attachmentBuffer.length / (1024 * 1024);
        if (attachmentSizeMB > 10) {
            throw new Error(`Attachment size (${attachmentSizeMB.toFixed(2)}MB) exceeds 10MB limit`);
        }

        const fromAddress = this.fromAddress;
        const from = `"Noosphere" <${fromAddress}>`;

        const rawMessage = this.buildRawEmail({
            from,
            to,
            subject,
            html,
            text,
            replyTo,
            attachmentBuffer,
            attachmentName,
            attachmentMimeType
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

            console.log('Email with attachment sent successfully', {
                messageId: response.MessageId,
                from: fromAddress,
                to: to,
                subject: subject,
                attachmentName: attachmentName,
                attachmentSize: `${attachmentSizeMB.toFixed(2)}MB`
            });

            return {
                messageId: response.MessageId,
                from: fromAddress,
                to
            };
        } catch (error) {
            console.error("SES raw email send failed:", {
                error: error.message,
                code: error.code || error.name,
                from: fromAddress,
                to: to,
                subject: subject,
                attachmentName: attachmentName
            });
            throw error;
        }
    }

    /**
     * Send email with retry logic
     */
    async sendWithRetry(sendFunction, maxRetries = 3, initialDelay = 1000) {
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await sendFunction();
            } catch (error) {
                lastError = error;

                // Don't retry on client errors (4xx)
                if (error.code && error.code.startsWith('4')) {
                    throw error;
                }

                if (attempt < maxRetries) {
                    const delay = initialDelay * Math.pow(2, attempt - 1); // Exponential backoff
                    console.log(`Retry attempt ${attempt} after ${delay}ms`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    console.error(`All ${maxRetries} retry attempts failed`);
                }
            }
        }

        throw lastError;
    }
}

const emailService = new EmailService();
export default emailService;
