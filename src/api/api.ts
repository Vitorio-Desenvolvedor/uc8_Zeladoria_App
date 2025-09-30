// src/api/api.ts
import axios from "axios";
import { obterToken, removerToken } from "../services/servicoArmazenamento"; 

const api = axios.create({
  baseURL: "https://zeladoria.tsr.net.br/api", 
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor -> injeta token automaticamente (se disponível)
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await obterToken();
      if (token && config.headers) {
        config.headers.Authorization = `Token ${token}`;
      }
    } catch (err) {
      // não fatal
      console.warn("Erro ao obter token para requisição", err);
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor -> trata 401 centralmente
api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error?.response?.status === 401) {
      // token inválido/expirado
      await removerToken();
      console.warn("Token expirado: realize login novamente.");

    }
    return Promise.reject(error);
  }
);

/** setAuthToken útil para testes ou login imediato */
export function setAuthToken(token?: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Token ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export default api;
