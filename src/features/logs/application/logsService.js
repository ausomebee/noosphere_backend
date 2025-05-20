import Logs from "../domain/logs";

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

}

export default LogsService;