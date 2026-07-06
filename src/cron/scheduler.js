import cron from "node-cron";
import SubscriptionInvoiceJob from "./jobs/subscriptionInvoiceJob.js";

class CronScheduler {
    constructor({ cronService = cron, subscriptionInvoiceJob = new SubscriptionInvoiceJob() } = {}) {
        this.cronService = cronService;
        this.subscriptionInvoiceJob = subscriptionInvoiceJob;
        this.subscriptionInvoiceTask = null;
    }

    start() {
        if (this.subscriptionInvoiceTask) return this.subscriptionInvoiceTask;

        this.subscriptionInvoiceTask = this.cronService.schedule(
            process.env.SUBSCRIPTION_INVOICE_CRON || "5 0 * * *",
            () => this.subscriptionInvoiceJob.run(),
            {
                timezone: process.env.CRON_TIMEZONE || "UTC",
                noOverlap: true,
                name: "subscription-invoice-job",
            },
        );

        console.log("✅ Cron scheduler initialized");
        return this.subscriptionInvoiceTask;
    }
}

const cronScheduler = new CronScheduler();

export { CronScheduler };
export default cronScheduler;
