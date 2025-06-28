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
    // console.log("PDF extraction successful, length:", resumeText.length);
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
      console.log(
        "OpenAI analysis failed, using local analysis:",
        aiError.message
      );
    }

    const resume = await Resume.create({
      owner: req.user._id,
      fileName: req.file.filename,

      jobDescription: req.body.jobDescription,
      analysis: analysis.structured,
      matchScore: analysis.matchScore,
      feedback: analysis.feedback,
    });

    return res.status(200).json({
      message: "Analysis completed successfully",
      id: resume._id,
      analysis: analysis.structured,
      matchScore: analysis.matchScore,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    return res.status(500).json({
      error: "Analysis failed: " + err.message,
      details: err.stack,
    });
  }
}

// Add this function to your existing controller
export async function getResumeById(req, res) {
  try {
    const { id } = req.params;

    // Find resume and populate owner details
    const resume = await Resume.findById(id)
      .populate("owner", "name email")
      .select("-__v");

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Check if the user is authorized to view this resume
    if (resume.owner._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this resume" });
    }

    // Format the response
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

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching resume:", err);
    return res.status(500).json({
      error: "Failed to fetch resume data",
      details: err.message,
    });
  }
}
