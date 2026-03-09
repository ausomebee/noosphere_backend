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

    // ── Formatters ───────────────────────────────────────────────

    static formatForChart(metricDataResults, { maxPoints = 50, label } = {}) {
        const result = metricDataResults[0];
        if (!result || !result.Timestamps?.length) {
            return { label: label || result?.Label || "", data: [] };
        }

        let points = result.Timestamps
            .map((ts, i) => ({
                x: new Date(ts).getTime(),
                y: result.Values[i]
            }))
            .sort((a, b) => a.x - b.x);

        if (maxPoints && points.length > maxPoints) {
            const bucketSize = Math.ceil(points.length / maxPoints);
            const downsampled = [];
            for (let i = 0; i < points.length; i += bucketSize) {
                const bucket = points.slice(i, i + bucketSize);
                const avgY = bucket.reduce((sum, p) => sum + p.y, 0) / bucket.length;
                downsampled.push({
                    x: bucket[Math.floor(bucket.length / 2)].x,
                    y: Math.round(avgY * 100) / 100
                });
            }
            points = downsampled;
        }

        return { label: label || result.Label || "", data: points };
    }

    static getPeriodRanges() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();

        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - 7);

        return {
            year: {
                startTime: new Date(year, 0, 1),
                endTime: new Date(year, 11, 31, 23, 59, 59),
                period: 86400   // 1 point per day
            },
            month: {
                startTime: new Date(year, month, 1),
                endTime: new Date(year, month + 1, 0, 23, 59, 59),
                period: 3600    // 1 point per hour
            },
            week: {
                startTime: firstDayOfWeek,
                endTime: now,
                period: 3600    // 1 point per hour
            },
            day: {
                startTime: new Date(year, month, day, 0, 0, 0),
                endTime: new Date(year, month, day, 23, 59, 59),
                period: 300     // 1 point per 5 minutes
            }
        };
    }

    // ── Core Fetchers ────────────────────────────────────────────

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

    async getMetricByAllPeriods({ namespace, metricName, dimensions, stat = "Average", maxPoints = 100 }) {
        const ranges = CloudWatchUtil.getPeriodRanges();
        const periodKeys = ["year", "month", "week", "day"];

        const results = await Promise.all(
            periodKeys.map(key =>
                this.getMetricData({
                    namespace,
                    metricName,
                    dimensions,
                    startTime: ranges[key].startTime,
                    endTime: ranges[key].endTime,
                    stat,
                    period: ranges[key].period,
                    maxPoints
                }).then(r => ({ key, data: r.data }))
            )
        );

        return Object.fromEntries(results.map(({ key, data }) => [key, data]));
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

    // ── RDS Metrics ──────────────────────────────────────────────

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

    // ── Performance Page Endpoints ───────────────────────────────

    // GET /api/performance/general
    async getGeneralMetrics({ instanceId, dbInstanceIdentifier, apiName }) {
        const { day: { startTime, endTime } } = CloudWatchUtil.getPeriodRanges();
        const dimsEc2 = [{ Name: "InstanceId", Value: instanceId }];
        const dimsApi = [{ Name: "ApiName", Value: apiName }];

        const [networkOut, rdsLatency, statusCheck, apiLatency] = await Promise.all([
            this.getMetricData({
                namespace: "AWS/EC2",
                metricName: "NetworkOut",
                dimensions: dimsEc2,
                startTime, endTime,
                stat: "Average", period: 300, maxPoints: 288
            }),
            this.getMetricData({
                namespace: "AWS/RDS",
                metricName: "ReadLatency",
                dimensions: [{ Name: "DBInstanceIdentifier", Value: dbInstanceIdentifier }],
                startTime, endTime,
                stat: "Average", period: 300, maxPoints: 288
            }),
            this.getMetricData({
                namespace: "AWS/EC2",
                metricName: "StatusCheckFailed",
                dimensions: dimsEc2,
                startTime, endTime,
                stat: "Sum", period: 3600, maxPoints: 24
            }),
            this.getMetricData({
                namespace: "AWS/ApiGateway",
                metricName: "IntegrationLatency",
                dimensions: dimsApi,
                startTime, endTime,
                stat: "Average", period: 300, maxPoints: 288
            })
        ]);

        const latest = (d) => d.data[d.data.length - 1]?.y ?? 0;

        // Uptime: percentage of hours with 0 failed status checks
        const uptimePercent = statusCheck.data.length
            ? Math.round((statusCheck.data.filter(p => p.y === 0).length / statusCheck.data.length) * 100)
            : 100;

        // NetworkOut bytes/s → normalise to ms-scale (0–1000)
        const speedRaw = latest(networkOut);
        const speedNorm = Math.min(Math.round(speedRaw / 1000), 1000);

        // RDS ReadLatency is in seconds → convert to ms
        const latencyMs = Math.round(latest(rdsLatency) * 1000);

        return {
            data: {
                systemSpeed:     { value: speedNorm, maxValue: 1000, unit: "ms" },
                latency:         { value: Math.min(latencyMs, 1000), maxValue: 1000, unit: "ms" },
                uptime:          { value: uptimePercent, maxValue: 100, unit: "percent" },
                apiResponseTime: { value: Math.min(Math.round(latest(apiLatency)), 1000), maxValue: 1000, unit: "ms" }
            }
        };
    }

    // GET /api/performance/general/timeseries
    async getGeneralTimeseries({ instanceId, dbInstanceIdentifier, apiName }) {
        const dimsEc2 = [{ Name: "InstanceId", Value: instanceId }];
        const dimsRds = [{ Name: "DBInstanceIdentifier", Value: dbInstanceIdentifier }];
        const dimsApi = [{ Name: "ApiName", Value: apiName }];

        const [systemSpeed, latency, uptime, apiResponseTime] = await Promise.all([
            this.getMetricByAllPeriods({
                namespace: "AWS/EC2",
                metricName: "NetworkOut",
                dimensions: dimsEc2,
                stat: "Average"
            }),
            this.getMetricByAllPeriods({
                namespace: "AWS/RDS",
                metricName: "ReadLatency",
                dimensions: dimsRds,
                stat: "Average"
            }),
            this.getMetricByAllPeriods({
                namespace: "AWS/EC2",
                metricName: "StatusCheckFailed",
                dimensions: dimsEc2,
                stat: "Sum"
            }),
            this.getMetricByAllPeriods({
                namespace: "AWS/ApiGateway",
                metricName: "IntegrationLatency",
                dimensions: dimsApi,
                stat: "Average"
            })
        ]);

        // Convert RDS latency from seconds → ms for all period data points
        const convertLatency = (periodMap) =>
            Object.fromEntries(
                Object.entries(periodMap).map(([k, points]) => [
                    k,
                    points.map(p => ({ x: p.x, y: Math.round(p.y * 1000) }))
                ])
            );

        return {
            data: {
                systemSpeed,
                latency: convertLatency(latency),
                uptime,
                apiResponseTime
            }
        };
    }

    // GET /api/performance/api-error-rate
    async getApiErrorRate({ apiName }) {
        const year = new Date().getFullYear();
        const startTime = new Date(year, 0, 1);
        const endTime = new Date(year, 11, 31, 23, 59, 59);
        const period = 2592000; // ~30 days

        const dimsApi = [{ Name: "ApiName", Value: apiName }];

        const [errors, total] = await Promise.all([
            this.getMetricData({
                namespace: "AWS/ApiGateway",
                metricName: "5XXError",
                dimensions: dimsApi,
                startTime, endTime,
                stat: "Sum", period, maxPoints: 12
            }),
            this.getMetricData({
                namespace: "AWS/ApiGateway",
                metricName: "Count",
                dimensions: dimsApi,
                startTime, endTime,
                stat: "Sum", period, maxPoints: 12
            })
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Pad to 12 months if CloudWatch returns fewer buckets
        const pad = (arr, fill = 0) => {
            const padded = [...arr.map(p => p.y)];
            while (padded.length < 12) padded.push(fill);
            return padded;
        };

        const errorCounts = pad(errors.data);
        const totalCounts = pad(total.data, 1);

        const errorPct = errorCounts.map((e, i) =>
            Math.round((e / (totalCounts[i] || 1)) * 100)
        );
        const successPct = errorPct.map(v => 100 - v);

        return {
            data: {
                categories: months,
                series: [
                    { name: "Error", data: errorPct },
                    { name: "Success", data: successPct }
                ]
            }
        };
    }

    // GET /api/performance/resources
    async getResourceMetrics({ instanceId }) {
        const { day: { startTime, endTime } } = CloudWatchUtil.getPeriodRanges();
        const dimsAgent = [{ Name: "InstanceId", Value: instanceId }];

        const [cpu, memory, storage] = await Promise.all([
            this.getMetricData({
                namespace: "AWS/EC2",
                metricName: "CPUUtilization",
                dimensions: [{ Name: "InstanceId", Value: instanceId }],
                startTime, endTime,
                stat: "Average", period: 300, maxPoints: 288
            }),
            // Requires CloudWatch Agent installed on EC2
            this.getMetricData({
                namespace: "CWAgent",
                metricName: "mem_used_percent",
                dimensions: dimsAgent,
                startTime, endTime,
                stat: "Average", period: 300, maxPoints: 288
            }),
            // Requires CloudWatch Agent installed on EC2
            this.getMetricData({
                namespace: "CWAgent",
                metricName: "disk_used_percent",
                dimensions: dimsAgent,
                startTime, endTime,
                stat: "Average", period: 300, maxPoints: 288
            })
        ]);

        const latest = (d) => Math.round(d.data[d.data.length - 1]?.y ?? 0);

        return {
            data: {
                cpu:     { value: latest(cpu),     maxValue: 100, unit: "percent" },
                memory:  { value: latest(memory),  maxValue: 100, unit: "percent" },
                storage: { value: latest(storage), maxValue: 100, unit: "percent" }
            }
        };
    }

    // GET /api/performance/resources/timeseries
    async getResourceTimeseries({ instanceId }) {
        const dimsEc2   = [{ Name: "InstanceId", Value: instanceId }];
        const dimsAgent = [{ Name: "InstanceId", Value: instanceId }];

        const [cpu, memory, storage] = await Promise.all([
            this.getMetricByAllPeriods({
                namespace: "AWS/EC2",
                metricName: "CPUUtilization",
                dimensions: dimsEc2,
                stat: "Average"
            }),
            // Requires CloudWatch Agent
            this.getMetricByAllPeriods({
                namespace: "CWAgent",
                metricName: "mem_used_percent",
                dimensions: dimsAgent,
                stat: "Average"
            }),
            // Requires CloudWatch Agent
            this.getMetricByAllPeriods({
                namespace: "CWAgent",
                metricName: "disk_used_percent",
                dimensions: dimsAgent,
                stat: "Average"
            })
        ]);

        return { data: { cpu, memory, storage } };
    }
}

export default CloudWatchUtil;