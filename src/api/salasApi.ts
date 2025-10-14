import api from "./api";
import { Sala } from "../routes/types";

const SalaAPI = {
  // Buscar todas as salas
  async getAllSalas(): Promise<Sala[]> {
    const response = await api.get("/salas/");
    return response.data;
  },

  async getSalaById(id: string | number): Promise<Sala> {
    const response = await api.get(`/salas/${id}/`);
    return response.data;
  },

  // Criar nova sala
  async createSala(payload: Partial<Sala>): Promise<Sala> {
    const response = await api.post("/salas/", payload);
    return response.data;
  },

  // Atualizar sala
  async updateSala(id: string | number, payload: Partial<Sala>): Promise<Sala> {
    const response = await api.patch(`/salas/${id}/`, payload);
    return response.data;
  },

  // Excluir sala
  async deleteSala(id: string | number): Promise<void> {
    await api.delete(`/salas/${id}/`);
  },

  // Iniciar uma limpeza (etapa 1)
  async iniciarLimpeza(salaId: string | number, observacoes?: string) {
    const response = await api.post(`/salas/${salaId}/iniciar_limpeza/`, { // AJUSTE
      sala: salaId,
      observacoes: observacoes ?? "",
    });
    console.log(response);
    return response.data;
  },

  // Concluir limpeza (etapa 2)
  async concluirLimpeza(qr_code_id: string | number, observacoes?: string) {
    const response = await api.post(
      `/salas/${qr_code_id}/concluir_limpeza/`,
      observacoes ? { observacoes } : {}
    );
    return response.data;
  },

  // Marcar como suja (usuário solicitante)
  async marcarComoSuja(qr_code_id: string | number, observacoes?: string) {
    const response = await api.post(
      `/salas/${qr_code_id}/marcar_como_suja/`,
      observacoes ? { observacoes } : {}
    );
    return response.data;
  },

  // Enviar foto de comprovação
  async enviarFotoLimpeza(limpezaId: string | number, fotoUri: string) {
    const formData = new FormData();
    formData.append("registro_limpeza", String(limpezaId));
    formData.append("imagem", {
      uri: fotoUri,
      name: "foto.jpg",
      type: "image/jpeg",
    } as any);

    const res = await api.post("/fotos_limpeza/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

export default SalaAPI;
