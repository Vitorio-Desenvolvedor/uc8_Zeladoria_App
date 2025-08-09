export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  SalaDetalhes: { sala: any };
  TelaAdminSalas: undefined;
  FormSala: { sala?: any }; // aceita com ou sem sala
  TelaHistorico: undefined;
  TelaPerfil: undefined;
  TelaCadastroUsuario: undefined;
  HistoricoLimpezas: { salaId: number }; 
};
