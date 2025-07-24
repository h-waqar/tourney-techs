import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"; // use async fs for better compatibility

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload to Cloudinary and remove local file after upload
export const uploadOnCloudinary = async (localFilePath, folder = "uploads") => {
  try {
    if (!localFilePath) {
      console.warn("No file path provided for Cloudinary upload.");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "auto", // auto-detect image, video, etc.
    });

    console.log("✅ Uploaded to Cloudinary:", response.secure_url);

    await fs.unlink(localFilePath); // async delete
    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.message);

    // Clean up local file if exists
    try {
      await fs.unlink(localFilePath);
      console.warn("🧹 Cleaned up local file:", localFilePath);
    } catch (error) {
      console.error("❌ Failed to delete local file:", localFilePath);
      console.error("❌ Cloudinary upload error:", error);
    }

    throw new Error("Cloudinary upload failed");
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      console.log(`🗑️ Deleted from Cloudinary: ${publicId}`);
    } else {
      console.warn(`⚠️ Cloudinary delete response: ${result.result}`);
    }

    return result;
  } catch (error) {
    console.error("❌ Cloudinary delete failed:", error.message);
    throw error;
  }
};
