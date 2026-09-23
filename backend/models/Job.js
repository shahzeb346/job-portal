import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    companyLogo: { type: String, default: "" },

    location: { type: String, required: true },
    country: { type: String },
    currency: {
      type: String,
      enum: ["PKR", "SAR", "AED", "QAR", "KWD", "OMR", "BHD"],
    },
    visaSponsorship: { type: Boolean, default: false },
    relocationSupport: { type: Boolean, default: false },
    accommodationSupport: { type: Boolean, default: false },
    familySupport: { type: Boolean, default: false },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      required: true,
    },
    category: { type: String, required: true, trim: true },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead"],
      default: "entry",
    },

    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    salaryCurrency: { type: String, default: "USD" },

    status: { type: String, enum: ["draft", "published", "closed"], default: "published" },
    applicationDeadline: { type: Date },

    views: { type: Number, default: 0 },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", category: "text", companyName: "text" });

export default mongoose.model("Job", jobSchema);
