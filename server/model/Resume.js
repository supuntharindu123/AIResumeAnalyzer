import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  feedback: {
    type: String,
    default: "",
  },
  matchScore: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Resume", ResumeSchema);
