import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

export const jobQueue = new Queue("job-import", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 }
  }
});
