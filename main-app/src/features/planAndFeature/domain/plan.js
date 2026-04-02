class Plan {
    constructor({ id, name, description, pricePerMonth, pricePerYear, planType, colourCode, forClient, forStaff, forStorage, extraFeaturesEnabled, active, tenantId, adminId, features, extraFeatures, extraFeaturesWithPrice }) {
        this.id = id;
        this.planType = planType;
        this.name = name;
        this.colourCode = colourCode;
        this.description = description;
        this.pricePerMonth = pricePerMonth;
        this.pricePerYear = pricePerYear;
        this.forClient = forClient;
        this.forStaff = forStaff;
        this.forStorage = forStorage;
        this.extraFeaturesEnabled = extraFeaturesEnabled;
        this.active = active;
        this.tenantId = tenantId;
        this.adminId = adminId;
        this.features = features;
        this.extraFeatures = extraFeatures;
        this.extraFeaturesWithPrice = extraFeaturesWithPrice;
    }

    get createStandardBillingPlan() {
        return {
            planType: this.planType,
            name: this.name,
            colourCode: this.colourCode,
            description: this.description,
            pricePerMonth: this.pricePerMonth,
            pricePerYear: this.pricePerYear,
            forClient: this.forClient,
            forStaff: this.forStaff,
            forStorage: this.forStorage,
            extraFeaturesEnabled: this.extraFeaturesEnabled,
            features: this.features,
            extraFeatures: this.extraFeatures,
            extraFeaturesWithPrice: this.extraFeaturesWithPrice
        };
    }

    get createEnterpriseBillingPlan() {
        return {
            planType: this.planType,
            name: this.name,
            colourCode: this.colourCode,
            description: this.description,
            pricePerMonth: this.pricePerMonth,
            pricePerYear: this.pricePerYear,
            forClient: this.forClient,
            forStaff: this.forStaff,
            forStorage: this.forStorage,
            extraFeaturesEnabled: this.extraFeaturesEnabled,
            adminId: this.adminId,
            tenantId: this.tenantId,
            features: this.features,
            extraFeatures: this.extraFeatures,
            extraFeaturesWithPrice: this.extraFeaturesWithPrice
        };
    }

}

export default Plan;