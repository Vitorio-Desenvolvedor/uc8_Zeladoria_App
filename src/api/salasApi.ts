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

  async registrarLimpeza(id: string | number, observacao: string, funcionario: string, fotoUri?: string | null) {
    const payload: any = {
      observacoes: observacao,
      funcionario_responsavel: funcionario,
    };

    if (!fotoUri) {
      const res = await api.post(`/salas/${id}/concluir_limpeza/`, payload);
      return res.data;
    }
    const formData = new FormData();
    formData.append("registro_limpeza", String(id)); 
    formData.append("imagem", {
      uri: fotoUri,
      name: "foto.jpg",
      type: "image/jpeg",
    } as any);

    await api.post("/fotos_limpeza/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const res = await api.post(`/salas/${id}/concluir_limpeza/`, payload);
    return res.data;
  },
};

export default SalaAPI;
