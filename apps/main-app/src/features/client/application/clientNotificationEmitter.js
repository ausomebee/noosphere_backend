import SocketService from "../../../config/socket.js";

const CLIENT_EVENT_TO_SETTING_KEY = Object.freeze({
    APPOINTMENT_SCHEDULED: "appointmentScheduled",
    APPOINTMENT_ABOUT_TO_START: "appointmentAboutToStart",
    APPOINTMENT_RESCHEDULED: "appointmentRescheduled",
    APPOINTMENT_STARTED: "appointmentStarted",
    APPOINTMENT_CANCELLED: "appointmentCancelled",
    APPOINTMENT_COMPLETED_AWAITING_FEEDBACK: "appointmentCompletedAwaitingFeedback",
    DOCUMENT_REQUESTED: "documentRequested",
    DOCUMENT_REQUEST_NUDGE: "documentRequested",
    FORM_SHARED: "formShared",
    AUTHORIZATION_EXPIRY_30_DAYS: "authorizationAboutToExpire",
    AUTHORIZATION_EXPIRY_7_DAYS: "authorizationAboutToExpire",
    AUTHORIZATION_EXPIRED: "authorizationExpired",
    AUTHORIZATION_UNITS_ALMOST_EXHAUSTED: "authorizationUnitsAlmostExhausted",
    AUTHORIZATION_UNITS_EXHAUSTED: "authorizationUnitsExhausted",
    SIGNATURE_REQUESTED: "signatureRequested",
});

class ClientNotificationEmitter {
    constructor({ prisma, notificationService }) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }

    async emit({ clientId, tenantId, type, title, content, entityType, entityId, metadata = {} }) {
        if (!clientId || !tenantId || !type || !title || !content || !entityType || !entityId) {
            return null;
        }

        const clientTenant = await this.prisma.clientTenant.findUnique({
            where: {
                clientId_tenantId: {
                    clientId,
                    tenantId,
                },
            },
            select: { id: true },
        });

        if (!clientTenant) {
            return null;
        }

        const settingKey = CLIENT_EVENT_TO_SETTING_KEY[type];
        if (settingKey) {
            const settings = await this.prisma.clientNotificationSettings.findUnique({
                where: { tenantClientId: clientTenant.id },
                select: { [settingKey]: true },
            });

            if (settings?.[settingKey] === false) {
                return null;
            }
        }

        const [notification] = await this.notificationService.dispatch({
            recipients: [{ userId: clientId, userType: "CLIENT" }],
            type,
            title,
            content,
            entityType,
            entityId,
            metadata: {
                tenantId,
                clientId,
                tenantClientId: clientTenant.id,
                ...metadata,
            },
        }, SocketService.emitToUser.bind(SocketService));

        return notification || null;
    }
}

export { CLIENT_EVENT_TO_SETTING_KEY };
export default ClientNotificationEmitter;
