import BaseRepository from "./baseRepository";

class BillingRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    // constructor() {
    //     this.prisma = prismaService.getClient();
    //     this.billingMetadata = this.prisma.billingMetadata;
    //     this.transactions = this.prisma.transactions;
    //     this.subscription = this.prisma.subscription;
    //     this.billingPlan = this.prisma.billingPlan;
    //     this.feature = this.prisma.feature;
    // }

    // async createBillingMetadata(data) {
    //     return await this.billingMetadata.create({ data });
    // }

    // async findOneBillingMetadata(query) {
    //     return await this.billingMetadata.findUnique({ where: query });
    // }

    // async findFirstBillingMetadata(query) {
    //     const { where, include, select, orderBy, take, skip } = query;
    //     return await this.billingMetadata.findFirst({ where, include, select, orderBy, take, skip });
    // }

    // async findAllBillingMetadata(query = {}) {
    //     const { where, include, select, orderBy, take, skip } = query;
    //     return await this.billingMetadata.findMany({ where, include, select, orderBy, take, skip });
    // }

    // async updateBillingMetadata(id, data) {
    //     return await this.billingMetadata.update({ where: { id }, data: { ...data } });
    // }

    // async updateBillingMetadataWithField(field, value, data) {
    //     const record = await this.billingMetadata.findUnique({ where: { [field]: value } });
    //     if (!record) return { count: 0 };
    //     return await this.billingMetadata.update({ where: { [field]: value }, data });
    // }

    // async deleteBillingMetadata(id) {
    //     return await this.billingMetadata.delete({ where: { id } });
    // }

    // async createTransaction(data) {
    //     return await this.transactions.create({ data });
    // }

    // async findOneTransaction(query) {
    //     return await this.transactions.findUnique({ where: query });
    // }

    // async findFirstTransaction(query) {
    //     const { where, include, select, orderBy, take, skip } = query;
    //     return await this.transactions.findFirst({ where, include, select, orderBy, take, skip });
    // }

    // async findAllTransactions(query = {}) {
    //     const { where, include, select, orderBy, take, skip } = query;
    //     return await this.transactions.findMany({ where, include, select, orderBy, take, skip });
    // }

    // async updateTransaction(id, data) {
    //     return await this.transactions.update({ where: { id }, data: { ...data } });
    // }

    // async updateTransactionWithField(field, value, data) {
    //     const record = await this.transactions.findUnique({ where: { [field]: value } });
    //     if (!record) return { count: 0 };
    //     return await this.transactions.update({ where: { [field]: value }, data });
    // }

    // async deleteTransaction(id) {
    //     return await this.transactions.delete({ where: { id } });
    // }

    // async createSubscription(data) {
    //     return await this.subscription.create({ data });
    // }

    // async findOneSubscription(query) {
    //     return await this.subscription.findUnique({ where: query });
    // }

    // async findFirstSubscription(query) {
    //     const { where, include, select, orderBy, take, skip } = query;
    //     return await this.subscription.findFirst({ where, include, select, orderBy, take, skip });
    // }

    // async findAllSubscriptions(query = {}) {
    //     const { where, include, select, orderBy, take, skip } = query;
    //     return await this.subscription.findMany({ where, include, select, orderBy, take, skip });
    // }

    // async updateSubscription(id, data) {
    //     return await this.subscription.update({ where: { id }, data: { ...data } });
    // }

    // async updateSubscriptionWithField(field, value, data) {
    //     const record = await this.subscription.findUnique({ where: { [field]: value } });
    //     if (!record) return { count: 0 };
    //     return await this.subscription.update({ where: { [field]: value }, data });
    // }

    // async deleteSubscription(id) {
    //     return await this.subscription.delete({ where: { id } });
    // }

    // async createBillingPlan(data) {
    //     return await this.billingPlan.create({ data });
    // }

    // async findOneBillingPlan(query) {
    //     return await this.billingPlan.findUnique({ where: query });
    // }

    // async findFirstBillingPlan(query) {
    //     const { where, include, select, orderBy, take, skip } = query;
    //     return await this.billingPlan.findFirst({ where, include, select, orderBy, take, skip });
    // }

    // async findAllBillingPlans(query = {}) {
    //     const { where, include, select, orderBy, take, skip } = query;
    //     return await this.billingPlan.findMany({ where, include, select, orderBy, take, skip });
    // }

    // async updateBillingPlan(id, data) {
    //     return await this.billingPlan.update({ where: { id }, data: { ...data } });
    // }

    // async updateBillingPlanWithField(field, value, data) {
    //     const record = await this.billingPlan.findUnique({ where: { [field]: value } });
    //     if (!record) return { count: 0 };
    //     return await this.billingPlan.update({ where: { [field]: value }, data });
    // }

    // async deleteBillingPlan(id) {
    //     return await this.billingPlan.delete({ where: { id } });
    // }

    // async createFeature(data) {
    //     return await this.feature.create({ data });
    // }

    // async findOneFeature(query) {
    //     return await this.feature.findUnique({ where: query });
    // }

    // async findFirstFeature(query) {
    //     const { where, include, select, orderBy, take, skip } = query;
    //     return await this.feature.findFirst({ where, include, select, orderBy, take, skip });
    // }

    // async findAllFeatures(query = {}) {
    //     const { where, include, select, orderBy, take, skip } = query;
    //     return await this.feature.findMany({ where, include, select, orderBy, take, skip });
    // }

    // async updateFeature(id, data) {
    //     return await this.feature.update({ where: { id }, data: { ...data } });
    // }

    // async updateFeatureWithField(field, value, data) {
    //     const record = await this.feature.findUnique({ where: { [field]: value } });
    //     if (!record) return { count: 0 };
    //     return await this.feature.update({ where: { [field]: value }, data });
    // }

    // async deleteFeature(id) {
    //     return await this.feature.delete({ where: { id } });
    // }
}

export default BillingRepository;