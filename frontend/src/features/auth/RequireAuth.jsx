import { Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constants/axiosConstants";
import usePersist from "../../hooks/usePersist";
import { selectCurrentToken, setCredentials } from "./authSlice";

const RequireAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let content;

  const location = useLocation();

  const token = useSelector(selectCurrentToken);

  const persist = JSON.parse(localStorage.getItem("persist"));

  const client = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, //or add axios.defaults.withCredentials = true in app.js or top of file//for any req setting or sending cookies
  });

  useEffect(() => {
    //fetch using refresh token in cookie and store access token in store
    //if error eg refresh has expired, go to login
    const getToken = async () => {
      try {
        //display backdrop with loading indicator
        setIsLoading(true);

        const { data: token } = await client.get("/api/auth/refresh");
        dispatch(setCredentials(token));
        setIsLoading(false);
        //navigate to dash
        //allow dash
        setIsSuccess(true);
      } catch (error) {
        //navigate to login
        console.error("error");
        setIsLoading(false);
        setIsError(true);
      }
    };
    if (persist && !token) getToken();
  }, []);

  if (isLoading) {
    content = (
      <Backdrop
        sx={{ color: "#fff", bgcolor: "secondary.main", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (isSuccess) {
    //no needed
    //after re-render due to state change// token=true below will catch this as well
    //allow protected access
    content = <Outlet />;
  } else if (isError) {
    //login page
    content = <Navigate to="/login" state={{ from: location }} replace />;
  } else if (token) {
    //token: true// handles !persist && token / persist && token
    //allow protected access
    content = <Outlet />;
  } else if (!persist && !token) {
    //login page
    content = <Navigate to="/login" state={{ from: location }} replace />;
  }

  return content;
};

export default RequireAuth;
