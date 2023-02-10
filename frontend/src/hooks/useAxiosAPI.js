import { axiosAPI } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";

import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { BASE_URL } from "../constants/axiosConstants";


const useAxiosAPI = () => {
  const token = useSelector(selectCurrentToken);

  const refresh = useRefreshToken();

  //  const axiosAPI = axios.create({
  //   baseURL: BASE_URL,
  //   headers: { "Content-Type": "application/json" },
  //   withCredentials: true,
  // });

  // const API = axios.create({ baseURL: "http://localhost:5000" });

  // API.interceptors.request.use((req) => {
  //   if (localStorage.getItem("profile")) {
  //     req.headers.Authorization = `Bearer ${
  //       JSON.parse(localStorage.getItem("profile")).token
  //     }`;
  //   }

  //   return req;
  // });

  useEffect(() => {
    const requestIntercept = axiosAPI.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAPI.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosAPI(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAPI.interceptors.request.eject(requestIntercept);
      axiosAPI.interceptors.response.eject(responseIntercept);
    };
  }, [token, refresh]);

  return axiosAPI;
};

export default useAxiosAPI;
