import BaseRepository from "./baseRepository.js";

class PaymentRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async findAllAndPopulate(filter = {}) {
        return await this.model.findMany({
            where: filter,
            include: {
                tenant: {
                    select: {
                        companyName: true
                    }
                }
            }
        });
    }


}

export default PaymentRepository;