import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Base da API Django
const API = axios.create({
  baseURL: "http://10.0.2.2:8000", 
});

// Interceptor para enviar token JWT
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
