import cron from "node-cron";
import { fetchJobsFromAPI } from "../services/fetchJobs.service.js";
import { jobQueue } from "../queues/job.queue.js";

// Feed APIs
const FEEDS = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm"
];

// ------------------------------
// Job import handler
// ------------------------------
const runJobImport = async () => {
  console.log("🚀 Job import started");

  for (const feed of FEEDS) {
    try {
      const jobs = await fetchJobsFromAPI(feed);
      await jobQueue.add("import", { jobs, feed });
    } catch (err) {
      console.error("❌ Import error for feed:", feed, err.message);
    }
  }

  console.log("✅ Job import queued");
};

// ------------------------------
// 1️⃣ Run immediately on startup
// ------------------------------
runJobImport();

// 2️⃣ Schedule every 1 hour
cron.schedule("0 * * * *", () => {
  console.log("⏰ Hourly cron triggered");
  runJobImport();
});
 