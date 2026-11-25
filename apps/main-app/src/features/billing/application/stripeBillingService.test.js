import assert from "node:assert/strict";
import test from "node:test";
import StripeBillingService from "./stripeBillingService.js";

test("sends a tenant payment confirmation only when a Stripe invoice is first activated", async () => {
    let invoiceStatus = "Due";
    const emailCalls = [];
    const templateCalls = [];
    const invoice = {
        id: 42,
        tenantId: "tenant-1",
        tenant: { email: "tenant@example.com", companyName: "Example Clinic" },
        plan: { name: "Standard", forStaff: 3, forClient: 5 },
        total: 120,
        billingFrequency: "Monthly",
        quantity: 1,
    };
    const tx = {
        invoice: {
            findUnique: async () => ({ status: invoiceStatus }),
            update: async ({ data }) => {
                invoiceStatus = data.status;
                return { ...invoice, ...data };
            },
        },
        paymentMethod: {
            count: async () => 0,
            create: async () => ({ id: "payment-method-1" }),
        },
        payment: {
            create: async () => ({ id: 99 }),
        },
        subscription: {
            create: async () => ({ id: "subscription-1" }),
        },
        invoiceToken: {
            updateMany: async () => ({ count: 1 }),
        },
        tenant: {
            update: async () => invoice.tenant,
        },
    };
    const service = new StripeBillingService({
        prisma: { $transaction: async (callback) => callback(tx) },
        invoiceService: null,
        mailService: {
            sendMail: async (...args) => {
                emailCalls.push(args);
                return { success: true };
            },
        },
        renderer: {
            render: async (...args) => {
                templateCalls.push(args);
                return "<html>Payment confirmation</html>";
            },
        },
    });
    const paymentIntent = {
        id: "pi_123",
        created: 1_764_000_000,
        payment_method: "pm_123",
        latest_charge: {
            payment_method_details: { card: { brand: "visa", last4: "4242" } },
        },
    };

    const firstActivation = await service.activate(invoice, "token-hash", paymentIntent);
    const duplicateActivation = await service.activate(invoice, "token-hash", paymentIntent);

    assert.equal(firstActivation.alreadyPaid, false);
    assert.equal(duplicateActivation.alreadyPaid, true);
    assert.equal(emailCalls.length, 1);
    assert.equal(emailCalls[0][0], "tenant@example.com");
    assert.equal(emailCalls[0][1], "Payment Made for Plan");
    assert.equal(templateCalls[0][0], "billing-payment-confirmation.html");
    assert.equal(templateCalls[0][1].subscriptionPlan, "Standard");
    assert.equal(templateCalls[0][1].numberOfLicenses, 8);
    assert.equal(templateCalls[0][1].paymentMethod, "visa ending in 4242");
});

test("sends a confirmation for a successful saved-card charge", async () => {
    let invoiceStatus = "Overdue";
    let emailCalls = 0;
    const invoice = {
        id: 43,
        tenantId: "tenant-1",
        tenant: { email: "tenant@example.com", companyName: "Example Clinic" },
        plan: { name: "Standard", forStaff: 3, forClient: 5 },
        total: 120,
        billingFrequency: "Monthly",
        quantity: 1,
        subscriptionId: "subscription-1",
    };
    const tx = {
        invoice: {
            findUnique: async () => ({ status: invoiceStatus }),
            update: async ({ data }) => {
                invoiceStatus = data.status;
                return { ...invoice, ...data };
            },
        },
        payment: {
            create: async () => ({ id: 100 }),
        },
        paymentMethod: {
            update: async () => undefined,
        },
        subscription: {
            update: async () => undefined,
        },
        tenant: {
            update: async () => undefined,
        },
    };
    const service = new StripeBillingService({
        prisma: { $transaction: async (callback) => callback(tx) },
        invoiceService: null,
        mailService: {
            sendMail: async () => {
                emailCalls += 1;
                return { success: true };
            },
        },
        renderer: { render: async () => "<html>Payment confirmation</html>" },
    });
    const paymentIntent = {
        id: "pi_456",
        created: 1_764_000_000,
        latest_charge: {
            payment_method_details: { card: { brand: "visa", last4: "4242" } },
        },
    };
    const paymentMethod = { id: "payment-method-1" };

    await service.activateFromSavedCharge(invoice, paymentIntent, paymentMethod);
    await service.activateFromSavedCharge(invoice, paymentIntent, paymentMethod);

    assert.equal(emailCalls, 1);
});
