import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * >>> EDITE ESTA LINHA <<<
 * Use o IP da máquina que roda o Django. Se usar emulador Android:
 * - físico na mesma rede: http://SEU_IP_LOCAL:8000
 * - emulador Android Studio: http://10.0.2.2:8000
 */
export const BASE_URL = "http://192.168.15.3:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Anexa token a cada request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Trata erros globais (opcional)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Você pode logar, mapear mensagens, redirecionar, etc.
    return Promise.reject(err);
  }
);
