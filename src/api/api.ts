import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.10:8000/api",
  timeout: 5000,
});

export default api;
