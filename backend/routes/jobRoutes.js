import express from "express";
import {
  createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs,
} from "../controllers/jobController.js";
import { protect, authorize } from "../middleware/auth.js";
import { uploadProfileImage } from "../utils/upload.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/employer/mine", protect, authorize("employer"), getMyJobs);
router.get("/:id", getJobById);
router.post("/", protect, authorize("employer"), uploadProfileImage.single("companyLogo"), createJob);
router.put("/:id", protect, authorize("employer"), uploadProfileImage.single("companyLogo"), updateJob);
router.delete("/:id", protect, authorize("employer"), deleteJob);

export default router;
