export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  SalaDetalhes: { sala: any };
  TelaAdminSalas: undefined;
  FormSala: { sala?: any }; // aceita com ou sem sala
  TelaHistorico: undefined;
  TelaPerfil: undefined;
  TelaCadastroUsuario: undefined;
  DetalhesSala: { sala: { id: number; nome: string; status: string } };
  RegistroLimpeza: { salaId: number };
  HistoricoLimpezas: undefined;
  AdminSalas: undefined;   
};
