import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
    sparse: true,
  },
  avatar: {
    type: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
