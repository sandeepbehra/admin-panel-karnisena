const API_BASE_URL = "https://6zq9472qqb.execute-api.ap-south-1.amazonaws.com";

export const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("karni_admin_token");

    const sessionId = localStorage.getItem("karni_admin_session");

    console.log("news ", token);
    console.log("news options", options);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,

      headers: {
        "Content-Type": "application/json",

        Authorization: token || "",

        sessionId: sessionId || "",
      },
    });

    const data = await response.json();

    if (response.status === 401 || data?.code === "UNAUTHORIZED") {
      console.error("Unauthorized request:", data);

      throw new Error("Your session is invalid or expired.");
    }

    if (!response.ok || data?.success === false) {
      throw new Error(data?.message || "Something went wrong.");
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);

    throw error;
  }
};
