class IncomeItemService {
    constructor({ incomeItemRepository }) {
        this.incomeItemRepository = incomeItemRepository;
    }

    async createIncomeItem(data) {
        const exists = await this.incomeItemRepository.findFirstDynamic({
            where: { name: data.name, tenantId: data.tenantId, isDeleted: false },
            select: { name: true }
        });

        if (exists) {
            throw new Error("This Income Item already exists.");
        }

        return await this.incomeItemRepository.create(data);
    }

    async updateIncomeItem(data) {
        const incomeItem = await this.incomeItemRepository.findOne({ id: data.id });

        if (!incomeItem) {
            throw new Error("Income Item not found");
        }

        return await this.incomeItemRepository.update(data.id, {
            ...incomeItem,
            ...data
        });
    }

    async getSingleIncomeItem(data) {
        const incomeItem = await this.incomeItemRepository.findOne({ id: data.id });

        if (!incomeItem) {
            throw new Error("Income Item not found");
        }

        return incomeItem;
    }

    async getTenantIncomeItems(tenantId) {
        return await this.incomeItemRepository.findAll({ tenantId, isDeleted: false });
    }

    async deleteIncomeItem({ id, tenantId }) {
        const incomeItem = await this.incomeItemRepository.findFirstDynamic({
            where: { id, tenantId, isDeleted: false }
        });

        if (!incomeItem) {
            return null;
        }

        return await this.incomeItemRepository.update(id, {
            isDeleted: true,
            isActive: false
        });
    }
}

export default IncomeItemService;
