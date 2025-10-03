class PayerServiceCodesService {
    constructor({ payerServiceCodesRepository }) {
        this.payerServiceCodesRepository = payerServiceCodesRepository;
    }

    async createPayerServiceCode(data) {
        const newPSC = await this.payerServiceCodesRepository.create(data);

        if (!newPSC) {
            throw new Error("Failed to create Payer Service Code");
        }

        return newPSC;
    }

    async updatePayerServiceCode(data) {
        const payerServiceCode = await this.payerServiceCodesRepository.findOne({ id: data.id });

        if (!payerServiceCode) {
            throw new Error("Payer Service Code not found");
        }

        return await this.payerServiceCodesRepository.update(data.id, {
            ...payerServiceCode,
            ...data
        });
    }

    async getSinglePayerServiceCode(data) {
        const payerServiceCode = await this.payerServiceCodesRepository.findOne({ id: data.id });

        if (!payerServiceCode) {
            throw new Error("Payer Service Code not found");
        }

        return payerServiceCode;
    }

    async getPayerServiceCodes(payerId) {
        return await this.payerServiceCodesRepository.findAll({ payerId });
    }
}

export default PayerServiceCodesService;
