import { CloudWatchClient, GetMetricDataCommand } from "@aws-sdk/client-cloudwatch";

class CloudWatchUtil {
    constructor({ accessKeyId, secretAccessKey, region }) {
        this.client = new CloudWatchClient({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey
            }
        });
    }

    static formatForChart(metricDataResults, { maxPoints = 50, label } = {}) {
        const result = metricDataResults[0];
        if (!result || !result.Timestamps?.length) {
            return { label: label || result?.Label || "", data: [] };
        }

        let points = result.Timestamps
            .map((ts, i) => ({
                timestamp: new Date(ts).toISOString(),
                value: result.Values[i]
            }))
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        if (maxPoints && points.length > maxPoints) {
            const bucketSize = Math.ceil(points.length / maxPoints);
            const downsampled = [];
            for (let i = 0; i < points.length; i += bucketSize) {
                const bucket = points.slice(i, i + bucketSize);
                const avgValue = bucket.reduce((sum, p) => sum + p.value, 0) / bucket.length;
                downsampled.push({
                    timestamp: bucket[Math.floor(bucket.length / 2)].timestamp,
                    value: Math.round(avgValue * 100) / 100
                });
            }
            points = downsampled;
        }

        return { label: label || result.Label || "", data: points };
    }

    async getMetricData({
        namespace,
        metricName,
        dimensions,
        startTime,
        endTime,
        stat = "Average",
        period = 300,
        maxPoints = 50
    }) {
        const command = new GetMetricDataCommand({
            StartTime: startTime,
            EndTime: endTime,
            MetricDataQueries: [
                {
                    Id: "m1",
                    MetricStat: {
                        Metric: {
                            Namespace: namespace,
                            MetricName: metricName,
                            Dimensions: dimensions
                        },
                        Period: period,
                        Stat: stat,
                    },
                    ReturnData: true,
                }
            ]
        });

        try {
            const data = await this.client.send(command);
            return CloudWatchUtil.formatForChart(data.MetricDataResults, {
                maxPoints,
                label: metricName
            });
        } catch (err) {
            console.error(`Error fetching ${metricName}:`, err);
            throw err;
        }
    }

    async getMultipleMetrics(queries, startTime, endTime) {
        const results = await Promise.all(
            queries.map(q => this.getMetricData({ ...q, startTime, endTime }))
        );
        return { series: results };
    }

    // ── EC2 Metrics ──────────────────────────────────────────────

    async getEC2Metric(metricName, instanceId, startTime, endTime, stat = "Average", period = 300, maxPoints = 50) {
        return this.getMetricData({
            namespace: "AWS/EC2",
            metricName,
            dimensions: [{ Name: "InstanceId", Value: instanceId }],
            startTime,
            endTime,
            stat,
            period,
            maxPoints
        });
    }

    getCPUUtilization = (...args) => this.getEC2Metric("CPUUtilization", ...args);
    getDiskReadBytes = (...args) => this.getEC2Metric("DiskReadBytes", ...args);
    getDiskWriteBytes = (...args) => this.getEC2Metric("DiskWriteBytes", ...args);
    getDiskReadOps = (...args) => this.getEC2Metric("DiskReadOps", ...args);
    getDiskWriteOps = (...args) => this.getEC2Metric("DiskWriteOps", ...args);
    getNetworkIn = (...args) => this.getEC2Metric("NetworkIn", ...args);
    getNetworkOut = (...args) => this.getEC2Metric("NetworkOut", ...args);
    getNetworkPacketsIn = (...args) => this.getEC2Metric("NetworkPacketsIn", ...args);
    getNetworkPacketsOut = (...args) => this.getEC2Metric("NetworkPacketsOut", ...args);
    getStatusCheckFailed = (...args) => this.getEC2Metric("StatusCheckFailed", ...args);
    getStatusCheckFailedInstance = (...args) => this.getEC2Metric("StatusCheckFailed_Instance", ...args);
    getStatusCheckFailedSystem = (...args) => this.getEC2Metric("StatusCheckFailed_System", ...args);

    async getRDSMetric(metricName, dbInstanceIdentifier, startTime, endTime, stat = "Average", period = 300, maxPoints = 50) {
        return this.getMetricData({
            namespace: "AWS/RDS",
            metricName,
            dimensions: [{ Name: "DBInstanceIdentifier", Value: dbInstanceIdentifier }],
            startTime,
            endTime,
            stat,
            period,
            maxPoints
        });
    }

    getRDSCPUUtilization = (...args) => this.getRDSMetric("CPUUtilization", ...args);
    getRDSDatabaseConnections = (...args) => this.getRDSMetric("DatabaseConnections", ...args);
    getRDSFreeStorageSpace = (...args) => this.getRDSMetric("FreeStorageSpace", ...args);
    getRDSFreeableMemory = (...args) => this.getRDSMetric("FreeableMemory", ...args);
    getRDSReadIOPS = (...args) => this.getRDSMetric("ReadIOPS", ...args);
    getRDSWriteIOPS = (...args) => this.getRDSMetric("WriteIOPS", ...args);
    getRDSReadLatency = (...args) => this.getRDSMetric("ReadLatency", ...args);
    getRDSWriteLatency = (...args) => this.getRDSMetric("WriteLatency", ...args);
    getRDSReadThroughput = (...args) => this.getRDSMetric("ReadThroughput", ...args);
    getRDSWriteThroughput = (...args) => this.getRDSMetric("WriteThroughput", ...args);
    getRDSReplicaLag = (...args) => this.getRDSMetric("ReplicaLag", ...args);
    getRDSSwapUsage = (...args) => this.getRDSMetric("SwapUsage", ...args);
    getRDSDiskQueueDepth = (...args) => this.getRDSMetric("DiskQueueDepth", ...args);
    getRDSNetworkReceiveThroughput = (...args) => this.getRDSMetric("NetworkReceiveThroughput", ...args);
    getRDSNetworkTransmitThroughput = (...args) => this.getRDSMetric("NetworkTransmitThroughput", ...args);
}

export default CloudWatchUtil;
