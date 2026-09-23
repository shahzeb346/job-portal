import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { uploadProfileImage as profileUploader } from "../utils/upload.js";

const router = express.Router();

router.post("/register", profileUploader.single("profileImage"), register);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;
