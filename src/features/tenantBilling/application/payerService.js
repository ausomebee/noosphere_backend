class PayerService {
    constructor({ payerRepository }) {
        this.payerRepository = payerRepository;
    }

    async createPayer(data) {
        const payerExists = await this.payerRepository.findFirstDynamic({
            where: { payerName: data.payerName, tenantId: data.tenantId },
            select: { payerName: true }
        });

        if (payerExists) {
            throw new Error("This Payer already exists.");
        }

        return await this.payerRepository.create(data);
    }

    async updatePayer(data) {
        const payer = await this.payerRepository.findOne({ id: data.id });

        if (!payer) {
            throw new Error("Payer not found");
        }

        return await this.payerRepository.update(data.id, {
            ...payer,
            ...data
        });
    }

    async getSinglePayer(data) {
        const payer = await this.payerRepository.findOne({ id: data.id });

        if (!payer) {
            throw new Error("Payer not found");
        }

        return payer;
    }

    async getTenantPayers(tenantId) {
        return await this.payerRepository.findAll({ tenantId });
    }
}

export default PayerService;
