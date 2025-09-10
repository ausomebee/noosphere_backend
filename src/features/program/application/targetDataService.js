class TargetDataService {
    constructor({ targetDataRepository }) {
        this.targetDataRepository = targetDataRepository;
    }

    async createTargetData(data) {
        const newTargetData = await this.targetDataRepository.create(data);

        if (!newTargetData) {
            throw new Error("Failed to create TargetData");
        }

        return newTargetData;
    }

    async getClientTargetData(data) {
        const targetData = await this.targetDataRepository.findAll({
            clientId: data.clientId,
            targetId: data.targetId
        });

        if (!targetData) {
            throw new Error("Target data not found")
        }

        return targetData;
    }

}

export default TargetDataService;