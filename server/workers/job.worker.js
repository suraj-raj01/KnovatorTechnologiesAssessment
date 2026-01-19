import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import Job from "../models/Job.js";
import ImportLog from "../models/ImportLog.js";

const getGuid = (job) => {
  if (!job.guid) return null;
  if (typeof job.guid === "string") return job.guid;
  if (typeof job.guid === "object") return job.guid._;
  return null;
};

const mapJob = (job, source) => ({
  externalId: getGuid(job),
  source,
  title: job.title,
  company: job["dc:creator"] || "Unknown",
  location: job.location || "Remote",
  description: job.description,
  url: job.link
});

new Worker(
  "job-import",
  async ({ data }) => {
    console.log("🛠 Worker started");

    const log = await ImportLog.create({
      fileName: data.feed,
      totalFetched: data.jobs.length,
      failures: [],
      startedAt: new Date()
    });

    let newJobs = 0;
    let updatedJobs = 0;
    let failedJobs = 0;

    for (const job of data.jobs) {
      try {
        const externalId = getGuid(job);
        if (!externalId) {
          failedJobs++;
          log.failures.push({ reason: "Missing GUID", payload: job });
          continue;
        }

        const res = await Job.updateOne(
          { externalId, source: data.feed },
          { $set: mapJob(job, data.feed) },
          { upsert: true }
        );

        if (res.upsertedId) newJobs++;
        else updatedJobs++;

      } catch (err) {
        failedJobs++;
        log.failures.push({ reason: err.message, payload: job });
      }
    }

    Object.assign(log, {
      newJobs,
      updatedJobs,
      failedJobs,
      totalImported: newJobs + updatedJobs,
      completedAt: new Date()
    });

    await log.save();

    console.log("✅ Import completed");
  },
  {
    connection: redis,
    concurrency: 5
  }
);
