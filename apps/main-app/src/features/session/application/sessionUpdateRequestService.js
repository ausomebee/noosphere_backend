class SessionUpdateRequestService {
    constructor({ sessionUpdateRequestRepository }) {
        this.sessionUpdateRequestRepository = sessionUpdateRequestRepository;
    }

    async createUpdateRequest(data) {
        const newRequest = await this.sessionUpdateRequestRepository.create(data);

        if (!newRequest) {
            throw new Error("Failed to create session update request");
        }

        return newRequest;
    }

    async updateUpdateRequest(data) {
        const request = await this.sessionUpdateRequestRepository.findOne({ id: data.id });

        if (!request) {
            throw new Error("Session update request not found");
        }

        const update = await this.sessionUpdateRequestRepository.update(data.id, {
            description: data.description || request.description
        });

        if (!update) {
            throw new Error("Failed to update session update request");
        }

        return update;
    }

    async getSingleUpdateRequest(id) {
        const request = await this.sessionUpdateRequestRepository.findOne({ id });

        if (!request) {
            throw new Error("Session update request not found");
        }

        return request;
    }

    async getUpdateRequests(sessionId) {
        const requests = await this.sessionUpdateRequestRepository.findAllAndPopulate(
            { sessionId },
            { staff: true }
        );

        if (!requests) {
            throw new Error("Session update requests not found");
        }

        return requests;
    }
}

export default SessionUpdateRequestService;
