import cron from "node-cron";
import SubscriptionInvoiceJob from "./jobs/subscriptionInvoiceJob.js";
import DueAppointmentNotificationJob from "./jobs/dueAppointmentNotificationJob.js";
import InvoiceManagementJob from "./jobs/invoiceManagementJob.js";
import PaymentCollectionJob from "./jobs/paymentCollectionJob.js";

class CronScheduler {
    constructor({
        cronService = cron,
        subscriptionInvoiceJob = new SubscriptionInvoiceJob(),
        dueAppointmentNotificationJob = new DueAppointmentNotificationJob(),
        invoiceManagementJob = new InvoiceManagementJob(),
        paymentCollectionJob = new PaymentCollectionJob(),
    } = {}) {
        this.cronService = cronService;
        this.subscriptionInvoiceJob = subscriptionInvoiceJob;
        this.dueAppointmentNotificationJob = dueAppointmentNotificationJob;
        this.invoiceManagementJob = invoiceManagementJob;
        this.paymentCollectionJob = paymentCollectionJob;
        this.subscriptionInvoiceTask = null;
        this.dueAppointmentNotificationTask = null;
        this.invoiceManagementTask = null;
        this.paymentCollectionTask = null;
    }

    start() {
        if (
            this.subscriptionInvoiceTask
            && this.dueAppointmentNotificationTask
            && this.invoiceManagementTask
            && this.paymentCollectionTask
        ) {
            return {
                subscriptionInvoiceTask: this.subscriptionInvoiceTask,
                dueAppointmentNotificationTask: this.dueAppointmentNotificationTask,
                invoiceManagementTask: this.invoiceManagementTask,
                paymentCollectionTask: this.paymentCollectionTask,
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

        this.invoiceManagementTask = this.cronService.schedule(
            process.env.INVOICE_MANAGEMENT_CRON || "15 0 * * *",
            () => this.invoiceManagementJob.run(),
            {
                timezone: process.env.CRON_TIMEZONE || "UTC",
                noOverlap: true,
                name: "invoice-management-job",
            },
        );

        this.paymentCollectionTask = this.cronService.schedule(
            process.env.PAYMENT_COLLECTION_CRON || "30 0 * * *",
            () => this.paymentCollectionJob.run(),
            {
                timezone: process.env.CRON_TIMEZONE || "UTC",
                noOverlap: true,
                name: "payment-collection-job",
            },
        );

        console.log("✅ Cron scheduler initialized");
        return {
            subscriptionInvoiceTask: this.subscriptionInvoiceTask,
            dueAppointmentNotificationTask: this.dueAppointmentNotificationTask,
            invoiceManagementTask: this.invoiceManagementTask,
            paymentCollectionTask: this.paymentCollectionTask,
        };
    }
}

const cronScheduler = new CronScheduler();

export { CronScheduler };
export default cronScheduler;
