import User from "../models/User.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @desc  Upload / replace profile picture
// @route POST /api/users/me/profile-image
export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please select a profile picture.");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Purani image Cloudinary se delete kar dein (agar hai)
    if (user.profileImagePublicId) {
      await deleteFromCloudinary(user.profileImagePublicId, "image");
    }

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      "job-portal/profiles",
      "image",
      req.file.originalname
    );

    user.profileImage = result.secure_url;
    user.profileImagePublicId = result.public_id;
    await user.save();

    res.status(201).json({
      message: "Profile picture uploaded.",
      profileImage: user.profileImage,
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Remove profile picture
// @route DELETE /api/users/me/profile-image
export const removeProfileImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.profileImagePublicId) {
      await deleteFromCloudinary(user.profileImagePublicId, "image");
    }

    user.profileImage = "";
    user.profileImagePublicId = "";
    await user.save();

    res.json({ message: "Profile picture removed.", profileImage: "" });
  } catch (err) {
    next(err);
  }
};

// @desc  Upload / replace resume
// @route POST /api/users/me/resume
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please select a resume.");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.resume?.publicId) {
      await deleteFromCloudinary(user.resume.publicId, "raw");
    }

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      "job-portal/resumes",
      "raw", // PDF isliye "raw"
      req.file.originalname
    );

    user.resume = {
      url: result.secure_url,
      publicId: result.public_id,
      originalName: req.file.originalname,
      fileSize: req.file.size,
    };
    await user.save();

    res.status(201).json({ message: "Resume uploaded.", resume: user.resume });
  } catch (err) {
    next(err);
  }
};

// @desc  Remove resume
// @route DELETE /api/users/me/resume
export const removeResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.resume?.publicId) {
      await deleteFromCloudinary(user.resume.publicId, "raw");
    }

    user.resume = { url: "", publicId: "", originalName: "", fileSize: 0 };
    await user.save();

    res.json({ message: "Resume removed.", resume: user.resume });
  } catch (err) {
    next(err);
  }
};

// @desc  Update the logged-in user's profile (seeker or employer fields)
// @route PUT /api/users/me
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const allowedFields =
      user.role === "seeker"
        ? ["name", "headline", "skills", "experience", "education", "resumeUrl", "links"]
        : ["name", "company"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.body.profileImage !== undefined) {
      user.profileImage = req.body.profileImage || "";
    }

    const updated = await user.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc  Get a public profile by id (used by employers viewing applicants)
// @route GET /api/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name role headline skills experience education resumeUrl links company profileImage resume"
    );
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};