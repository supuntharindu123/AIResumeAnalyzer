import Resume from "../model/Resume.js";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";

export async function analyzeResume(req, res) {
  if (!req.file || !req.body.jobDescription) {
    return res.status(400).json({
      error: !req.file
        ? "No resume file provided"
        : "No job description provided",
    });
  }

  try {
    let analysis;

    try {
      const fileBuffer = fs.readFileSync(req.file.path);

      const formData = new FormData();
      formData.append("resume", fileBuffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
      formData.append("jobDescription", req.body.jobDescription);

      const response = await axios.post(
        "http://localhost:5001/analyze-resume-jd",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      analysis = response.data;
      console.log("AI analysis successful:", analysis);
    } catch (aiError) {
      console.log("AI analysis failed, using fallback:", aiError.message);

      // Fallback analysis
      analysis = {
        structured: {
          keywords: [],
          missingKeywords: [],
          formatIssues: [],
          suggestions: [],
        },
        matchScore: 0,
        feedback: "Analysis completed with basic scoring",
      };
    }

    const resume = await Resume.create({
      owner: req.user._id,
      fileOriginalName: req.file.originalname,
      fileName: req.file.filename,
      jobDescription: req.body.jobDescription,
      analysis: analysis.structured || {},
      matchScore: analysis.matchScore || 0,
      feedback: analysis.feedback || "Analysis completed",
    });

    // Clean up uploaded file
    try {
      fs.unlinkSync(req.file.path);
    } catch (cleanupError) {
      console.warn("Failed to cleanup uploaded file:", cleanupError.message);
    }

    return res.status(200).json({
      message: "Analysis completed successfully",
      id: resume._id,
      analysis: analysis.structured || {},
      matchScore: analysis.matchScore || 0,
    });
  } catch (err) {
    console.error("Analysis error:", err);

    // Clean up uploaded file on error
    try {
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
    } catch (cleanupError) {
      console.warn(
        "Failed to cleanup uploaded file after error:",
        cleanupError.message
      );
    }

    return res.status(500).json({
      error: "Analysis failed: " + err.message,
      details: err.message, // Don't expose stack trace in production
    });
  }
}

export async function getResumeById(req, res) {
  try {
    const { id } = req.params;

    const resume = await Resume.findById(id)
      .populate("owner", "name email")
      .select("-__v");

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (resume.owner._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this resume" });
    }

    console.log("Fetched resume:", resume);

    const response = {
      id: resume._id,
      fileName: resume.fileName,
      uploadDate: resume.createdAt,
      owner: {
        name: resume.owner.name,
        email: resume.owner.email,
      },
      content: resume.content,
      jobDescription: resume.jobDescription,
      analysis: resume.analysis,
      matchScore: resume.matchScore,
      feedback: resume.feedback,
      structuredData: resume.structuredData || {},
    };

    console.log("Formatted response:", response);
    return res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching resume:", err);
    return res.status(500).json({
      error: "Failed to fetch resume data",
      details: err.message,
    });
  }
}

export async function getAllResumesByUser(req, res) {
  try {
    const userId = req.user._id;

    // Get total count for pagination
    const totalResumes = await Resume.countDocuments({ owner: userId });

    // Find resumes with sorting (newest first)
    const resumes = await Resume.find({ owner: userId })
      .populate("owner", "name email")
      .select("-__v")
      .sort({ createdAt: -1 });

    // Format the response data
    const formattedResumes = resumes.map((resume) => {
      const matchScore = resume.matchScore || 0;
      let status = "Not Analyzed";

      if (matchScore > 0) {
        if (matchScore >= 70) status = "Good Match";
        else if (matchScore >= 50) status = "Fair Match";
        else status = "Poor Match";
      }

      return {
        id: resume._id,
        fileName: resume.fileOriginalName,
        uploadDate: resume.createdAt,
        lastModified: resume.updatedAt,
        matchScore: matchScore,
        jobDescription: resume.jobDescription
          ? resume.jobDescription.substring(0, 100) + "..."
          : "No description",
        status: status,
        owner: {
          name: resume.owner.name,
          email: resume.owner.email,
        },
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedResumes,
      message: `Found ${formattedResumes.length} resumes`,
    });
  } catch (err) {
    console.error("Error fetching user resumes:", err);
    return res.status(500).json({
      error: "Failed to fetch resume data",
      details: err.message,
    });
  }
}

export async function getUserResumeStats(req, res) {
  try {
    const userId = req.user._id;

    const stats = await Resume.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: null,
          totalResumes: { $sum: 1 },
          averageScore: { $avg: "$matchScore" },
          highestScore: { $max: "$matchScore" },
          lowestScore: { $min: "$matchScore" },
          recentUploads: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    "$createdAt",
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const result = stats[0] || {
      totalResumes: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      recentUploads: 0,
    };

    return res.status(200).json({
      success: true,
      stats: result,
      message: "User resume statistics retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching user resume stats:", err);
    return res.status(500).json({
      error: "Failed to fetch resume statistics",
      details: err.message,
    });
  }
}

export async function deleteResume(req, res) {
  try {
    const { id } = req.params;

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (resume.owner.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this resume" });
    }

    // Delete the file from the filesystem
    const filePath = `uploads/${resume.fileName}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Resume.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting resume:", err);
    return res.status(500).json({
      error: "Failed to delete resume",
      details: err.message,
    });
  }
}
