import cron from "node-cron";
import SubscriptionInvoiceJob from "./jobs/subscriptionInvoiceJob.js";
import DueAppointmentNotificationJob from "./jobs/dueAppointmentNotificationJob.js";
import InvoiceManagementJob from "./jobs/invoiceManagementJob.js";
import PaymentCollectionJob from "./jobs/paymentCollectionJob.js";
import DistributedLockClient from "./distributedLockClient.js";

class CronScheduler {
    constructor({
        cronService = cron,
        subscriptionInvoiceJob = new SubscriptionInvoiceJob(),
        dueAppointmentNotificationJob = new DueAppointmentNotificationJob(),
        invoiceManagementJob = new InvoiceManagementJob(),
        paymentCollectionJob = new PaymentCollectionJob(),
        lockClient = new DistributedLockClient(),
    } = {}) {
        this.cronService = cronService;
        this.subscriptionInvoiceJob = subscriptionInvoiceJob;
        this.dueAppointmentNotificationJob = dueAppointmentNotificationJob;
        this.invoiceManagementJob = invoiceManagementJob;
        this.paymentCollectionJob = paymentCollectionJob;
        this.lockClient = lockClient;
        this.subscriptionInvoiceTask = null;
        this.dueAppointmentNotificationTask = null;
        this.invoiceManagementTask = null;
        this.paymentCollectionTask = null;
    }

    async runLocked(name, job) {
        try {
            await this.lockClient.withLock(name, () => job.run());
        } catch (error) {
            console.error(`Cron job ${name} was not run because distributed locking failed:`, error);
        }
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
            () => this.runLocked("subscription-invoice-job", this.subscriptionInvoiceJob),
            {
                timezone: process.env.CRON_TIMEZONE || "UTC",
                noOverlap: true,
                name: "subscription-invoice-job",
            },
        );

        this.dueAppointmentNotificationTask = this.cronService.schedule(
            process.env.DUE_APPOINTMENT_NOTIFICATION_CRON || "* * * * *",
            () => this.runLocked("due-appointment-notification-job", this.dueAppointmentNotificationJob),
            {
                timezone: process.env.CRON_TIMEZONE || "UTC",
                noOverlap: true,
                name: "due-appointment-notification-job",
            },
        );

        this.invoiceManagementTask = this.cronService.schedule(
            process.env.INVOICE_MANAGEMENT_CRON || "15 0 * * *",
            () => this.runLocked("invoice-management-job", this.invoiceManagementJob),
            {
                timezone: process.env.CRON_TIMEZONE || "UTC",
                noOverlap: true,
                name: "invoice-management-job",
            },
        );

        this.paymentCollectionTask = this.cronService.schedule(
            process.env.PAYMENT_COLLECTION_CRON || "30 0 * * *",
            () => this.runLocked("payment-collection-job", this.paymentCollectionJob),
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
