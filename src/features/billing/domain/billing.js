class Billing {
    constructor({ id, tenantId,
        chargeOnDueDate,
        chargeLastUsedFirst,
        chargeAlternative,
        retryBefore,
        retryAfter,
        notifyTenant,
        notificationEmailHeader,
        notificationEmailBody,
        cancelAfter,
        manualCancel,
        suspensionAction,
        errorMessage,
        emailAfterAttempts,
        warningMailHeader,
        warningMailBody,
        sendOnSubscriptionCancel,
        cancelMailHeader,
        cancelMailBody,
        gatewayToken, lastFourDigits, cardType, subscription, createdAt, tenant, invoice, amount, paymentMethod, paymentMethodId, billingAddress, billingMetadataId, planId, status, startDate, endDate, name, description, price, billingCycle, transactionId, invoiceId }) {
        this.id = id;
        this.tenantId = tenantId;
        this.paymentMethod = paymentMethod;
        this.billingAddress = billingAddress;
        this.billingMetadataId = billingMetadataId;
        this.planId = planId;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.name = name;
        this.description = description;
        this.price = price;
        this.billingCycle = billingCycle;
        this.transactionId = transactionId;
        this.invoiceId = invoiceId;
        this.amount = amount;
        this.paymentMethodId = paymentMethodId;
        this.tenant = tenant;
        this.invoice = invoice;
        this.subscription = subscription;
        this.createdAt = createdAt;
        this.cardType = cardType;
        this.lastFourDigits = lastFourDigits;
        this.gatewayToken = gatewayToken;
        this.chargeOnDueDate = chargeOnDueDate;
        this.chargeLastUsedFirst = chargeLastUsedFirst;
        this.chargeAlternative = chargeAlternative;
        this.retryBefore = retryBefore;
        this.retryAfter = retryAfter;
        this.notifyTenant = notifyTenant;
        this.notificationEmailHeader = notificationEmailHeader;
        this.notificationEmailBody = notificationEmailBody;
        this.cancelAfter = cancelAfter;
        this.manualCancel = manualCancel;
        this.suspensionAction = suspensionAction;
        this.errorMessage = errorMessage;
        this.emailAfterAttempts = emailAfterAttempts;
        this.warningMailHeader = warningMailHeader;
        this.warningMailBody = warningMailBody;
        this.sendOnSubscriptionCancel = sendOnSubscriptionCancel;
        this.cancelMailHeader = cancelMailHeader;
        this.cancelMailBody = cancelMailBody;
    }

    get createBillingMetadata() {
        return {
            tenantId: this.tenantId,
            paymentMethod: this.paymentMethod,
            billingAddress: this.billingAddress,
        };
    }

    get createTransaction() {
        return {
            billingMetadataId: this.billingMetadataId,
            status: this.status
        };
    }

    get createPayment() {
        return {
            status: this.status,
            tenantId: this.tenantId,
            amount: this.amount,
            invoiceId: this.invoiceId,
            paymentMethodId: this.paymentMethodId
        };
    }

    get paymentOutput() {
        return {
            Plan: this.invoice.plan.name,
            Period: {
                start: this.subscription?.startDate,
                stop: this.subscription?.endDate
            },
            id: this.id,
            paymentDate: this.createdAt,
            paymentTime: this.createdAt,
            amount: this.amount,
            paymentMethod: { name: this.paymentMethod.cardType, code: `XXXX-XXXX-XXXX-${this.paymentMethod.lastFourDigits}` },
            invoice: this.invoiceOutput
        };
    }

    get createPaymentMethod() {
        return {
            cardType: this.cardType,
            tenantId: this.tenantId,
            lastFourDigits: this.lastFourDigits,
            gatewayToken: this.gatewayToken,
        };
    }

    get invoiceOutput() {
        return {
            companyAddress: {
                street: "931 10th street",
                suite: "Suite 776, Modesto",
                state: "CA 95354",
            },
            invoiceId: `INV${this.invoice.id}`,
            dueDate: this.invoice.dueDate,
            billingFrequency: this.invoice.billingFrequency,
            customerInfo: {
                name: this.tenant.companyName,
                street: this.tenant.location.address,
                city: this.tenant.location.city,
                zip: this.tenant.location.zip,
            },
            items: [
                {
                    id: this.invoice.plan.id,
                    description: this.invoice.plan.description,
                    rate: this.invoice.billingFrequency === "Monthly" ? this.invoice.plan.pricePerMonth : this.invoice.plan.pricePerYear,
                    quantity: this.invoice.quantity,
                    price: this.invoice.billingFrequency === "Monthly" ? this.invoice.plan.pricePerMonth.price * this.invoice.quantity : this.invoice.plan.pricePerYear.price * this.invoice.quantity,
                }
            ],
            total: this.invoice.total,
        };
    }

    get createPaymentAccess() {
        return {
            chargeOnDueDate: this.chargeOnDueDate,
            chargeLastUsedFirst: this.chargeLastUsedFirst,
            chargeAlternative: this.chargeAlternative,
            retryBefore: this.retryBefore,
            retryAfter: this.retryAfter,
            notifyTenant: this.notifyTenant,
            notificationEmailHeader: this.notificationEmailHeader,
            notificationEmailBody: this.notificationEmailBody,
            cancelAfter: this.cancelAfter,
            manualCancel: this.manualCancel,
            suspensionAction: this.suspensionAction,
            errorMessage: this.errorMessage,
            emailAfterAttempts: this.emailAfterAttempts,
            warningMailHeader: this.warningMailHeader,
            warningMailBody: this.warningMailBody,
            sendOnSubscriptionCancel: this.sendOnSubscriptionCancel,
            cancelMailHeader: this.cancelMailHeader,
            cancelMailBody: this.cancelMailBody
        };
    }
}

export default Billing;