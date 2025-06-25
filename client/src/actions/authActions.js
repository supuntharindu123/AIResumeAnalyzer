import { useAuth } from "../context/authcontext";

const { api } = useAuth();
export default async function verifyEmailAction(email, otp) {
  try {
    const response = await api.post("/auth/verify-email", { email, otp });
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return { success: true };
  } catch (error) {
    console.error("Email verification failed:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Verification failed",
    };
  }
}
