import { api } from "../config/api";
import { getAccessToken } from "../utils/auth";

export const useAxiosInterceptors = () => {
  api.interceptors.request.use(
    (config) => {
      const accessToken = getAccessToken();
      if (accessToken) {
        console.log("accessToken", accessToken);
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const code = error?.response?.data?.message;
      const allowlist = ["INVALID_CREDENTIALS"];

      if (error.response?.status === 401 && !allowlist.includes(code)) {
        // logout
      }

      return Promise.reject(error);
    }
  );
};
