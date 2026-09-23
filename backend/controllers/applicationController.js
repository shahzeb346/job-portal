import Application from "../models/Application.js";
import Job from "../models/Job.js";

// @desc  Apply to a job (seeker only)
// @route POST /api/applications/:jobId
export const applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { resume, coverLetter } = req.body;

    if (!resume?.url) {
      res.status(400);
      throw new Error("A resume is required to apply");
    }

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    const alreadyApplied = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (alreadyApplied) {
      res.status(409);
      throw new Error("You have already applied to this job");
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      employer: job.employer,
      resume: {
        url: resume.url,
        originalName: resume.originalName || "",
        fileSize: resume.fileSize || 0,
      },
      coverLetter,
    });

    job.applicantsCount += 1;
    await job.save();

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

// @desc  Get the logged-in seeker's applications
// @route GET /api/applications/mine
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title companyName location jobType status")
      .sort("-createdAt");
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

// @desc  Get all applicants for a specific job (owner employer only)
// @route GET /api/applications/job/:jobId
export const getApplicantsForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }
    if (job.employer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You are not authorized to view these applicants");
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email headline skills experience education resumeUrl links")
      .sort("-createdAt");

    res.json(applications);
  } catch (err) {
    next(err);
  }
};

// @desc  Update an application's status (owner employer only)
// @route PATCH /api/applications/:id/status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["applied", "viewed", "shortlisted", "rejected", "hired"];
    if (!allowed.includes(status)) {
      res.status(400);
      throw new Error("Invalid status value");
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }
    if (application.employer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You are not authorized to update this application");
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    next(err);
  }
};
