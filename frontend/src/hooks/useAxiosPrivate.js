import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";

import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { BASE_URL } from "../constants/axiosConstants";
import axios from "axios";

const useAxiosPrivate = () => {
  const token = useSelector(selectCurrentToken);
  
  const refresh = useRefreshToken()

  //  const axiosPrivate = axios.create({
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
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [token, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
