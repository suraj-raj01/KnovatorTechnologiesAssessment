import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import Job from "../models/Job.js";
import ImportLog from "../models/ImportLog.js";

// Safely extract GUID

const getGuid = (job) => {
  if (!job?.guid) return null;
  if (typeof job.guid === "string") return job.guid;
  if (typeof job.guid === "object") return job.guid._ || null;
  return null;
};

//Normalize job payload

const mapJob = (job, source) => ({
  externalId: getGuid(job),
  source,
  title: job.title || "Untitled",
  company: job["dc:creator"] || "Unknown",
  location: job.location || "Remote",
  description: job.description || "",
  url: job.link || ""
});

// Worker
// this will import job feed and save into database
new Worker(
  "job-import",
  async (job) => {
    const { feed, jobs } = job.data;

    console.log(`🛠 Worker started for feed: ${feed}`);

    const log = await ImportLog.create({
      fileName: feed,
      totalFetched: jobs.length,
      failures: [],
      startedAt: new Date()
    });

    let newJobs = 0;
    let updatedJobs = 0;
    let failedJobs = 0;

    for (let i = 0; i < jobs.length; i++) {
      const item = jobs[i];

      try {
        const externalId = getGuid(item);
        if (!externalId) {
          failedJobs++;
          log.failures.push({
            reason: "Missing GUID",
            payload: item
          });
          continue;
        }

        const res = await Job.updateOne(
          { externalId, source: feed },
          { $set: mapJob(item, feed) },
          { upsert: true }
        );

        res.upsertedId ? newJobs++ : updatedJobs++;

      } catch (err) {
        failedJobs++;
        log.failures.push({
          reason: err.message,
          payload: item
        });
      }

      // 🔔 Emit progress (used by Socket.IO via QueueEvents)
      await job.updateProgress(
        Math.round(((i + 1) / jobs.length) * 100)
      );
      console.log("📊 Progress:", Math.round(((i + 1) / jobs.length) * 100));

    }

    Object.assign(log, {
      newJobs,
      updatedJobs,
      failedJobs,
      totalImported: newJobs + updatedJobs,
      completedAt: new Date()
    });

    await log.save();

    console.log(`✅ Import completed for feed: ${feed}`);

    return {
      feed,
      newJobs,
      updatedJobs,
      failedJobs,
      total: jobs.length
    };
  },
  {
    connection: {
      ...redis.options,
      maxRetriesPerRequest: null
    },
    concurrency: 5
  }
);
