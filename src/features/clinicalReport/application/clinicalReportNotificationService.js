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

        return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${safe(title)}</title>
        <style type="text/css">
            body { margin: 0; padding: 0; width: 100% !important; background: #f5f5f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table { border-collapse: collapse; }
            img { border: 0; display: block; }
            @media screen and (max-width: 620px) {
                .page-padding { padding: 18px 12px !important; }
                .content-padding { padding: 28px 22px !important; }
                .brand-name { font-size: 18px !important; }
            }
        </style>
        </head>
        <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f5f5;">
            <tr>
            <td class="page-padding" align="center" style="padding:32px 18px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
                    <tr>
                        <td align="center" style="padding:0;height:60px;background:linear-gradient(90deg, #8B5CF6 0%, #EC4899 50%, #EF4444 100%);">
                            <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:60px;">
                                <v:fill type="gradient" color="#8B5CF6" color2="#EF4444" angle="90" />
                            </v:rect>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:22px 32px;background:#ffffff;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td width="42" valign="middle">
                                        <table role="presentation" width="36" height="36" cellspacing="0" cellpadding="0" border="0" style="background:linear-gradient(135deg, #8B5CF6, #EC4899);">
                                            <tr><td align="center" valign="middle" style="color:#ffffff;font-size:14px;font-weight:bold;">N</td></tr>
                                        </table>
                                    </td>
                                    <td class="brand-name" valign="middle" style="padding-left:12px;color:#1a1a1a;font-size:20px;font-weight:bold;letter-spacing:.2px;">
                                        NooSphere Clinical Reports
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-padding" style="padding:34px 40px 36px;">
                            <p style="margin:0 0 7px;color:#8B5CF6;font-size:12px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;">Clinical report update</p>
                            <h1 style="margin:0 0 18px;color:#1a1a1a;font-size:25px;line-height:1.25;font-weight:bold;">${safe(title)}</h1>
                            <p style="margin:0 0 24px;color:#666666;font-size:15px;line-height:1.7;">Hello ${safe(recipientName)},<br />${safe(content)}</p>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:8px;">
                                <tr>
                                    <td style="padding:17px 18px 8px;color:#8B5CF6;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Report requiring attention</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 18px 17px;color:#1a1a1a;font-size:16px;font-weight:bold;line-height:1.4;">${safe(reportTitle)}</td>
                                </tr>
                            </table>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:26px;">
                                <tr>
                                    <td style="background:#8B5CF6;border-radius:6px;">
                                        <span style="display:inline-block;padding:13px 22px;color:#ffffff;font-size:14px;font-weight:bold;">Review in NooSphere</span>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:24px 0 0;color:#666666;font-size:13px;line-height:1.6;">Sign in to NooSphere to review the report and take the required action.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:17px 40px;border-top:1px solid #f3f4f6;background:#fafafa;color:#9ca3af;font-size:12px;line-height:1.5;">
                            This message was sent by NooSphere Clinical Reports. Please do not reply to this automated notification.
                        </td>
                    </tr>
                </table>
            </td>
            </tr>
        </table>
        </body>
        </html>`;
    }
}

export default ClinicalReportNotificationService;
