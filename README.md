# Zeladoria App

## 1. Visão Geral

O **Zeladoria App** é um aplicativo desenvolvido para otimizar e modernizar o processo de manutenção, limpeza e gestão de ambientes em instituições e organizações.  
Ele permite que colaboradores, administradores e gestores acompanhem em tempo real o estado das salas e ambientes, registrando solicitações, notificações e atualizações de forma eficiente.

---

## 2. Objetivo do Projeto

O objetivo principal é fornecer uma interface fluida e moderna para que colaboradores e administradores possam:

- Registrar limpezas concluídas;
- Visualizar notificações e status das salas;
- Editar informações de perfil e adicionar foto;
- Promover a eficiência e rastreabilidade das tarefas.

---

## 3. Estrutura do Projeto

### 3.1 Tecnologias Utilizadas

- **React Native (Expo):** Framework principal de desenvolvimento.  
- **TypeScript:** Tipagem estática e segurança no código.  
- **React Navigation:** Navegação entre telas.  
- **Axios:** Comunicação com a API.  
- **Expo Image Picker:** Captura e seleção de imagens.  
- **AsyncStorage:** Armazenamento local de dados (como tokens ou informações do usuário).  
- **Context API:** Gerenciamento de estados globais, como autenticação e notificações.



---

## 4. Funcionalidades Principais

### 4.1 Tela de Login
- Autenticação simples com validação de campos.  
- Redirecionamento automático após login bem-sucedido.  
- Interface intuitiva e responsiva.

### 4.2 Tela Home
- Apresenta o nome do usuário logado.  
- Botões de navegação organizados e visualmente equilibrados.  
- Exibe atalhos rápidos para “Salas”, “Notificações”, "Histórico de Limpezas" e “Perfil”.

### 4.3 Tela de Salas
- Lista de todas as salas com seu respectivo status (“Limpa”, “Suja”, “Em andamento”).  
- Possibilidade de atualizar a lista com gesto de *pull-to-refresh*.  
- Design limpo e informativo, com ícones e cores indicativas.

### 4.4 Tela de Detalhes da Sala
- Exibe informações detalhadas de cada sala.  
- Mostra histórico de limpezas anteriores.  
- Botão “Iniciar Limpeza” visível.

### 4.5 Tela de Conclusão de Limpeza
- Permite adicionar observações e tirar ou escolher uma foto.  
- Mostra pré-visualização da imagem escolhida.  
- Botão “Marcar como limpa” estilizado em Azul.  
- Mensagens de alerta e *loading indicator* para feedback visual.

### 4.6 Tela de Perfil
- Exibe dados do usuário logado (Nome, E-mail e Foto).  
- Opção para editar informações e alterar foto de perfil.  
- Botões de ação visualmente destacados:
  - **Salvar alterações:** cor laranja (Senac).  
  - **Cancelar edição:** tom cinza suave.  
- Círculo do avatar com contorno laranja.

### 4.7 Tela de Notificações
- Lista de notificações recebidas.  
- Botão “Marcar todas como lidas”.  
- Layout limpo com destaque para mensagens não lidas.  
- Ícones e cores sutis para acessibilidade visual.

---

## 5. Interface e Design (UI/UX)

### 5.1 Paleta de Cores

| Cor | Uso |
|------|-----|
| **Laranja Senac (#F28C00)** | Ações principais e botões de destaque |
| **Azul (#004A8D)** | Identidade institucional e títulos |
| **Cinza Claro (#F2F2F2)** | Fundo de telas e seções neutras |

### 5.2 Tipografia
- Fonte principal: **Inter** (ou **Roboto** como alternativa).  
- Títulos em negrito e texto secundário em tons mais suaves.  
- Hierarquia visual clara e espaçamento consistente.

### 5.3 Layout
- Utilização de **Flexbox** para garantir responsividade.  
- Espaçamento interno generoso (*padding* entre 15 e 25).  
- Botões com cantos arredondados e sombras sutis.

---

## 6. Funcionalidades Extras

### 6.1 Feedback Visual
- Indicadores de carregamento (*ActivityIndicator*) durante ações assíncronas.  
- Alertas contextuais para erros e confirmações.

### 6.2 Acessibilidade
- Uso de cores contrastantes e textos alternativos.  
- Tamanho de fonte ajustado para leitura em diferentes telas.

### 6.3 Armazenamento Local
- Informações de login e preferências do usuário salvas em cache para acesso rápido.

---

## 7. Instruções de Execução

### 7.1 Instalação do Projeto

- npm install
    **ou** 
- yarn install

## 7.2 Execução no Ambiente de Desenvolvimento

- npx expo start  
   **ou**  
- npx expo start --tunnel *(acesso público, sem uso da mesma internet).*

---

## 7.3 Teste no Dispositivo Físico

- Instale o aplicativo **Expo Go** (Android/iOS).  
- Escaneie o **QR Code** exibido no terminal após executar o comando anterior.

## 8. Considerações Finais
### 8.1 Usabilidade e Eficiência
-	O Zeladoria App prioriza a experiência do usuário, oferecendo uma navegação fluida, design limpo e ações diretas. O uso intuitivo permite que colaboradores realizem as tarefas com poucos toques, otimizando o tempo e reduzindo erros operacionais.

-Confira também o projeto complementar: [Zeladoria API](https://github.com/thalsime/uc8_zeladoria)


