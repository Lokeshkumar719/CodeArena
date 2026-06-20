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

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 429) {
      error.rateLimitedFor = error.response.data?.retryAfterSeconds ?? 10;
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      originalRequest?.url !== '/user/refresh' &&
      !authRoutes.includes(originalRequest?.url)
    ) {
      originalRequest._retry = true;

      try {
        await axiosClient.post('/user/refresh');
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error('Refresh failed:', refreshError.response?.data?.message);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
