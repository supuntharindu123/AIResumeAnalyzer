import express from "express";
import multer from "multer";
const router = express.Router();
import {
  googleLogin,
  loginUser,
  registerUser,
  verifyEmail,
  resendOTP,
  resetPassword,
  updateUser,
  getMe,
} from "./controller/userController.js";
import { protect } from "./middleware/auth.js";
import { analyzeResume, getResumeById } from "./controller/resumeController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/resume/analyze", protect, upload.single("resume"), analyzeResume);
router.get("/resume/:id", protect, getResumeById);

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/google", googleLogin);
router.post("/auth/verify-email", verifyEmail);
router.post("/auth/resend-otp", resendOTP);
router.post("/auth/reset-password", resetPassword);
router.put("/auth/user", protect, updateUser);
router.get("/auth/verify", protect, getMe);

export default router;
