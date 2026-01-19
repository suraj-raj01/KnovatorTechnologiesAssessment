import express from "express";
import ImportLog from "../models/ImportLog.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ImportLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ImportLog.countDocuments()
    ]);

    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        totalRecords: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit
      }
    });
  } catch (error) {
    console.error("Error fetching import logs:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch import logs"
    });
  }
});

export default router;
