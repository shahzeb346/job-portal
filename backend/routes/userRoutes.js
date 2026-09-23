import express from "express";
import { updateProfile, getUserById, getMe, uploadProfileImage, removeProfileImage, uploadResume, removeResume } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { uploadProfileImage as profileUploader, uploadResume as resumeUploader } from "../utils/upload.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.post("/me/profile-image", protect, profileUploader.single("profileImage"), uploadProfileImage);
router.delete("/me/profile-image", protect, removeProfileImage);
router.post("/me/resume", protect, resumeUploader.single("resume"), uploadResume);
router.delete("/me/resume", protect, removeResume);
router.put("/me", protect, updateProfile);
router.get("/:id", protect, getUserById);

export default router;
