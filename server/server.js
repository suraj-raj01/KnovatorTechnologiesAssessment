import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import "./workers/job.worker.js";
import "./cron/job.cron.js";
import cors from 'cors'
import importLogsRoute from "./routes/importLogs.route.js";
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/import-logs", importLogsRoute);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
