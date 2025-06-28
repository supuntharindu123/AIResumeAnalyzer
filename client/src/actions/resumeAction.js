import { api } from "../context/authcontext";
export async function GetAllResume() {
  try {
    const response = await api.get("/resumes");
    const resume = response.data;

    return { success: true, resume };
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch resumes",
    };
  }
}
