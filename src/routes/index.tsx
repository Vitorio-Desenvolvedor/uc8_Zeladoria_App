import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "../routes/types";

// Telas principais
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import SalasScreen from "../screens/SalasScreen";
import SalaDetalhesScreen from "../screens/SalaDetalhesScreen";
import TelaPerfil from "../screens/TelaPerfil";

// Admin
import TelaHistorico from "../screens/TelaHistorico";
import TelaCadastroUsuario from "../screens/TelaCadastroUsuario";
import FormSala from "../screens/FormSala";
import TelaAdmin from "../screens/TelaAdmin";
import FormEditSalaScreen from "../screens/FormEditSalaScreen";

// Limpeza
import RegistroLimpezaScreen from "../screens/RegistroLimpezaScreen";
import IniciarLimpezaScreen from "../screens/IniciarLimpezaScreen";
import ConcluirLimpezaScreen from "../screens/ConcluirLimpezaScreen";

import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;

  const { user, token } = authContext;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: true }}
        initialRouteName={token ? "Home" : "Login"}
      >
        {/* TELA DE LOGIN */}
        {!token ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            {/* ROTAS COMUNS A TODOS OS USUÁRIOS */}
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Salas" component={SalasScreen} />
            <Stack.Screen name="SalaDetalhes" component={SalaDetalhesScreen} />
            <Stack.Screen name="TelaPerfil" component={TelaPerfil} />

            {/* TELAS DE LIMPEZA ACESSÍVEIS A ZELADORES */}
            <Stack.Screen
              name="RegistroLimpeza"
              component={RegistroLimpezaScreen}
              options={{ title: "Histórico de Limpezas" }}
            />
            <Stack.Screen
              name="IniciarLimpeza"
              component={IniciarLimpezaScreen}
              options={{ title: "Iniciar Limpeza" }}
            />
            <Stack.Screen
              name="ConcluirLimpeza"
              component={ConcluirLimpezaScreen}
              options={{ title: "Concluir Limpeza" }}
            />

            {/* ROTAS SOMENTE PARA ADMINISTRADORES */}
            {user?.is_staff && (
              <>
                <Stack.Screen
                  name="Historico"
                  component={TelaHistorico}
                  options={{ title: "Histórico Geral" }}
                />
                <Stack.Screen
                  name="CadastroUsuario"
                  component={TelaCadastroUsuario}
                  options={{ title: "Cadastrar Usuário" }}
                />
                <Stack.Screen
                  name="Admin"
                  component={TelaAdmin}
                  options={{ title: "Painel Administrativo" }}
                />
                <Stack.Screen
                  name="FormSala"
                  component={FormSala}
                  options={{ title: "Cadastrar Sala" }}
                />
                <Stack.Screen
                  name="FormEditSala"
                  component={FormEditSalaScreen}
                  options={{ title: "Editar Sala" }}
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
