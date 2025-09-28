import axios from "axios";
import { obterToken, removerToken } from "../services/servicoArmazenamento";

export const api = axios.create({
  baseURL: "https://zeladoria.tsr.net.br/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await obterToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (erro) => Promise.reject(erro)
);

api.interceptors.response.use(
  (response) => response,
  async (erro) => {
    if (erro.response && erro.response.status === 401) {
      await removerToken();
      console.warn("Token expirado ou inválido. Faça login novamente.");
    }
    return Promise.reject(erro);
  }
);

export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Token ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;