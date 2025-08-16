import axios from 'axios';

const baseURL = 'http://192.168.15.3:8000'; // ajustar caso precisar

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Token ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
