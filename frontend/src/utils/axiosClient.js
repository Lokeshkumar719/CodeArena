import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authRoutes = [
  '/user/login',
  '/user/register',
  '/user/forgot-password',
  '/user/reset-password',
];

/*
  Axios response interceptor

  Handles two cases:
  1. 429 Too Many Requests — enriches error with `rateLimitedFor` so callers
     never need to parse HTTP status codes or response bodies themselves.

  2. 401 Unauthorized — silently attempts token refresh and retries the
     original request. If refresh also fails, rejects and lets the app
     redirect to login.
*/
axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // --- 429 Rate Limit ---
    if (error.response?.status === 429) {
      error.rateLimitedFor = error.response.data?.retryAfterSeconds ?? 10;
      return Promise.reject(error);
    }

    // --- 401 Unauthorized — silent token refresh ---
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      originalRequest?.url !== '/user/refresh' &&
      !authRoutes.includes(originalRequest?.url)
    ) {
      originalRequest._retry = true;

      try {
        // Backend verifies refresh token and sets new access token cookie
        await axiosClient.post('/user/refresh');

        // Retry the original request with the new token
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.log('Refresh token expired');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
