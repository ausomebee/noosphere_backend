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

}

export default TargetDataService;