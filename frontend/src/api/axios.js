import axios from "axios";
import { BASE_URL } from "../constants/axiosConstants";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosAPI = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "multipart/form-data" },
  // withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true,
});
