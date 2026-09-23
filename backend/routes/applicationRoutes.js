import express from "express";
import {
  applyToJob, getMyApplications, getApplicantsForJob, updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/:jobId", protect, authorize("seeker"), applyToJob);
router.get("/mine", protect, authorize("seeker"), getMyApplications);
router.get("/job/:jobId", protect, authorize("employer"), getApplicantsForJob);
router.patch("/:id/status", protect, authorize("employer"), updateApplicationStatus);

export default router;
