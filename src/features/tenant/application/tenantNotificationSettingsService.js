class TenantNotificationSettingsService {
    constructor({ tenantNotificationSettingsRepository }) {
        this.tenantNotificationSettingsRepository = tenantNotificationSettingsRepository;
    }

    async getNotificationSettings(userId) {
        let record = await this.tenantNotificationSettingsRepository.findByUserId(userId);

        if (record.length === 0) {
            const defaultSettings = [
                {
                    key: "CALENDAR_APPOINTMENTS",
                    label: "CALENDAR & APPOINTMENTS",
                    items: [
                        { key: "upcoming_appointments", label: "Upcoming appointments" },
                        { key: "canceled_appointments", label: "Canceled appointments" },
                        { key: "appointment_reschedule_requests", label: "Appointment reschedule requests" },
                        { key: "completed_appointments", label: "Completed appointments" },
                        { key: "approved_reschedule_requests", label: "Approved reschedule requests" },
                        { key: "appointment_start_alerts", label: "Appointment start alerts" },
                    ],
                },
                {
                    key: "CLIENT_MANAGEMENT",
                    label: "CLIENT MANAGEMENT",
                    items: [
                        { key: "document_request_completion_alerts", label: "Document request completion alerts" },
                        { key: "clinical_report_approval_requests", label: "Clinical report approval requests" },
                        { key: "form_completion_alerts", label: "Form completion alerts" },
                        { key: "clinical_report_approval_alerts_supervisor", label: "Clinical report approval alerts (supervisor)" },
                        { key: "authorization_creation_alerts", label: "Authorization creation alerts" },
                        { key: "clinical_report_approval_alerts_client", label: "Clinical report approval alerts (client)" },
                        { key: "authorization_expiry_alerts", label: "Authorization expiry alerts" },
                        { key: "clinical_report_change_request_alerts_supervisor", label: "Clinical report change request alerts (supervisor)" },
                        { key: "authorization_utilization_alerts", label: "Authorization utilization alerts" },
                        { key: "clinical_report_change_request_alerts_clients", label: "Clinical report change request alerts (clients)" },
                    ],
                },
                {
                    key: "ORGANIZATION_MANAGEMENT",
                    label: "ORGANIZATION MANAGEMENT",
                    items: [
                        { key: "organization_license_expiry_alerts", label: "Organization license expiry alerts" },
                    ],
                },
                {
                    key: "BILLING_PAYMENTS",
                    label: "BILLING & PAYMENTS",
                    items: [
                        { key: "timesheet_creation_alerts", label: "Timesheet creation alerts" },
                        { key: "timesheet_change_request_alerts", label: "Timesheet change request alerts" },
                        { key: "timesheet_approval_alerts", label: "Timesheet approval alerts" },
                        { key: "timesheet_rejection_alerts", label: "Timesheet rejection alerts" },
                        { key: "payer_authorization_expiry_alerts", label: "Payer authorization expiry alerts" },
                    ],
                },
                {
                    key: "PAYROLL_MANAGEMENT",
                    label: "PAYROLL MANAGEMENT",
                    items: [
                        { key: "upcoming_payroll_alerts", label: "Upcoming payroll alerts" },
                        { key: "payroll_review_alerts", label: "Payroll review alerts" },
                    ],
                },
                {
                    key: "HELP_SUPPORT",
                    label: "HELP & SUPPORT",
                    items: [
                        { key: "ticket_submission_alert", label: "Ticket submission alert" },
                        { key: "ticket_status_change_alerts", label: "Ticket status change alerts" },
                        { key: "ticket_withdrawal_alerts", label: "Ticket withdrawal alerts" },
                    ],
                },
            ];

            record = await this.tenantNotificationSettingsRepository.upsert({
                userId,
                settings: defaultSettings
            });
        }

        return record.settings;
    }

    async saveNotificationSettings(userId, settings) {
        const existing = await this.tenantNotificationSettingsRepository.findByUserId(userId);

        const record = await this.tenantNotificationSettingsRepository.upsert({
            userId,
            settings
        });

        if (!record) {
            throw new Error("Failed to save notification settings");
        }

        return {
            record,
            isNew: !existing
        };
    }
}

export default TenantNotificationSettingsService;