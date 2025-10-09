import api from "./api";

// Interface que define a estrutura dos dados de um histórico de limpeza
export interface HistoricoLimpeza {
  id: number; 
  sala: string; 
  sala_nome: string; 
  data_hora_inicio: string; 
  data_hora_fim: string; 
  funcionario_responsavel: string; 
  observacoes: string; 
  fotos: { 
    id: number; 
    imagem: string; 
    timestamp: string; 
  }[];
}

// Função para listar o histórico de limpezas (acesso restrito a administradores)
export const listarHistoricoLimpezas = async (filters: Record<string, any> = {}) => {
  try {
    const response = await api.get("/api/limpezas/", { params: filters });
    return response.data; 
  } catch (error: any) {
    
    console.error("Erro ao listar histórico de limpezas:", error.response?.data || error.message);
    throw error; 
  }
};

