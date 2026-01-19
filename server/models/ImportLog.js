import mongoose from "mongoose";

const ImportLogSchema = new mongoose.Schema({
  fileName: String,
  totalFetched: Number,
  totalImported: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: Number,
  failures: [{
    reason: String,
    payload: Object
  }],
  startedAt: Date,
  completedAt: Date
}, { timestamps: true });

export default mongoose.model("ImportLog", ImportLogSchema);
