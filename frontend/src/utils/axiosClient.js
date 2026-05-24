import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Enrich 429 errors with `rateLimitedFor` so callers never touch HTTP status codes
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      // Backend always sends retryAfterSeconds in the body (see tooManyRequests())
      error.rateLimitedFor = error.response.data?.retryAfterSeconds ?? 10;
    }
    return Promise.reject(error);
  }
);

export default axiosClient;