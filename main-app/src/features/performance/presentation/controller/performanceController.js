import expressAsyncHandler from "express-async-handler";
import PerformanceService from "../../application/performanceService.js";
import CloudWatchUtil from "../../../../utilities/cloudWatch.js";

class PerformanceController {
    constructor() {
        this.cloudWatchUtil = new CloudWatchUtil({ secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, accessKeyId: process.env.AWS_ACCESS_KEY_ID, region: process.env.AWS_REGION });
        this.service = new PerformanceService({ cloudWatchUtil: this.cloudWatchUtil });
    }

    getAllMetrics = expressAsyncHandler(async (req, res) => {
        const metrics = await this.service.getAllMetrics({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!metrics) {
            res.status(500).json({ message: 'Failed to fetch metrics' });
        }

        return res.status(200).json({
            message: "metrics fetched successfully",
            status: 'ok',
            data: metrics
        });
    });

    getCPUUtilizationMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getCPUUtilizationMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch CPU utilization metric' });
        }

        return res.status(200).json({
            message: "CPU utilization fetched successfully",
            status: 'ok',
            data
        });
    });

    getDiskReadBytesMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getDiskReadBytesMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch disk read bytes' });
        }

        return res.status(200).json({
            message: "Disk read bytes fetched successfully",
            status: 'ok',
            data
        });
    });

    getDiskWriteBytesMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getDiskWriteBytesMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch disk write bytes' });
        }

        return res.status(200).json({
            message: "Disk write bytes fetched successfully",
            status: 'ok',
            data
        });
    });

    getDiskReadOpsMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getDiskReadOpsMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch disk read ops' });
        }

        return res.status(200).json({
            message: "Disk read ops fetched successfully",
            status: 'ok',
            data
        });
    });

    getDiskWriteOpsMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getDiskWriteOpsMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch disk write ops' });
        }

        return res.status(200).json({
            message: "Disk write ops fetched successfully",
            status: 'ok',
            data
        });
    });

    getNetworkInMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getNetworkInMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch network in' });
        }

        return res.status(200).json({
            message: "Network in fetched successfully",
            status: 'ok',
            data
        });
    });

    getNetworkOutMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getNetworkOutMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch network out' });
        }

        return res.status(200).json({
            message: "Network out fetched successfully",
            status: 'ok',
            data
        });
    });

    getNetworkPacketsInMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getNetworkPacketsInMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch network packets in' });
        }

        return res.status(200).json({
            message: "Network packets in fetched successfully",
            status: 'ok',
            data
        });
    });

    getNetworkPacketsOutMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getNetworkPacketsOutMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch network packets out' });
        }

        return res.status(200).json({
            message: "Network packets out fetched successfully",
            status: 'ok',
            data
        });
    });

    getStatusCheckFailedMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getStatusCheckFailedMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch status check failed' });
        }

        return res.status(200).json({
            message: "Status check failed fetched successfully",
            status: 'ok',
            data
        });
    });

    getStatusCheckFailedInstanceMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getStatusCheckFailedInstanceMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch instance check failed' });
        }

        return res.status(200).json({
            message: "Instance status check failed fetched successfully",
            status: 'ok',
            data
        });
    });

    getStatusCheckFailedSystemMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getStatusCheckFailedSystemMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch system check failed' });
        }

        return res.status(200).json({
            message: "System status check failed fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSCPUUtilizationMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSCPUUtilizationMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS CPU utilization' });
        }

        return res.status(200).json({
            message: "RDS CPU utilization fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSDatabaseConnectionsMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSDatabaseConnectionsMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS database connections' });
        }

        return res.status(200).json({
            message: "RDS database connections fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSFreeStorageSpaceMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSFreeStorageSpaceMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS free storage space' });
        }

        return res.status(200).json({
            message: "RDS free storage space fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSFreeableMemoryMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSFreeableMemoryMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS freeable memory' });
        }

        return res.status(200).json({
            message: "RDS freeable memory fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSReadIOPSMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSReadIOPSMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS read IOPS' });
        }

        return res.status(200).json({
            message: "RDS read IOPS fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSWriteIOPSMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSWriteIOPSMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS write IOPS' });
        }

        return res.status(200).json({
            message: "RDS write IOPS fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSReadLatencyMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSReadLatencyMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS read latency' });
        }

        return res.status(200).json({
            message: "RDS read latency fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSWriteLatencyMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSWriteLatencyMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS write latency' });
        }

        return res.status(200).json({
            message: "RDS write latency fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSReadThroughputMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSReadThroughputMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS read throughput' });
        }

        return res.status(200).json({
            message: "RDS read throughput fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSWriteThroughputMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSWriteThroughputMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS write throughput' });
        }

        return res.status(200).json({
            message: "RDS write throughput fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSReplicaLagMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSReplicaLagMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS replica lag' });
        }

        return res.status(200).json({
            message: "RDS replica lag fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSSwapUsageMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSSwapUsageMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS swap usage' });
        }

        return res.status(200).json({
            message: "RDS swap usage fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSDiskQueueDepthMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSDiskQueueDepthMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS disk queue depth' });
        }

        return res.status(200).json({
            message: "RDS disk queue depth fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSNetworkReceiveThroughputMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSNetworkReceiveThroughputMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS receive throughput' });
        }

        return res.status(200).json({
            message: "RDS network receive throughput fetched successfully",
            status: 'ok',
            data
        });
    });

    getRDSNetworkTransmitThroughputMetric = expressAsyncHandler(async (req, res) => {
        const data = await this.service.getRDSNetworkTransmitThroughputMetric({
            startTime: new Date(req.query.startTime),
            endTime: new Date(req.query.endTime)
        });

        if (!data) {
            return res.status(500).json({ message: 'Failed to fetch RDS transmit throughput' });
        }

        return res.status(200).json({
            message: "RDS network transmit throughput fetched successfully",
            status: 'ok',
            data
        });
    });

}

export default PerformanceController;