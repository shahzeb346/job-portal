import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";

// Profile picture update
export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      "job-portal/profiles",
      "image",
      req.file.originalname
    );

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Resume upload
export const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      "job-portal/resumes",
      "raw",
      req.file.originalname
    );

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper: uploads company logo buffer (from multer memoryStorage) to Cloudinary
// Returns secure_url string, or null if no file was sent
const handleCompanyLogo = async (req) => {
  if (!req.file) return null;

  try {
    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      "job-portal/company-logos",
      "image",
      req.file.originalname
    );
    return result.secure_url;
  } catch (err) {
    console.error("CLOUDINARY UPLOAD ERROR:", err); // pura object print karega
    throw err;
  }
};

// @desc  Create a job posting (employer only)
// @route POST /api/jobs
export const createJob = async (req, res, next) => {
  try {
    const {
      title, description, requirements, location, jobType,
      category, experienceLevel, salaryMin, salaryMax, salaryCurrency,
      status, applicationDeadline,
      country, currency, visaSponsorship, relocationSupport,
      accommodationSupport, familySupport,
    } = req.body;

    if (!title || !description || !location || !jobType || !category) {
      res.status(400);
      throw new Error("Please fill in all required job fields");
    }

    const companyLogo = await handleCompanyLogo(req);

    const jobPayload = {
      title, description, requirements, location, jobType, category,
      experienceLevel, salaryMin, salaryMax, salaryCurrency,
      status: status || "published",
      applicationDeadline,
      employer: req.user._id,
      companyName: req.user.company?.name || req.user.name,
      companyLogo: companyLogo || req.user.company?.logoUrl || req.user.profileImage || "",
      visaSponsorship: Boolean(visaSponsorship),
      relocationSupport: Boolean(relocationSupport),
      accommodationSupport: Boolean(accommodationSupport),
      familySupport: Boolean(familySupport),
    };

    if (country) jobPayload.country = country;
    if (currency) jobPayload.currency = currency;
    if (visaSponsorship !== undefined) jobPayload.visaSponsorship = Boolean(visaSponsorship);
    if (relocationSupport !== undefined) jobPayload.relocationSupport = Boolean(relocationSupport);
    if (accommodationSupport !== undefined) jobPayload.accommodationSupport = Boolean(accommodationSupport);
    if (familySupport !== undefined) jobPayload.familySupport = Boolean(familySupport);

    const job = await Job.create(jobPayload);

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

// @desc  Get all published jobs with search, filters, and pagination
// @route GET /api/jobs
export const getJobs = async (req, res, next) => {
  try {
    const {
      keyword, location, jobType, category, experienceLevel,
      salaryMin, page = 1, limit = 10, sort = "-createdAt",
      country, currency, visaSponsorship, relocationSupport,
      accommodationSupport, familySupport,
    } = req.query;

    const query = { status: "published" };

    if (keyword) query.$text = { $search: keyword };
    if (location) query.location = { $regex: location, $options: "i" };
    if (jobType) query.jobType = jobType;
    if (category) query.category = { $regex: category, $options: "i" };
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (salaryMin) query.salaryMax = { $gte: Number(salaryMin) };
    if (country) query.country = { $regex: country, $options: "i" };
    if (currency) query.currency = currency;
    if (visaSponsorship !== undefined) query.visaSponsorship = visaSponsorship === "true" || visaSponsorship === true;
    if (relocationSupport !== undefined) query.relocationSupport = relocationSupport === "true" || relocationSupport === true;
    if (accommodationSupport !== undefined) query.accommodationSupport = accommodationSupport === "true" || accommodationSupport === true;
    if (familySupport !== undefined) query.familySupport = familySupport === "true" || familySupport === true;

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query).sort(sort).skip(skip).limit(Number(limit)),
      Job.countDocuments(query),
    ]);

    res.json({
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get a single job by id
// @route GET /api/jobs/:id
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("employer", "name company email profileImage");
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }
    job.views += 1;
    await job.save();
    res.json(job);
  } catch (err) {
    next(err);
  }
};

// @desc  Update a job (owner employer only)
// @route PUT /api/jobs/:id
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }
    if (job.employer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You are not authorized to edit this job");
    }

    const allowed = [
      "title", "description", "requirements", "location", "jobType",
      "category", "experienceLevel", "salaryMin", "salaryMax",
      "salaryCurrency", "status", "applicationDeadline", "country",
      "currency", "visaSponsorship", "relocationSupport",
      "accommodationSupport", "familySupport", "companyLogo",
    ];

    const companyLogo = req.file ? await handleCompanyLogo(req) : null;

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (["visaSponsorship", "relocationSupport", "accommodationSupport", "familySupport"].includes(field)) {
          job[field] = Boolean(req.body[field]);
        } else {
          job[field] = req.body[field];
        }
      }
    });

    if (companyLogo) {
      job.companyLogo = companyLogo;
    }

    const updated = await job.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc  Delete a job (owner employer only)
// @route DELETE /api/jobs/:id
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }
    if (job.employer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You are not authorized to delete this job");
    }

    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ message: "Job removed" });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all jobs posted by the logged-in employer
// @route GET /api/jobs/employer/mine
export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort("-createdAt");
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};