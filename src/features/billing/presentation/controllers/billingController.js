import expressAsyncHandler from "express-async-handler";
import BillingService from "../../application/billingService.js";
import Billing from "../../domain/billing.js";
import prismaService from "../../../../config/prisma.js";
import TransactionRepository from "../../infrastructure/transactionsRepository.js";
import BillingRepository from "../../infrastructure/billingRepository.js";
import PaymentRepository from "../../infrastructure/paymentRepository.js";
import PaymentMethodRepository from "../../infrastructure/paymentMethodRepository.js";

class BillingController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.transactionsRepository = new TransactionRepository(this.prisma.transactions);
        this.billingRepository = new BillingRepository(this.prisma.billingMetadata);
        this.paymentRepository = new PaymentRepository(this.prisma.payment);
        this.paymentMethodRepository = new PaymentMethodRepository(this.prisma.paymentMethod);
        this.service = new BillingService({
            transactionsRepository: this.transactionsRepository,
            billingRepository: this.billingRepository,
            paymentRepository: this.paymentRepository,
            paymentMethodRepository: this.paymentMethodRepository
        });
    }

    createBillingMetadata = expressAsyncHandler(async (req, res) => {
        const billingData = new Billing(req.body);
        const billing = await this.service.createBillingMetadata(billingData.createBillingMetadata);

        if (!billing) {
            res.status(500).json({ message: 'Failed to create Billing Metadata' });
        }

        return res.status(201).json({
            message: "Billing Metadata created successfully",
            status: 'ok',
            data: billing
        });
    });

    updateBillingMetadata = expressAsyncHandler(async (req, res) => {
        const billing = await this.service.updateBillingMetadata(req.body);

        if (!billing) {
            res.status(500).json({ message: 'Failed to update Billing Metadata' });
        }

        return res.status(201).json({
            message: "Billing Metadata updated successfully",
            status: 'ok',
            data: billing
        });
    });

    getSingleBillingMetadata = expressAsyncHandler(async (req, res) => {
        const billing = await this.service.getSingleBillingMetadata(req.params);

        if (!billing) {
            res.status(500).json({ message: 'Failed to fetch Billing Metadata' });
        }

        return res.status(201).json({
            message: "Billing Metadata fetched successfully",
            status: 'ok',
            data: billing
        });
    });

    getAllBillingMetadata = expressAsyncHandler(async (req, res) => {
        const billing = await this.service.getAllBillingMetadata();

        if (!billing) {
            res.status(500).json({ message: 'Failed to fetch Billing Metadata' });
        }

        return res.status(201).json({
            message: "Billing Metadata fetched successfully",
            status: 'ok',
            data: billing
        });
    });

    createTransaction = expressAsyncHandler(async (req, res) => {
        const transactionData = new Billing(req.body);
        const transaction = await this.service.createTransaction(transactionData.createTransaction);

        if (!transaction) {
            res.status(500).json({ message: 'Failed to create transaction' });
        }

        return res.status(201).json({
            message: "Transaction created successfully",
            status: 'ok',
            data: transaction
        });
    });

    // updateTransaction = expressAsyncHandler(async (req, res) => {
    //     const transaction = await this.service.updateTransaction(req.body);

    //     if (!transaction) {
    //         res.status(500).json({ message: 'Failed to update transaction' });
    //     }

    //     return res.status(201).json({
    //         message: "Transaction updated successfully",
    //         status: 'ok',
    //         data: transaction
    //     });
    // });

    getSingleTransaction = expressAsyncHandler(async (req, res) => {
        const transaction = await this.service.getSingleTransaction(req.params);

        if (!transaction) {
            res.status(500).json({ message: 'Failed to fetch transaction' });
        }

        return res.status(201).json({
            message: "Transaction fetched successfully",
            status: 'ok',
            data: transaction
        });
    });

    getAllTransaction = expressAsyncHandler(async (req, res) => {
        const transaction = await this.service.getAllTransaction();

        if (!transaction) {
            res.status(500).json({ message: 'Failed to fetch transactions' });
        }

        return res.status(201).json({
            message: "Transactions fetched successfully",
            status: 'ok',
            data: transaction
        });
    });

    createPayment = expressAsyncHandler(async (req, res) => {
        const paymentData = new Billing(req.body);
        const payment = await this.service.createPayment(paymentData.createPayment);

        if (!payment) {
            res.status(500).json({ message: 'Failed to create payment' });
        }

        return res.status(201).json({
            message: "Payment created successfully",
            status: 'ok',
            data: payment
        });
    });

    updatePayment = expressAsyncHandler(async (req, res) => {
        const payment = await this.service.updatePayment(req.body);

        if (!payment) {
            res.status(500).json({ message: 'Failed to update payment' });
        }

        return res.status(201).json({
            message: "Payment updated successfully",
            status: 'ok',
            data: payment
        });
    });

    getSinglePayment = expressAsyncHandler(async (req, res) => {
        const payment = await this.service.getSinglePayment(req.params);

        if (!payment) {
            res.status(500).json({ message: 'Failed to fetch payment' });
        }

        return res.status(201).json({
            message: "Payment fetched successfully",
            status: 'ok',
            data: payment
        });
    });

    getAllPayment = expressAsyncHandler(async (req, res) => {
        const payment = await this.service.getAllPayment();

        if (!payment) {
            res.status(500).json({ message: 'Failed to fetch payment' });
        }

        return res.status(201).json({
            message: "Payment fetched successfully",
            status: 'ok',
            data: payment
        });
    });

    getPaymentByStatus = expressAsyncHandler(async (req, res) => {
        const payment = await this.service.getPaymentByStatus(req.params.status);

        if (!payment) {
            res.status(500).json({ message: 'Failed to fetch payment' });
        }

        return res.status(201).json({
            message: "Payment fetched successfully",
            status: 'ok',
            data: payment
        });
    });

    createPaymentMethod = expressAsyncHandler(async (req, res) => {
        const paymentData = new Billing(req.body);
        const payment = await this.service.createPaymentMethod(paymentData.createPaymentMethod);

        if (!payment) {
            res.status(500).json({ message: 'Failed to create payment method' });
        }

        return res.status(201).json({
            message: "Payment method created successfully",
            status: 'ok',
            data: payment
        });
    });
}

export default BillingController;