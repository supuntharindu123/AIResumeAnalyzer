import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileOriginalName: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },

  jobDescription: {
    type: String,
    required: true,
  },
  analysis: {
    keywords: [
      {
        word: String,
        count: Number,
        matches: Boolean,
      },
    ],
    missingKeywords: [String],
    formatIssues: [String],
    suggestions: [String],
  },
  matchScore: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Resume", ResumeSchema);
