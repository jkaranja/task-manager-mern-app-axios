import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../constants/axiosConstants";
import { setCredentials } from "../features/auth/authSlice";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const refresh = async () => {
    const client = axios.create({
      baseURL: BASE_URL,
      withCredentials: true, //or add axios.defaults.withCredentials = true in app.js or top of file//for any req setting or sending cookies
    });

    try {
      //display backdrop with loading indicator
      const { data: token } = await client.get("/api/auth/refresh");
      dispatch(setCredentials(token)); //dispatch is synchronous//can use token from store immediately after
      //navigate to dash
      //allow dash
      return token;
    } catch (error) {
      //navigate to login
      console.error("error");
      return null;
    }
  };

  return refresh;
};

export default useRefreshToken;
