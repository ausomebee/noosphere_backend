import Logs from "../domain/logs.js";

class LogsService {
    constructor({ logsRepository }) {
        this.logsRepository = logsRepository;
    }

    async createLog(data) {
        const createData = new Logs(data).createLog
        const newLog = await this.logsRepository.create(createData);

        if (!newLog) {
            throw new Error("Failed to create log");
        }

        return newLog;
    }

    async getSingleLog(data) {
        const log = await this.logsRepository.findOne({ logId: data.logId });

        if (!log) {
            throw new Error("Log not found.")
        }

        return log;
    }

    async getTenantLogs(data) {
        const logs = await this.logsRepository.getTenantLogs({
            tenantId: data.tenantId,
            featureNames: data.featureNames ? [data.featureNames] : [],
            page: parseInt(data.page) || 1,
            limit: parseInt(data.limit) || 20,
        });

        if (!logs || logs.data.length === 0) {
            throw new Error("No logs found for this tenant.");
        }

        return logs;
    }
}

export default LogsService;