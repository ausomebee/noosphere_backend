import express from "express";
import PerformanceController from "../controller/performanceController.js";
import PerformanceDto from "../dto/performanceDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CheckTimeDto:
 *       type: object
 *       required:
 *         - startTime
 *         - endTime
 *       properties:
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2025-06-14T12:00:00Z"
 *           description: Start time in ISO 8601 format.
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2025-06-14T14:00:00Z"
 *           description: End time in ISO 8601 format. Must be later than startTime.
 */

class PerformanceRoutes {
    constructor() {
        this.controller = new PerformanceController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/performance/metrics:
         *   get:
         *     summary: Get all metrics within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: Metrics fetched successfully
         *       400:
         *         description: Invalid input (e.g. endTime earlier than startTime)
         */
        this.router.get("/metrics", PerformanceDto.checkTimeDto, this.controller.getAllMetrics);

        /**
         * @swagger
         * /api/v1/performance/cpu-utilization:
         *   get:
         *     summary: Get CPU utilization metric
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: CPU utilization fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/cpu-utilization", PerformanceDto.checkTimeDto, this.controller.getCPUUtilizationMetric);

        /**
         * @swagger
         * /api/v1/performance/disk-read-bytes:
         *   get:
         *     summary: Get disk read bytes metric
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: Disk read bytes fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/disk-read-bytes", PerformanceDto.checkTimeDto, this.controller.getDiskReadBytesMetric);

        /**
         * @swagger
         * /api/v1/performance/disk-write-bytes:
         *   get:
         *     summary: Get disk write bytes metric
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: Disk write bytes fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/disk-write-bytes", PerformanceDto.checkTimeDto, this.controller.getDiskWriteBytesMetric);

        /**
         * @swagger
         * /api/v1/performance/disk-read-ops:
         *   get:
         *     summary: Get disk read operations metric
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: Disk read ops fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/disk-read-ops", PerformanceDto.checkTimeDto, this.controller.getDiskReadOpsMetric);

        /**
         * @swagger
         * /api/v1/performance/disk-write-ops:
         *   get:
         *     summary: Get disk write operations metric
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: Disk write ops fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/disk-write-ops", PerformanceDto.checkTimeDto, this.controller.getDiskWriteOpsMetric);

        /**
         * @swagger
         * /api/v1/performance/network-in:
         *   get:
         *     summary: Get network in metric
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: Network in fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/network-in", PerformanceDto.checkTimeDto, this.controller.getNetworkInMetric);

        /**
         * @swagger
         * /api/v1/performance/network-out:
         *   get:
         *     summary: Get network out metric
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: Network out fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/network-out", PerformanceDto.checkTimeDto, this.controller.getNetworkOutMetric);

        /**
         * @swagger
         * /api/v1/performance/network-packets-in:
         *   get:
         *     summary: Get network packets in metric
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: Network packets in fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/network-packets-in", PerformanceDto.checkTimeDto, this.controller.getNetworkPacketsInMetric);

        /**
         * @swagger
         * /api/v1/performance/network-packets-out:
         *   get:
         *     summary: Get network packets out metric
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: Network packets out fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/network-packets-out", PerformanceDto.checkTimeDto, this.controller.getNetworkPacketsOutMetric);

        /**
         * @swagger
         * /api/v1/performance/status-check-failed:
         *   get:
         *     summary: Get status check failed metric
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: Status check failed fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/status-check-failed", PerformanceDto.checkTimeDto, this.controller.getStatusCheckFailedMetric);

        /**
         * @swagger
         * /api/v1/performance/status-check-failed-instance:
         *   get:
         *     summary: Get status check failed (instance) metric
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: Instance status check failed fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/status-check-failed-instance", PerformanceDto.checkTimeDto, this.controller.getStatusCheckFailedInstanceMetric);

        /**
         * @swagger
         * /api/v1/performance/status-check-failed-system:
         *   get:
         *     summary: Get status check failed (system) metric
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: System status check failed fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/status-check-failed-system", PerformanceDto.checkTimeDto, this.controller.getStatusCheckFailedSystemMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-cpu-utilization:
         *   get:
         *     summary: Get RDS CPU utilization within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS CPU utilization fetched successfully
         *       400:
         *         description: Invalid input (e.g. endTime earlier than startTime)
         */
        this.router.get("/rds-cpu-utilization", PerformanceDto.checkTimeDto, this.controller.getRDSCPUUtilizationMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-database-connections:
         *   get:
         *     summary: Get RDS database connections within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS database connections fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-database-connections", PerformanceDto.checkTimeDto, this.controller.getRDSDatabaseConnectionsMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-free-storage-space:
         *   get:
         *     summary: Get RDS free storage space within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS free storage space fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-free-storage-space", PerformanceDto.checkTimeDto, this.controller.getRDSFreeStorageSpaceMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-freeable-memory:
         *   get:
         *     summary: Get RDS freeable memory within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS freeable memory fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-freeable-memory", PerformanceDto.checkTimeDto, this.controller.getRDSFreeableMemoryMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-read-iops:
         *   get:
         *     summary: Get RDS read IOPS within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS read IOPS fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-read-iops", PerformanceDto.checkTimeDto, this.controller.getRDSReadIOPSMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-write-iops:
         *   get:
         *     summary: Get RDS write IOPS within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS write IOPS fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-write-iops", PerformanceDto.checkTimeDto, this.controller.getRDSWriteIOPSMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-read-latency:
         *   get:
         *     summary: Get RDS read latency within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS read latency fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-read-latency", PerformanceDto.checkTimeDto, this.controller.getRDSReadLatencyMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-write-latency:
         *   get:
         *     summary: Get RDS write latency within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS write latency fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-write-latency", PerformanceDto.checkTimeDto, this.controller.getRDSWriteLatencyMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-read-throughput:
         *   get:
         *     summary: Get RDS read throughput within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS read throughput fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-read-throughput", PerformanceDto.checkTimeDto, this.controller.getRDSReadThroughputMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-write-throughput:
         *   get:
         *     summary: Get RDS write throughput within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS write throughput fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-write-throughput", PerformanceDto.checkTimeDto, this.controller.getRDSWriteThroughputMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-replica-lag:
         *   get:
         *     summary: Get RDS replica lag within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS replica lag fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-replica-lag", PerformanceDto.checkTimeDto, this.controller.getRDSReplicaLagMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-swap-usage:
         *   get:
         *     summary: Get RDS swap usage within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS swap usage fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-swap-usage", PerformanceDto.checkTimeDto, this.controller.getRDSSwapUsageMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-disk-queue-depth:
         *   get:
         *     summary: Get RDS disk queue depth within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS disk queue depth fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-disk-queue-depth", PerformanceDto.checkTimeDto, this.controller.getRDSDiskQueueDepthMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-network-receive-throughput:
         *   get:
         *     summary: Get RDS network receive throughput within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS network receive throughput fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-network-receive-throughput", PerformanceDto.checkTimeDto, this.controller.getRDSNetworkReceiveThroughputMetric);

        /**
         * @swagger
         * /api/v1/performance/rds-network-transmit-throughput:
         *   get:
         *     summary: Get RDS network transmit throughput within a time range
         *     tags: [Performance]
         *     parameters:
         *       - in: query
         *         name: startTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T12:00:00Z"
         *         description: Start time in ISO 8601 format.
         *       - in: query
         *         name: endTime
         *         required: true
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2025-06-14T14:00:00Z"
         *         description: End time in ISO 8601 format. Must be later than startTime.
         *     responses:
         *       200:
         *         description: RDS network transmit throughput fetched successfully
         *       400:
         *         description: Invalid input
         */
        this.router.get("/rds-network-transmit-throughput", PerformanceDto.checkTimeDto, this.controller.getRDSNetworkTransmitThroughputMetric);

        // // GET /api/performance/general
        // router.get("/general", async (req, res) => {
        //     const result = await cloudwatch.getGeneralMetrics({
        //         instanceId: process.env.EC2_INSTANCE_ID,
        //         dbInstanceIdentifier: process.env.RDS_INSTANCE_ID,
        //         apiName: process.env.API_GATEWAY_NAME
        //     });
        //     res.json(result);
        // });

        // // GET /api/performance/general/timeseries
        // router.get("/general/timeseries", async (req, res) => {
        //     const result = await cloudwatch.getGeneralTimeseries({
        //         instanceId: process.env.EC2_INSTANCE_ID,
        //         dbInstanceIdentifier: process.env.RDS_INSTANCE_ID,
        //         apiName: process.env.API_GATEWAY_NAME
        //     });
        //     res.json(result);
        // });

        // // GET /api/performance/api-error-rate
        // router.get("/api-error-rate", async (req, res) => {
        //     const result = await cloudwatch.getApiErrorRate({
        //         apiName: process.env.API_GATEWAY_NAME
        //     });
        //     res.json(result);
        // });

        // // GET /api/performance/resources
        // router.get("/resources", async (req, res) => {
        //     const result = await cloudwatch.getResourceMetrics({
        //         instanceId: process.env.EC2_INSTANCE_ID
        //     });
        //     res.json(result);
        // });

        // // GET /api/performance/resources/timeseries
        // router.get("/resources/timeseries", async (req, res) => {
        //     const result = await cloudwatch.getResourceTimeseries({
        //         instanceId: process.env.EC2_INSTANCE_ID
        //     });
        //     res.json(result);
        // });

    }

    getRouter() {
        return this.router;
    }
}

export default new PerformanceRoutes().getRouter();
