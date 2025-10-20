import api from "./api";
import { Sala } from "../routes/types";

const SalaAPI = {
  // === Buscar todas as salas ===
  async getAllSalas(): Promise<Sala[]> {
    const response = await api.get("/salas/");
    return response.data;
  },
  
// Buscar sala específica 
async getSalaById(id: string | number): Promise<Sala> {
  const response = await api.get<Sala>(`/salas/${id}/`);
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

  // Iniciar uma limpeza 
  async iniciarLimpeza(salaId: number | string, observacao?: string) {
    const response = await api.post(`/salas/${salaId}/iniciar_limpeza/`, {
      observacao: observacao || "",
    });
    return response.data; // retorna o ID do registro de limpeza
  },

  // Concluir uma limpeza
  // Concluir uma limpeza
async concluirLimpeza(salaId: number | string, observacao?: string) {
  console.log("🧹 Concluindo limpeza...", salaId);

  const formData = new FormData();
  formData.append("observacao", observacao || "");

  const response = await api.post(`/salas/${salaId}/concluir_limpeza/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("Limpeza concluída:", response.data);
  return response.data;
},


  // Marcar como suja
  async marcarComoSuja(qr_code_id: string | number, observacoes?: string) {
    const response = await api.post(
      `/salas/${qr_code_id}/marcar_como_suja/`,
      observacoes ? { observacoes } : {}
    );
    return response.data;
  },

  // Enviar foto de comprovação da limpeza 
  async enviarFotoLimpeza(registroId: number | string, fotoUri: string) {
    if (!registroId) {
      console.error("registroId indefinido ao tentar enviar foto.");
      throw new Error("ID do registro de limpeza ausente!");
    }
    if (!fotoUri) {
      console.error("Nenhuma foto URI fornecida!");
      throw new Error("URI da foto ausente!");
    }

    console.log("Enviando foto de limpeza:");
    console.log("registro_limpeza:", registroId);
    console.log("fotoUri:", fotoUri);

    const formData = new FormData();
    formData.append("registro_limpeza", registroId.toString());
    formData.append("imagem", {
      uri: fotoUri,
      type: "image/jpeg",
      name: `foto_limpeza_${Date.now()}.jpg`,
    } as any);

    const response = await api.post("/fotos_limpeza/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Foto enviada com sucesso:", response.data);
    return response.data;
  },
};

export default SalaAPI;
