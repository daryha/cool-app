// src/axios.js
import axios from "axios";
import { useEffect } from "react";

const instance = axios.create({
  baseURL: "http://localhost:5124",
});

instance.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  const token = window.localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
