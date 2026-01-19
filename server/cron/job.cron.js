import cron from "node-cron";
import { fetchJobsFromAPI } from "../services/fetchJobs.service.js";
import { jobQueue } from "../queues/job.queue.js";

const FEEDS = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm"
];

cron.schedule("*/1 * * * *", async () => {
  console.log("⏰ Cron triggered");

  for (const feed of FEEDS) {
    try {
      // console.log("📥 Fetching feed:", feed);
      const jobs = await fetchJobsFromAPI(feed);
      // console.log(`📊 Jobs fetched: ${jobs.length}`);
      await jobQueue.add("import", { jobs, feed });
      // console.log("📤 Job added to queue");
    } catch (err) {
      console.error("❌ Cron error for feed:", feed, err.message);
    }
  }
});
