import prismaService from "../../config/prisma.js";
import SocketService from "../../config/socket.js";
import NotificationsRepository from "../../features/notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../features/notifications/application/notificationsService.js";
import ClientNotificationEmitter from "../../features/client/application/clientNotificationEmitter.js";
import { NotificationEntityType, NotificationType } from "../../features/notifications/domain/notificationTypes.js";

class DueAppointmentNotificationJob {
    constructor({ prisma = prismaService.getClient() } = {}) {
        this.prisma = prisma;
        this.notificationService = new NotificationService({
            notificationRepository: new NotificationsRepository(this.prisma.notification),
        });
        this.clientNotificationEmitter = new ClientNotificationEmitter({
            prisma: this.prisma,
            notificationService: this.notificationService,
        });
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    parseAppointmentStart(appointment) {
        const timeValue = String(appointment.startTime || "").trim();
        if (!timeValue) return null;

        const normalizedTime = /^\d{2}:\d{2}$/.test(timeValue)
            ? `${timeValue}:00`
            : timeValue;

        const date = new Date(`${appointment.date}T${normalizedTime}`);
        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return date;
    }

    async hasSentNotification(appointmentId, type) {
        const exists = await this.prisma.notification.findFirst({
            where: {
                entityType: NotificationEntityType.APPOINTMENT,
                entityId: String(appointmentId),
                type,
            },
            select: { id: true },
        });

        return Boolean(exists);
    }

    async notifyClient(appointment) {
        if (await this.hasSentNotification(appointment.id, NotificationType.APPOINTMENT_ABOUT_TO_START)) {
            return false;
        }

        await this.clientNotificationEmitter.emit({
            clientId: appointment.clientId,
            tenantId: appointment.tenantId,
            type: NotificationType.APPOINTMENT_ABOUT_TO_START,
            title: "Appointment Due",
            content: "Your appointment is due to start now.",
            entityType: NotificationEntityType.APPOINTMENT,
            entityId: appointment.id,
            metadata: {
                date: appointment.date,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
            },
        });

        return true;
    }

    async notifyStaff(appointment) {
        if (await this.hasSentNotification(appointment.id, NotificationType.APPOINTMENT_START_REMINDER)) {
            return false;
        }

        const staffRecipients = (appointment.clinicians || []).map((clinician) => ({
            userId: clinician.id,
            userType: "TENANT_STAFF",
        }));

        if (staffRecipients.length === 0) {
            return false;
        }

        const clientName = `${appointment.client?.firstName || ""} ${appointment.client?.lastName || ""}`.trim() || "a client";

        await this.notificationService.dispatch({
            recipients: staffRecipients,
            type: NotificationType.APPOINTMENT_START_REMINDER,
            title: "Appointment Due",
            content: `Appointment with ${clientName} is due to start now.`,
            entityType: NotificationEntityType.APPOINTMENT,
            entityId: appointment.id,
            metadata: {
                tenantId: appointment.tenantId,
                clientId: appointment.clientId,
                date: appointment.date,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
            },
        }, SocketService.emitToUser.bind(SocketService));

        return true;
    }

    async run(now = new Date()) {
        const windowStart = new Date(now);
        windowStart.setSeconds(0, 0);

        const windowEnd = new Date(windowStart.getTime() + 60 * 1000);

        const dateCandidates = [...new Set([
            this.formatDate(windowStart),
            this.formatDate(windowEnd),
        ])];

        const appointments = await this.prisma.appointment.findMany({
            where: {
                isCanceled: false,
                date: { in: dateCandidates },
            },
            include: {
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                clinicians: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        const dueAppointments = appointments.filter((appointment) => {
            const startDate = this.parseAppointmentStart(appointment);
            if (!startDate) return false;
            return startDate >= windowStart && startDate < windowEnd;
        });

        const summary = {
            scanned: appointments.length,
            due: dueAppointments.length,
            clientNotified: 0,
            staffNotified: 0,
            failed: 0,
        };

        for (const appointment of dueAppointments) {
            try {
                if (await this.notifyClient(appointment)) {
                    summary.clientNotified += 1;
                }

                if (await this.notifyStaff(appointment)) {
                    summary.staffNotified += 1;
                }
            } catch (error) {
                summary.failed += 1;
                console.error(`Due appointment notification failed for ${appointment.id}:`, error);
            }
        }

        if (summary.due > 0 || summary.failed > 0) {
            console.log("Due appointment notification job completed:", summary);
        }

        return summary;
    }
}

export default DueAppointmentNotificationJob;
