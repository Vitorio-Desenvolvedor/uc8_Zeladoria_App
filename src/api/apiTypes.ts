
export interface CredenciaisLogin {
    username: string,
    password: string
}

export interface RespostaLoginAPI {
    username: string,
    password: string,
    token: string,
    user_data: UserData
}

export interface UserData{
    id: number,
    username: string,
    email: string, 
    is_staff: boolean,
    is_superuser: boolean

}

export type Sala = {
    qr_code_id: number;      
    nome_numero: string;   
    descricao?: string;   // Possível ajuste 
    capacidade: number;
    localizacao: string;
    status_limpeza: "Limpa" | "Suja" | "Em Limpeza";
  };
  

export interface newSala{
    nome_numero: string,
    capacidade: number,
    descricao: string,
    localizacao: string,

}

export interface Usuario{
    id: number,
    username: string,
    email: string,
    is_staff: boolean,
    is_superuser: boolean
}

export interface NovoUsuario{
    username: string,
    password: string,
    confirm_password: string,
    email?: string,
    is_staff?: boolean,
    // is_superuser: boolean
}

export interface RegistroLimpeza {
    id: number;
    sala: Sala | number;   
    usuario: Usuario | number;
    observacao: string | null;
    data_hora: string;
}
  
export interface NovaLimpeza{
    sala: string,
    observação ?: string,
}

