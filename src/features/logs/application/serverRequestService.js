class ServerRequestService {
    constructor({ serverRequestRepository }) {
        this.serverRequestRepository = serverRequestRepository;
    }

    async createRequest(data) {
        const newRequest = await this.serverRequestRepository.create(data);

        if (!newRequest) {
            throw new Error("Failed to create server request log");
        }

        return newRequest;
    }

    async getSingleRequest(data) {
        const request = await this.serverRequestRepository.findOne({ id: data.id });

        if (!request) {
            throw new Error("Server request log not found.");
        }

        return request;
    }

    async getTenantRequests(data) {
        const requests = await this.serverRequestRepository.getTenantLogs({
            tenantId: data.tenantId,
            page: parseInt(data.page) || 1,
            limit: parseInt(data.limit) || 20,
            statusCodes: data.statusCodes || [],
        });

        if (!requests || requests.data.length === 0) {
            throw new Error("No server request logs found for this tenant.");
        }

        return requests;
    }

    async getRequestsByDateRange(data) {
        const requests = await this.serverRequestRepository.getLogsByDateRange({
            tenantId: data.tenantId,
            startDate: data.startDate,
            endDate: data.endDate,
            page: parseInt(data.page) || 1,
            limit: parseInt(data.limit) || 20,
        });

        if (!requests || requests.data.length === 0) {
            throw new Error("No server request logs found for this tenant in the given date range.");
        }

        return requests;
    }
}

export default ServerRequestService;