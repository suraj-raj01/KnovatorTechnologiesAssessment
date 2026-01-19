import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  externalId: { type: String, required: true },
  source: { type: String, required: true },
  title: String,
  company: String,
  location: String,
  description: String,
  url: String
}, { timestamps: true });

JobSchema.index({ externalId: 1, source: 1 }, { unique: true });

export default mongoose.model("Job", JobSchema);
