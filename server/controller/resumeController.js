import Resume from "../model/Resume.js"; // Add .js extension
import User from "../model/User.js";
import multer from "multer";

export async function uploadResume(req, res) {
  const file = req.file;
  try {
    const userId = req.user._id;
    const resume = await Resume.create({
      owner: userId,
      fileName: file.filename,
    });
    return res.status(200).json({
      message: "Resume uploaded successfully",
      resumeId: resume._id,
    });
  } catch (err) {
    console.error("Error uploading resume:", err);
    return res.status(500).json({ error: "Failed to upload resume" });
  }
}
