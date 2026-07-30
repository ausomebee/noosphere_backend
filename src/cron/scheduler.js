import cron from "node-cron";
import SubscriptionInvoiceJob from "./jobs/subscriptionInvoiceJob.js";
import DueAppointmentNotificationJob from "./jobs/dueAppointmentNotificationJob.js";

class CronScheduler {
    constructor({
        cronService = cron,
        subscriptionInvoiceJob = new SubscriptionInvoiceJob(),
        dueAppointmentNotificationJob = new DueAppointmentNotificationJob(),
    } = {}) {
        this.cronService = cronService;
        this.subscriptionInvoiceJob = subscriptionInvoiceJob;
        this.dueAppointmentNotificationJob = dueAppointmentNotificationJob;
        this.subscriptionInvoiceTask = null;
        this.dueAppointmentNotificationTask = null;
    }

    start() {
        if (this.subscriptionInvoiceTask && this.dueAppointmentNotificationTask) {
            return {
                subscriptionInvoiceTask: this.subscriptionInvoiceTask,
                dueAppointmentNotificationTask: this.dueAppointmentNotificationTask,
            };
        }

        this.subscriptionInvoiceTask = this.cronService.schedule(
            process.env.SUBSCRIPTION_INVOICE_CRON || "5 0 * * *",
            () => this.subscriptionInvoiceJob.run(),
            {
                timezone: process.env.CRON_TIMEZONE || "UTC",
                noOverlap: true,
                name: "subscription-invoice-job",
            },
        );

        this.dueAppointmentNotificationTask = this.cronService.schedule(
            process.env.DUE_APPOINTMENT_NOTIFICATION_CRON || "* * * * *",
            () => this.dueAppointmentNotificationJob.run(),
            {
                timezone: process.env.CRON_TIMEZONE || "UTC",
                noOverlap: true,
                name: "due-appointment-notification-job",
            },
        );

        console.log("✅ Cron scheduler initialized");
        return {
            subscriptionInvoiceTask: this.subscriptionInvoiceTask,
            dueAppointmentNotificationTask: this.dueAppointmentNotificationTask,
        };
    }
}

const cronScheduler = new CronScheduler();

export { CronScheduler };
export default cronScheduler;
