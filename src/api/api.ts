import axios from "axios";

export const api = axios.create({
  baseURL: "https://zeladoria.tsr.net.br/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Helper para setar/remover o Authorization globalmente
export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Token ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
