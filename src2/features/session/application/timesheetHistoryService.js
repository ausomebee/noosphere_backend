class TimesheetHistoryService {
    constructor({ timesheetHistoryRepository }) {
        this.timesheetHistoryRepository = timesheetHistoryRepository;
    }

    async createTimesheetHistory(data) {
        const newHistory = await this.timesheetHistoryRepository.create(data);

        if (!newHistory) {
            throw new Error("Failed to create timesheet history");
        }

        return newHistory;
    }

    async getSingleTimesheetHistory(id) {
        const history = await this.timesheetHistoryRepository.findOne({ id });

        if (!history) {
            throw new Error("Timesheet history not found");
        }

        return history;
    }

    async getTimesheetHistories(sessionId) {
        const histories = await this.timesheetHistoryRepository.findAllAndPopulate(
            { sessionId },
            { staff: true }
        );

        if (!histories) {
            throw new Error("Timesheet histories not found");
        }

        return histories;
    }
}

export default TimesheetHistoryService;
