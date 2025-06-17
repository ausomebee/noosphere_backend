import BaseRepository from "./baseRepository.js";

class IssueRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async findOneAndPopulate(query) {
        return await this.model.findUnique({
            where: query,
            include: {
                assignedTo: {
                    select: {
                        fullName: true
                    }
                },
                tenant: {
                    select: {
                        companyName: true
                    }
                },
                loggedBy: {
                    select: {
                        fullName: true
                    }
                },
                comments: true,
                Logs: true
            }
        });
    }
}

export default IssueRepository;