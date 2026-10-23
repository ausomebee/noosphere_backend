import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

export default router;