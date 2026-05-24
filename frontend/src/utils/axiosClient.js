import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
  Axios response interceptor

  Purpose:
  If access token expires,
  automatically call refresh endpoint
  and retry original request.

  This creates "silent authentication".
*/

axiosClient.interceptors.response.use(
  // if response successful, simply return response
  (response) => response,

  // handle response errors
  async (error) => {
    const originalRequest = error.config;

    /*
      If request failed with 401 Unauthorized
      AND request has not already been retried,
      attempt refresh flow.
    */
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/user/refresh"
    ) {
      originalRequest._retry = true;

      try {
        /*
          Call refresh endpoint.

          Backend will verify refresh token
          and send new access token cookie.
        */
        await axiosClient.post("/user/refresh");

        /*
          Retry original failed request
          after refresh succeeds.
        */
        return axiosClient(originalRequest);
      } catch (refreshError) {
        /*
          Refresh token also failed.

          User session is fully expired.
          Frontend should eventually redirect
          user to login page.
        */

        console.log("Refresh token expired");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
