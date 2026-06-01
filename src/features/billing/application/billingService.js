import Billing from "../domain/billing.js";

class BillingService {
    constructor({ transactionsRepository, paymentAccessRepository, billingRepository, paymentRepository, paymentMethodRepository }) {
        this.transactionsRepository = transactionsRepository;
        this.billingRepository = billingRepository;
        this.paymentRepository = paymentRepository;
        this.paymentAccessRepository = paymentAccessRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

    async createBillingMetadata(data) {
        const billingMetadataExists = await this.billingRepository.findFirstDynamic({
            where: { tenantId: data.tenantId },
            select: { tenantId: true }
        });

        if (billingMetadataExists) {
            throw new Error("This BillingMetadata already exists.");
        }

        const newBillingMetadata = await this.billingRepository.create(data);

        if (!newBillingMetadata) {
            throw new Error("Failed to create BillingMetadata");
        }

        return newBillingMetadata;
    }

    async getTenantPayments(tenantId, filter = {}, page = 1, pageSize = 10) {
        const result = await this.paymentRepository.getTenantPayments(
            tenantId,
            filter,
            page,
            pageSize
        );

        if (!result.data || result.data.length === 0) {
            throw new Error("No payments found for this tenant");
        }

        return result;
    }

    async getTenantPaymentMethods(tenantId) {
        const result = await this.paymentMethodRepository.findAll({ tenantId });

        if (!result || result.length === 0) {
            throw new Error("No payments found for this tenant");
        }

        return result;
    }

    async getAllPayments(page = 1, pageSize = 10) {
        const result = await this.paymentRepository.getAllPayments(
            page,
            pageSize
        );

        if (!result.data || result.data.length === 0) {
            throw new Error("No payments found");
        }

        return result;
    }

    async getTenantPaymentsByStatus(tenantId, status) {
        const payments =
            await this.paymentRepository.getTenantPaymentsByStatus(
                tenantId,
                status
            );

        if (!payments || payments.length === 0) {
            throw new Error(`No payments found with status ${status}`);
        }

        return payments;
    }

    async updateBillingMetadata(data) {
        const billingMetadata = await this.billingRepository.findOne({ id: data.id })

        if (!billingMetadata) {
            throw new Error("Billing Metadata not found");
        }

        const update = await this.billingRepository.update(data.id, {
            paymentMethod: data.paymentMethod || billingMetadata.paymentMethod,
            billingAddress: data.billingAddress || billingMetadata.billingAddress
        });

        if (!update) {
            throw new Error("Failed to update Billing Metadata");
        }

        return update;
    }

    async getSingleBillingMetadata(data) {
        const billingMetadata = await this.billingRepository.findOne({ id: data.id });

        if (!billingMetadata) {
            throw new Error("billingMetadata not found")
        }

        return billingMetadata;
    }

    async getAllBillingMetadata(data) {
        const billingMetadata = await this.billingRepository.findAll({});

        if (!billingMetadata) {
            throw new Error("billingMetadata not found")
        }

        return billingMetadata;
    }

    async createTransaction(data) {
        const newTransaction = await this.transactionsRepository.create(data);

        if (!newTransaction) {
            throw new Error("Failed to create Transaction");
        }

        return newTransaction;
    }

    // async updateTransaction(data) {
    //     const Transaction = await this.repository.findOneTransaction({ id: data.id })

    //     if (!Transaction) {
    //         throw new Error("Transaction not found");
    //     }

    //     const update = await this.repository.update(data.id, {
    //         paymentMethod: data.paymentMethod || Transaction.paymentMethod,
    //         billingAddress: data.billingAddress || Transaction.billingAddress
    //     });

    //     if (!update) {
    //         throw new Error("Failed to update Transaction");
    //     }

    //     return update;
    // }

    async getSingleTransaction(data) {
        const Transaction = await this.transactionsRepository.findOne({ id: data.id });

        if (!Transaction) {
            throw new Error("Transaction not found")
        }

        return Transaction;
    }

    async getAllTransaction(data) {
        const Transaction = await this.transactionsRepository.findAll({});

        if (!Transaction) {
            throw new Error("Transaction not found")
        }

        return Transaction;
    }

    async createPayment(data) {
        const paymentExists = await this.paymentRepository.findFirstDynamic({
            where: { tenantId: data.tenantId },
            select: { tenantId: true }
        });

        if (paymentExists) {
            throw new Error("This payment already exists.");
        }

        const newPayment = await this.paymentRepository.create(data);

        if (!newPayment) {
            throw new Error("Failed to create payment");
        }

        return newPayment;
    }

    async updatePayment(data) {
        const payment = await this.paymentRepository.findOne({ id: data.id })

        if (!payment) {
            throw new Error("payment not found");
        }

        const update = await this.paymentRepository.update(data.id, {
            paymentLink: data.paymentLink || payment.paymentLink
        });

        if (!update) {
            throw new Error("Failed to update payment");
        }

        return update;
    }

    async getSinglePayment(data) {
        const payment = await this.paymentRepository.findFirstDynamic({ where: { id: data.id }, include: { tenant: true, invoice: { include: { plan: true } }, paymentMethod: true, subscription: true } });
        const paymentOutput = new Billing(payment);

        if (!payment) {
            throw new Error("Payment not found")
        }

        return paymentOutput.paymentOutput;
    }

    async getAllPayment() {
        const payment = await this.paymentRepository.findAll({});

        if (!payment) {
            throw new Error("Payment not found")
        }

        return payment;
    }

    async getPaymentByStatus(status) {
        const query = status === "all" ? {} : { status }
        const payments = await this.paymentRepository.findAllAndPopulate(query);

        if (!payments) {
            throw new Error("Payments not found")
        }

        return payments;
    }

    async createPaymentMethod(data) {
        const newPaymentMethod = await this.paymentMethodRepository.create(data);

        if (!newPaymentMethod) {
            throw new Error("Failed to create payment method");
        }

        return newPaymentMethod;
    }

    async getTotalPaymentByStatus() {
        const All = await this.paymentRepository.totalCount({});
        const Failed = await this.paymentRepository.totalCount({ status: "Failed" });
        const Successful = await this.paymentRepository.totalCount({ status: "Successful" });
        const InProgress = await this.paymentRepository.totalCount({ status: "InProgress" });

        if (!All || !Failed || !Successful || !InProgress) {
            throw new Error("Failed to count payment");
        }

        return { All, Failed, Successful, InProgress };
    }

    async createPaymentAccess(data) {
        const paymentAccessExists = await this.paymentAccessRepository.findFirst({});

        if (paymentAccessExists) {
            throw new Error("Payment access already exists.");
        }

        const paymentAccessData = new Billing(data)
        const newPaymentAccess = await this.paymentAccessRepository.create(paymentAccessData.createPaymentAccess);

        if (!newPaymentAccess) {
            throw new Error("Failed to create payment");
        }

        return newPaymentAccess;
    }

    async getPaymentAccess() {
        const payment = await this.paymentAccessRepository.findFirst({});

        if (!payment) {
            const paymentAccessData = new Billing(
                {
                    "chargeOnDueDate": true,
                    "chargeLastUsedFirst": false,
                    "chargeAlternative": true,
                    "retryBefore": 2,
                    "retryAfter": 3,
                    "notifyTenant": true,
                    "notificationEmailHeader": "Payment Failed Notification",
                    "notificationEmailBody": "Your recent payment attempt failed. Please update your payment method to continue uninterrupted service.",
                    "cancelAfter": 5,
                    "manualCancel": false,
                    "suspensionAction": "SUSPEND_SERVICE",
                    "errorMessage": "Payment could not be processed due to invalid card details.",
                    "emailAfterAttempts": 3,
                    "warningMailHeader": "Warning: Payment Issue Detected",
                    "warningMailBody": "We attempted to charge your account but were unsuccessful. Please update your payment info.",
                    "sendOnSubscriptionCancel": true,
                    "cancelMailHeader": "Subscription Cancelled",
                    "cancelMailBody": "Your subscription has been cancelled due to failed payments. Contact support to reactivate."
                }
            )
            const newPaymentAccess = await this.paymentAccessRepository.create(paymentAccessData.createPaymentAccess);

            if (!newPaymentAccess) {
                throw new Error("Failed to create payment");
            }

            return newPaymentAccess;
        }

        return payment;
    }

    async updatePaymentAccess(data) {
        const paymentAccess = await this.paymentAccessRepository.findOne({ id: data.id })

        if (!paymentAccess) {
            throw new Error("Payment Access not found");
        }

        const update = await this.paymentAccessRepository.update(data.id, {
            chargeOnDueDate: data.chargeOnDueDate ?? paymentAccess.chargeOnDueDate,
            chargeLastUsedFirst: data.chargeLastUsedFirst ?? paymentAccess.chargeLastUsedFirst,
            chargeAlternative: data.chargeAlternative ?? paymentAccess.chargeAlternative,
            retryBefore: data.retryBefore || paymentAccess.retryBefore,
            retryAfter: data.retryAfter || paymentAccess.retryAfter,
            notifyTenant: data.notifyTenant ?? paymentAccess.notifyTenant,
            notificationEmailHeader: data.notificationEmailHeader || paymentAccess.notificationEmailHeader,
            notificationEmailBody: data.notificationEmailBody || paymentAccess.notificationEmailBody,
            cancelAfter: data.cancelAfter || paymentAccess.cancelAfter,
            manualCancel: data.manualCancel ?? paymentAccess.manualCancel,
            suspensionAction: data.suspensionAction || paymentAccess.suspensionAction,
            errorMessage: data.errorMessage || paymentAccess.errorMessage,
            emailAfterAttempts: data.emailAfterAttempts || paymentAccess.emailAfterAttempts,
            warningMailHeader: data.warningMailHeader || paymentAccess.warningMailHeader,
            warningMailBody: data.warningMailBody || paymentAccess.warningMailBody,
            sendOnSubscriptionCancel: data.sendOnSubscriptionCancel ?? paymentAccess.sendOnSubscriptionCancel,
            cancelMailHeader: data.cancelMailHeader || paymentAccess.cancelMailHeader,
            cancelMailBody: data.cancelMailBody || paymentAccess.cancelMailBody
        });

        if (!update) {
            throw new Error("Failed to update Payment Access");
        }

        return update;
    }
}

export default BillingService;