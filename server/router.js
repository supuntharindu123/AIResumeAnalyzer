import express from "express";
const router = express.Router();
import {
  googleLogin,
  loginUser,
  registerUser,
  verifyEmail,
  resendOTP,
} from "./controller/userController.js";
import { protect } from "./middleware/auth.js";

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/google", googleLogin);
router.post("/auth/verify-email", verifyEmail);
router.post("/auth/resend-otp", resendOTP);
// router.get("/auth/verify", protect, verifyAuth);

export default router;
