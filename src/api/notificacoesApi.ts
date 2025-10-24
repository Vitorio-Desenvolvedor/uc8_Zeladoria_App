import api from "./api"; // seu arquivo base de api com axios/interceptors
import { Notificacao } from "../routes/types";

const NotificacaoAPI = {
  // Listar todas as notificações do usuário logado
  async listarNotificacoes(): Promise<Notificacao[]> {
    const response = await api.get("/notificacoes/");
    return response.data;
  },

  // Marcar uma notificação específica como lida
  async marcarComoLida(id: number): Promise<void> {
    await api.post(`/notificacoes/${id}/marcar_como_lida/`);
  },

  // Marcar todas como lidas
  async marcarTodasComoLidas(): Promise<void> {
    await api.post("/notificacoes/marcar_todas_como_lidas/");
  },
};

export default NotificacaoAPI;
