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

    async getMetricData({ namespace, metricName, dimensions, startTime, endTime, stat, period }) {
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
                            Dimensions: dimensions,
                        },
                        Period: period,
                        Stat: stat,
                    },
                    ReturnData: true,
                },
            ],
        });

        try {
            const data = await this.client.send(command);
            return data.MetricDataResults;
        } catch (err) {
            console.error("Error fetching CloudWatch metric data:", err);
            throw err;
        }
    }

    async getCPUUtilization({ instanceId, startTime, endTime, period = 300, stat = "Average" }) {
        return this.getMetricData({
            namespace: "AWS/EC2",
            metricName: "CPUUtilization",
            dimensions: [{ Name: "InstanceId", Value: instanceId }],
            startTime,
            endTime,
            period,
            stat
        });
    }

    async getNetworkIn({ instanceId, startTime, endTime, period = 300, stat = "Sum" }) {
        return this.getMetricData({
            namespace: "AWS/EC2",
            metricName: "NetworkIn",
            dimensions: [{ Name: "InstanceId", Value: instanceId }],
            startTime,
            endTime,
            period,
            stat
        });
    }

    async getNetworkOut({ instanceId, startTime, endTime, period = 300, stat = "Sum" }) {
        return this.getMetricData({
            namespace: "AWS/EC2",
            metricName: "NetworkOut",
            dimensions: [{ Name: "InstanceId", Value: instanceId }],
            startTime,
            endTime,
            period,
            stat
        });
    }

    async getDiskReadBytes({ instanceId, startTime, endTime, period = 300, stat = "Sum" }) {
        return this.getMetricData({
            namespace: "AWS/EC2",
            metricName: "DiskReadBytes",
            dimensions: [{ Name: "InstanceId", Value: instanceId }],
            startTime,
            endTime,
            period,
            stat
        });
    }

    async getDiskWriteBytes({ instanceId, startTime, endTime, period = 300, stat = "Sum" }) {
        return this.getMetricData({
            namespace: "AWS/EC2",
            metricName: "DiskWriteBytes",
            dimensions: [{ Name: "InstanceId", Value: instanceId }],
            startTime,
            endTime,
            period,
            stat
        });
    }
}

export default new CloudWatchUtil({ secretAccessKey: process.env.CLOUDWATCH_SECRET, accessKeyId: process.env.CLOUDWATCH_ACCESSKEY, region: process.env.AWS_REGION });