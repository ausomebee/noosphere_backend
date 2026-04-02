class PayrollCycleStaffIncomeItemsService {
    constructor({ payrollCycleStaffIncomeItemsRepository }) {
        this.payrollCycleStaffIncomeItemsRepository = payrollCycleStaffIncomeItemsRepository;
    }

    async createPayrollCycleStaffIncomeItem(data) {
        const exists =
            await this.payrollCycleStaffIncomeItemsRepository.findFirstDynamic({
                where: {
                    name: data.name,
                    payrollCycleStaffId: data.payrollCycleStaffId
                },
                select: { name: true }
            });

        if (exists) {
            throw new Error("This Income Item already exists for this staff.");
        }

        return await this.payrollCycleStaffIncomeItemsRepository.create(data);
    }

    async createManyPayrollCycleStaffIncomeItems(dataArray) {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            throw new Error("No income items provided");
        }

        const payrollCycleStaffId = dataArray[0].payrollCycleStaffId;

        const existingIncomeItems =
            await this.payrollCycleStaffIncomeItemsRepository.findAll({
                payrollCycleStaffId
            });

        const existingNames = new Set(
            existingIncomeItems.map(item => item.name.toLowerCase())
        );

        const newIncomeItems = dataArray.filter(
            item => !existingNames.has(item.name.toLowerCase())
        );

        if (newIncomeItems.length === 0) {
            throw new Error("All income items already exist for this staff.");
        }

        return await this.payrollCycleStaffIncomeItemsRepository.insertMany(
            newIncomeItems
        );
    }

    async updatePayrollCycleStaffIncomeItem(data) {
        const incomeItem =
            await this.payrollCycleStaffIncomeItemsRepository.findOne({
                id: data.id
            });

        if (!incomeItem) {
            throw new Error("Income Item not found");
        }

        return await this.payrollCycleStaffIncomeItemsRepository.update(
            data.id,
            {
                ...incomeItem,
                ...data
            }
        );
    }

    async getSinglePayrollCycleStaffIncomeItem(data) {
        const incomeItem =
            await this.payrollCycleStaffIncomeItemsRepository.findOne({
                id: data.id
            });

        if (!incomeItem) {
            throw new Error("Income Item not found");
        }

        return incomeItem;
    }

    async getStaffIncomeItems(payrollCycleStaffId) {
        return await this.payrollCycleStaffIncomeItemsRepository.findAll({
            payrollCycleStaffId
        });
    }
}

export default PayrollCycleStaffIncomeItemsService;
