import Billing from "../domain/billing.js";

class BillingService {
    constructor({ transactionsRepository, billingRepository, paymentRepository, paymentMethodRepository }) {
        this.transactionsRepository = transactionsRepository;
        this.billingRepository = billingRepository;
        this.paymentRepository = paymentRepository;
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
        const payments = await this.paymentRepository.findAll(query);

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
}

export default BillingService;