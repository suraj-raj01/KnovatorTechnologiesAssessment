import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import "./workers/job.worker.js";
import "./cron/job.cron.js";
import "./queues/job.events.js";
import cors from 'cors'
import http from "http";
import { Server } from "socket.io";
import importLogsRoute from "./routes/importLogs.route.js";
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors())

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


// Socket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use("/api/import-logs", importLogsRoute);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
