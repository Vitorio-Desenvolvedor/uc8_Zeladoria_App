import api from "./api";
import { Sala } from "../routes/types";

/**
 * Serviço responsável pelas requisições relacionadas às Salas.
 * Inclui operações CRUD, registro de limpeza e upload de fotos.
 */
const SalaAPI = {
  // === Buscar todas as salas ===
  async getAllSalas(): Promise<Sala[]> {
    const response = await api.get("/salas/");
    return response.data;
  },

  // === Buscar sala específica ===
  async getSalaById(id: string | number): Promise<Sala> {
    const response = await api.get<Sala>(`/salas/${id}/`);
    return response.data;
  },

  // === Criar nova sala ===
  async createSala(payload: Partial<Sala>): Promise<Sala> {
    const response = await api.post("/salas/", payload);
    return response.data;
  },

  // === Atualizar uma sala existente ===
  async updateSala(id: string | number, payload: Partial<Sala>): Promise<Sala> {
    const response = await api.patch(`/salas/${id}/`, payload);
    return response.data;
  },

  // === Excluir sala ===
  async deleteSala(id: string | number): Promise<void> {
    await api.delete(`/salas/${id}/`);
  },

  // === Iniciar uma limpeza ===
  /**
   * Inicia o registro de limpeza de uma sala específica.
   * @param salaId ID da sala.
   * @param observacao Texto opcional de observação.
   * @returns O registro de limpeza criado no backend.
   */
  async iniciarLimpeza(salaId: number | string, observacao?: string) {
    const response = await api.post(`/salas/${salaId}/iniciar_limpeza/`, {
      observacao: observacao || "",
    });

    console.log("🧽 Limpeza iniciada:", response.data);
    return response.data; // normalmente contém o registroId
  },

  // === Concluir uma limpeza ===
  /**
   * Conclui uma limpeza de uma sala e envia o status final.
   * Usa FormData pois pode haver imagem vinculada ao registro.
   * @param salaId ID da sala
   * @param observacao Texto opcional com observações finais
   */
  async concluirLimpeza(salaId: number | string, observacao?: string) {
    console.log("🧹 Concluindo limpeza da sala:", salaId);

    const formData = new FormData();
    formData.append("observacao", observacao || "");

    const response = await api.post(`/salas/${salaId}/concluir_limpeza/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Limpeza concluída com sucesso:", response.data);
    return response.data;
  },

  // === Marcar sala como suja ===
  /**
   * Atualiza o status de uma sala para "suja".
   * @param qr_code_id ID ou código QR da sala
   * @param observacoes Texto opcional explicando o motivo
   */
  async marcarComoSuja(qr_code_id: string | number, observacoes?: string) {
    const payload = observacoes ? { observacoes } : {};
    const response = await api.post(`/salas/${qr_code_id}/marcar_como_suja/`, payload);

    console.log("Sala marcada como suja:", response.data);
    return response.data;
  },

  // === Enviar foto de comprovação da limpeza ===
  /**
   * Envia uma foto associada a um registro de limpeza.
   * O backend deve possuir o endpoint `/fotos_limpeza/` configurado para receber `FormData`.
   * @param registroId ID do registro de limpeza retornado ao iniciar
   * @param fotoUri Caminho local da imagem selecionada pelo usuário
   */
  async enviarFotoLimpeza(registroId: number | string, fotoUri: string) {
    if (!registroId) {
      console.error("registroId indefinido ao tentar enviar foto.");
      throw new Error("ID do registro de limpeza ausente!");
    }

    if (!fotoUri) {
      console.error("Nenhuma foto URI fornecida!");
      throw new Error("URI da foto ausente!");
    }

    console.log("Enviando foto de limpeza...");
    console.log("registro_limpeza:", registroId);
    console.log("fotoUri:", fotoUri);

    // Criação do corpo com FormData (obrigatório para envio de imagens)
    const formData = new FormData();
    formData.append("registro_limpeza", registroId.toString());
    formData.append("imagem", {
      uri: fotoUri,
      type: "image/jpeg",
      name: `foto_limpeza_${Date.now()}.jpg`,
    } as any);

    try {
      const response = await api.post("/fotos_limpeza/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Foto enviada com sucesso:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao enviar foto:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.detail || "Falha ao enviar foto. Verifique a conexão e tente novamente."
      );
    }
  },
};

export default SalaAPI;