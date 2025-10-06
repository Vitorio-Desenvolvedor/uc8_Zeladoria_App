import api from "./api"; // instância do axios já configurada
import { Sala } from "../routes/types";

const SalaAPI = {
  //  Buscar todas as salas
  async getAllSalas(): Promise<Sala[]> {
    try {
      const response = await api.get("/salas/");
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar salas:", error.message || error);
      throw error;
    }
  },

  // Buscar sala por ID
  async getSalaById(id: string | number): Promise<Sala> {
    try {
      const response = await api.get(`/salas/${id}/`);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar sala com ID ${id}:`, error.message || error);
      throw error;
    }
  },

  //  Criar nova sala
  async createSala(newSala: Partial<Sala>): Promise<Sala> {
    try {
      const response = await api.post("/salas/", newSala);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar sala:", error.message || error);
      throw error;
    }
  },

  //  Atualizar sala (edição completa ou parcial)
  async updateSala(
    id: string | number,
    updatedSala: Partial<Sala>
  ): Promise<Sala> {
    try {
      const response = await api.put(`/salas/${id}/`, updatedSala);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao atualizar sala ${id}:`, error.message || error);
      throw error;
    }
  },

  //  Excluir sala
  async deleteSala(id: string | number): Promise<void> {
    try {
      await api.delete(`/salas/${id}/`);
    } catch (error: any) {
      console.error(`Erro ao excluir sala ${id}:`, error.message || error);
      throw error;
    }
  },

  //  Registrar limpeza (recomendado PATCH para atualizar só alguns campos)
  async registrarLimpeza(
    id: string | number,
    observacao: string,
    funcionario: string
  ): Promise<Sala> {
    try {
      const payload = {
        status_limpeza: "Limpa",
        ultima_limpeza_data_hora: new Date().toISOString(),
        ultima_limpeza_funcionario: funcionario,
        observacao,
      };

      const response = await api.patch(`/salas/${id}/`, payload);
      return response.data;
    } catch (error: any) {
      console.error(
        `Erro ao registrar limpeza da sala ${id}:`,
        error.message || error
      );
      throw error;
    }
  },
};

export default SalaAPI;
