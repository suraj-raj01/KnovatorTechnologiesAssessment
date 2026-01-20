import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

// Queue for handling job imports asynchronously using BullMQ + Redis

export const jobQueue = new Queue("job-import", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 }
  }
});
