import { api } from "../context/authcontext";

export async function verifyEmailAction(email, otp) {
  try {
    const response = await api.post("/auth/verify-email", { email, otp });
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return { success: true, user };
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
