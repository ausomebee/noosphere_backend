class SessionApprovalService {
    constructor({ sessionApprovalRepository }) {
        this.sessionApprovalRepository = sessionApprovalRepository;
    }

    async createSessionApproval(data) {
        const exists = await this.sessionApprovalRepository.findFirstDynamic({
            where: { sessionId: data.sessionId },
            select: { id: true }
        });

        if (exists) {
            throw new Error("Session approval already submitted for this session.");
        }

        const newApproval = await this.sessionApprovalRepository.create(data);

        if (!newApproval) {
            throw new Error("Failed to create session approval");
        }

        return newApproval;
    }

    async updateSessionApproval(data) {
        const approval = await this.sessionApprovalRepository.findOne({ id: data.id });

        if (!approval) {
            throw new Error("Session approval not found");
        }

        const update = await this.sessionApprovalRepository.update(data.id, {
            confirmDelivery: data.confirmDelivery ?? approval.confirmDelivery,
            rateService: data.rateService ?? approval.rateService,
            rateTherapist: data.rateTherapist ?? approval.rateTherapist,
            feedback: data.feedback ?? approval.feedback,
            signature: data.signature || approval.signature
        });

        if (!update) {
            throw new Error("Failed to update session approval");
        }

        return update;
    }

    async getSingleSessionApproval(id) {
        const approval = await this.sessionApprovalRepository.findOne({ id });

        if (!approval) {
            throw new Error("Session approval not found");
        }

        return approval;
    }

    async getSessionApprovals(sessionId) {
        const approvals = await this.sessionApprovalRepository.findAllAndPopulate(
            { sessionId },
            { session: true }
        );

        if (!approvals) {
            throw new Error("Session approvals not found");
        }

        return approvals;
    }
}

export default SessionApprovalService;
