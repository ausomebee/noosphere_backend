class PerformanceService {
    constructor({cloudWatchUtil}) {
        this.cloudWatchUtil = cloudWatchUtil;
    }

    async getAllMetrics(data) {
        const { startTime, endTime } = data;
        const instanceId = process.env.EC2_INSTANCE_ID;
        const dbInstanceId = process.env.MY_DB_INSTANCE;

        const metricFetchers = [
            this.cloudWatchUtil.getCPUUtilization(instanceId, startTime, endTime),
            this.cloudWatchUtil.getDiskReadBytes(instanceId, startTime, endTime),
            this.cloudWatchUtil.getDiskWriteBytes(instanceId, startTime, endTime),
            this.cloudWatchUtil.getDiskReadOps(instanceId, startTime, endTime),
            this.cloudWatchUtil.getDiskWriteOps(instanceId, startTime, endTime),
            this.cloudWatchUtil.getNetworkIn(instanceId, startTime, endTime),
            this.cloudWatchUtil.getNetworkOut(instanceId, startTime, endTime),
            this.cloudWatchUtil.getNetworkPacketsIn(instanceId, startTime, endTime),
            this.cloudWatchUtil.getNetworkPacketsOut(instanceId, startTime, endTime),
            this.cloudWatchUtil.getStatusCheckFailed(instanceId, startTime, endTime),
            this.cloudWatchUtil.getStatusCheckFailedInstance(instanceId, startTime, endTime),
            this.cloudWatchUtil.getStatusCheckFailedSystem(instanceId, startTime, endTime),

            this.cloudWatchUtil.getRDSCPUUtilization(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSDatabaseConnections(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSFreeStorageSpace(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSFreeableMemory(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSReadIOPS(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSWriteIOPS(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSReadLatency(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSWriteLatency(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSReadThroughput(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSWriteThroughput(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSReplicaLag(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSSwapUsage(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSDiskQueueDepth(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSNetworkReceiveThroughput(dbInstanceId, startTime, endTime),
            this.cloudWatchUtil.getRDSNetworkTransmitThroughput(dbInstanceId, startTime, endTime)
        ];

        const results = await Promise.allSettled(metricFetchers);

        const metrics = {
            EC2: {
                CPUUtilization: results[0].value,
                DiskReadBytes: results[1].value,
                DiskWriteBytes: results[2].value,
                DiskReadOps: results[3].value,
                DiskWriteOps: results[4].value,
                NetworkIn: results[5].value,
                NetworkOut: results[6].value,
                NetworkPacketsIn: results[7].value,
                NetworkPacketsOut: results[8].value,
                StatusCheckFailed: results[9].value,
                StatusCheckFailedInstance: results[10].value,
                StatusCheckFailedSystem: results[11].value,
            },
            RDS: {
                CPUUtilization: results[12].value,
                DatabaseConnections: results[13].value,
                FreeStorageSpace: results[14].value,
                FreeableMemory: results[15].value,
                ReadIOPS: results[16].value,
                WriteIOPS: results[17].value,
                ReadLatency: results[18].value,
                WriteLatency: results[19].value,
                ReadThroughput: results[20].value,
                WriteThroughput: results[21].value,
                ReplicaLag: results[22].value,
                SwapUsage: results[23].value,
                DiskQueueDepth: results[24].value,
                NetworkReceiveThroughput: results[25].value,
                NetworkTransmitThroughput: results[26].value,
            }
        };

        const failed = results.filter(r => r.status === "rejected");
        if (failed.length > 0) {
            console.warn("Some metrics failed to fetch:", failed.map(f => f.reason?.message || f.reason));
        }

        return metrics;
    }

    async getCPUUtilizationMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getCPUUtilization(process.env.EC2_INSTANCE_ID, startTime, endTime);
    }

    async getDiskReadBytesMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getDiskReadBytes(process.env.EC2_INSTANCE_ID, startTime, endTime);
    }

    async getDiskWriteBytesMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getDiskWriteBytes(process.env.EC2_INSTANCE_ID, startTime, endTime);
    }

    async getDiskReadOpsMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getDiskReadOps(process.env.EC2_INSTANCE_ID, startTime, endTime);
    }

    async getDiskWriteOpsMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getDiskWriteOps(process.env.EC2_INSTANCE_ID, startTime, endTime);
    }

    async getNetworkInMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getNetworkIn(process.env.EC2_INSTANCE_ID, startTime, endTime);
    }

    async getNetworkOutMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getNetworkOut(process.env.EC2_INSTANCE_ID, startTime, endTime);
    }

    async getNetworkPacketsInMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getNetworkPacketsIn(process.env.EC2_INSTANCE_ID, startTime, endTime);
    }

    async getNetworkPacketsOutMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getNetworkPacketsOut(process.env.EC2_INSTANCE_ID, startTime, endTime);
    }

    async getStatusCheckFailedMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getStatusCheckFailed(process.env.EC2_INSTANCE_ID, startTime, endTime);
    }

    async getStatusCheckFailedInstanceMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getStatusCheckFailedInstance(process.env.EC2_INSTANCE_ID, startTime, endTime);
    }

    async getStatusCheckFailedSystemMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getStatusCheckFailedSystem(process.env.EC2_INSTANCE_ID, startTime, endTime);
    }

    async getRDSCPUUtilizationMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSCPUUtilization(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSDatabaseConnectionsMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSDatabaseConnections(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSFreeStorageSpaceMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSFreeStorageSpace(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSFreeableMemoryMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSFreeableMemory(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSReadIOPSMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSReadIOPS(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSWriteIOPSMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSWriteIOPS(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSReadLatencyMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSReadLatency(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSWriteLatencyMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSWriteLatency(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSReadThroughputMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSReadThroughput(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSWriteThroughputMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSWriteThroughput(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSReplicaLagMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSReplicaLag(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSSwapUsageMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSSwapUsage(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSDiskQueueDepthMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSDiskQueueDepth(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSNetworkReceiveThroughputMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSNetworkReceiveThroughput(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

    async getRDSNetworkTransmitThroughputMetric({ startTime, endTime }) {
        return this.cloudWatchUtil.getRDSNetworkTransmitThroughput(process.env.MY_DB_INSTANCE, startTime, endTime);
    }

}

export default PerformanceService;