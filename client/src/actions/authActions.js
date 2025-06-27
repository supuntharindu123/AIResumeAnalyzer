import { api } from "../context/authcontext";

export async function verifyEmailAction(email, otp) {
  try {
    const response = await api.post("/auth/verify-email", {
      email,
      otp,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
      password: newPassword,
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

export async function updateProfileAction(formData) {
  try {
    const form = new FormData();

    if (formData.name) form.append("name", formData.name);
    if (formData.bio) form.append("bio", formData.bio);
    if (formData.avatar instanceof File) {
      form.append("avatar", formData.avatar);
    }

    const response = await api.put(`/auth/user`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.user) {
      return {
        success: true,
        user: response.data.user,
        message: "Profile updated successfully",
      };
    }
    throw new Error("No user data in response");
  } catch (error) {
    console.error("Profile update failed:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update profile",
    };
  }
}
