import api from "./api";

// Interface que define a estrutura dos dados de uma limpeza
export interface Limpeza {
  id: number; 
  sala: string; 
  sala_nome: string; 
  data_hora_inicio: string; 
  data_hora_fim: string | null; 
  funcionario_responsavel: string;
  observacoes: string | null; 
  fotos: {
    id: number; 
    timestamp: string;
  }[];
}

// Função para iniciar uma limpeza (usada pela equipe de zeladoria)
export const iniciarLimpeza = async (qr_code_id: string) => {
  try {
    const response = await api.post(`/api/salas/${qr_code_id}/iniciar_limpeza/`);
    return response.data; 
  } catch (error: any) {
   
    console.error("Erro ao iniciar limpeza:", error.response?.data || error.message);
    throw error; 
  }
};

// Função para concluir uma limpeza (usada pela equipe de zeladoria)
export const concluirLimpeza = async (qr_code_id: string, observacoes?: string) => {
  try {
    const response = await api.post(
      `/api/salas/${qr_code_id}/concluir_limpeza/`,
      observacoes ? { observacoes } : {}, 
      { headers: { "Content-Type": "application/json" } } 
    );
    return response.data; 
  } catch (error: any) {
    // Caso ocorra algum erro, exibe no console o motivo
    console.error("Erro ao concluir limpeza:", error.response?.data || error.message);
    throw error; 
  }
};
