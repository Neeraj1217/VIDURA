const API_BASE_URL = "http://localhost:5000/api";

const parseJson = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("Unexpected server response format.");
  }
  return response.json();
};

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const payload = await parseJson(response);
  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }
  return payload;
};
