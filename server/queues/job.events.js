// job.events.js
import { QueueEvents } from "bullmq";
import { redis } from "../config/redis.js";
import { io } from "../server.js";

const queueEvents = new QueueEvents("job-import", {
  connection: {
    host: redis.options.host,
    port: redis.options.port,
    password: redis.options.password,
    maxRetriesPerRequest: null
  }
});

// Ensure connection is ready
queueEvents.waitUntilReady().then(() => {
  console.log("📡 QueueEvents listening for job-import");
});

// Progress updates
queueEvents.on("progress", ({ jobId, data }) => {
  io.emit("import:progress", {
    jobId,
    progress: data
  });
});

// Job completed
queueEvents.on("completed", ({ jobId }) => {
  io.emit("import:completed", { jobId });
});

// Job failed
queueEvents.on("failed", ({ jobId, failedReason }) => {
  io.emit("import:failed", {
    jobId,
    reason: failedReason
  });
});

// Optional error handling
queueEvents.on("error", (err) => {
  console.error("❌ QueueEvents error:", err);
});
