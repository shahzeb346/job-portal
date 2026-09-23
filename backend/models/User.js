import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["seeker", "employer", "admin"], required: true, default: "seeker" },

    // Seeker-only fields
    headline: { type: String, default: "" },
    skills: [{ type: String }],
    experience: { type: String, default: "" },
    education: { type: String, default: "" },
    preferredCountries: [{ type: String }],
    // preferredCurrency: { type: String, enum: ["PKR", "SAR", "AED", "QAR", "KWD", "OMR", "BHD"], default: "" },
    preferredCurrency: { type: String, enum: ["PKR", "SAR", "AED", "QAR", "KWD", "OMR", "BHD"] },
    openToRelocation: { type: Boolean, default: false },
    visaSponsorshipRequired: { type: Boolean, default: false },
    familyRelocationPreference: { type: Boolean, default: false },
    profileImage: { type: String, default: "" },
    resume: {
      url: { type: String, default: "" },
      originalName: { type: String, default: "" },
      fileSize: { type: Number, default: 0 },
    },
    resumeUrl: { type: String, default: "" },
    links: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },

    // Employer-only fields
    company: {
      name: { type: String, default: "" },
      website: { type: String, default: "" },
      industry: { type: String, default: "" },
      size: { type: String, default: "" },
      logoUrl: { type: String, default: "" },
      description: { type: String, default: "" },
    },

    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
