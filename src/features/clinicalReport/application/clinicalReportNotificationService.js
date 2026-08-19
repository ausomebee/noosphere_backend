import SocketService from "../../../config/socket.js";
import emailService from "../../../utilities/ses.js";

class ClinicalReportNotificationService {
    constructor({ prisma, notificationService }) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }

    async notifyStaff({
        report,
        staffId,
        type,
        title,
        content,
        subject,
        metadata = {}
    }) {
        if (!staffId) {
            return null;
        }

        const staff = await this.prisma.tenantStaff.findUnique({
            where: { id: staffId },
            select: { id: true, fullName: true, email: true }
        });

        if (!staff) {
            return null;
        }

        const [notification] = await this.notificationService.dispatch({
            recipients: [{ userId: staff.id, userType: "TENANT_STAFF" }],
            type,
            title,
            content,
            entityType: "CLINICAL_REPORT",
            entityId: report.id,
            metadata: {
                clinicalReportId: report.id,
                ...metadata
            }
        }, SocketService.emitToUser.bind(SocketService));

        if (staff.email) {
            await emailService.sendTenantEmail({
                tenantSlug: report.tenant.subdomain,
                to: [staff.email],
                subject,
                text: `${content}\n\nReport: ${report.title}`,
                html: this.buildEmailHtml({
                    recipientName: staff.fullName,
                    title,
                    content,
                    reportTitle: report.title
                }),
                replyTo: report.tenant.email
            });
        }

        return notification || null;
    }

    buildEmailHtml({ recipientName, title, content, reportTitle }) {
        const safe = (value) => String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");

        return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${safe(title)}</title></head>
<body style="margin:0;padding:24px;background:#f4f7f8;font-family:Arial,sans-serif;color:#243746;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
<tr><td style="padding:24px 32px;background:#163b4d;color:#ffffff;font-size:20px;font-weight:bold;">Clinical Report Update</td></tr>
<tr><td style="padding:32px;">
<p style="margin:0 0 16px;font-size:16px;">Hello ${safe(recipientName)},</p>
<h1 style="margin:0 0 16px;font-size:22px;color:#163b4d;">${safe(title)}</h1>
<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#536872;">${safe(content)}</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef6f7;border-left:4px solid #5bb7b0;"><tr><td style="padding:16px;font-size:14px;color:#31515d;"><strong>Report:</strong> ${safe(reportTitle)}</td></tr></table>
<p style="margin:24px 0 0;font-size:13px;color:#7a8b92;">Please sign in to NooSphere to review this report.</p>
</td></tr></table>
</td></tr></table>
</body></html>`;
    }
}

export default ClinicalReportNotificationService;
