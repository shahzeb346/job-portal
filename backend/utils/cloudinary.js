import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a buffer (from multer memoryStorage) directly to Cloudinary.
 * @param {Buffer} buffer - req.file.buffer
 * @param {string} folder - e.g. "job-portal/profiles" or "job-portal/resumes"
 * @param {"image"|"raw"|"auto"} resourceType - "image" for pics, "raw" for PDFs
 * @param {string} originalName - used to keep a readable filename/extension on Cloudinary
 */
// export const uploadBufferToCloudinary = (buffer, folder, resourceType = "auto", originalName = "file") => {
//   if (!buffer) throw new Error("No file buffer provided to uploadBufferToCloudinary");

//   if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
//     throw new Error("Cloudinary credentials are missing from environment variables");
//   }

//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder,
//         resource_type: resourceType,
//         public_id: originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "_"),
//         use_filename: true,
//         unique_filename: true,
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );

//     Readable.from(buffer).pipe(uploadStream);
//   });
// };

// /**
//  * Deletes a file from Cloudinary using its public_id.
//  * @param {string} publicId - the public_id returned from uploadBufferToCloudinary (result.public_id)
//  * @param {"image"|"raw"|"video"} resourceType - must match the type used when uploading
//  */
// export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
//   if (!publicId) return null;

//   if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
//     throw new Error("Cloudinary credentials are missing from environment variables");
//   }

//   return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
// };

// export default cloudinary;


export const uploadBufferToCloudinary = (
  buffer,
  folder,
  resourceType = "auto",
  originalName = "file.pdf"
) => {
  if (!buffer) {
    throw new Error("No file buffer provided");
  }

  return new Promise((resolve, reject) => {
    const extension =
      originalName.split(".").pop()?.toLowerCase() || "pdf";

    const filenameWithoutExtension = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,

        // PDF must be raw
        resource_type: extension === "pdf" ? "raw" : resourceType,

        // IMPORTANT
        public_id: `${filenameWithoutExtension}.${extension}`,

        use_filename: false,
        unique_filename: true,
      },

      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }

        console.log("Cloudinary upload successful:", {
          public_id: result.public_id,
          resource_type: result.resource_type,
          format: result.format,
          secure_url: result.secure_url,
        });

        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  if (!publicId) return null;

  if (
    !process.env.CLOUDINARY_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary credentials are missing");
  }

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};