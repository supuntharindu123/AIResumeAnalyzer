import { api } from "../context/authcontext";

export async function verifyEmailAction(email, otp) {
  try {
    const response = await api.post("/auth/verify-email", {
      email,
      otp,
      type: "reset", // Add type to differentiate between registration and reset
    });

    const { token, user } = response.data;

    // Don't set auth token for password reset flow
    if (user?.type !== "reset") {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return { success: true, user: { ...user, token } };
  } catch (error) {
    console.error("Email verification failed:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Verification failed",
    };
  }
}

export async function resendOTPAction(email) {
  try {
    await api.post("/auth/resend-otp", { email });
    return { success: true };
  } catch (error) {
    console.error("OTP resend failed:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to resend OTP",
    };
  }
}

export async function resetPasswordAction(email, newPassword) {
  try {
    const response = await api.post("/auth/reset-password", {
      email,
      password: newPassword, // Changed to match backend expectation
      type: "reset",
    });

    if (response.data.message) {
      return { success: true, message: response.data.message };
    } else {
      return {
        success: false,
        error: "Reset failed - no response message",
      };
    }
  } catch (error) {
    console.error("Password reset failed:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Password reset failed",
    };
  }
}
