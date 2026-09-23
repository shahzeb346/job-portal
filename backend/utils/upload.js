import multer from "multer";

const storage = multer.memoryStorage(); // disk pe kuch save nahi hoga, buffer memory mein rahega

const profileImageFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only JPG, JPEG, and PNG images are allowed."));
  }
  cb(null, true);
};

const resumeFilter = (_req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only PDF resumes are allowed."));
  }
  cb(null, true);
};

export const uploadProfileImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: profileImageFilter,
});

export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: resumeFilter,
});