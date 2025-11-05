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
import NotificacoesScreen from "../screens/NotificacoesScreen";
import QRCodeScreen from "../screens/QRCodeScreen";

// Admin
import HistoricoLimpezasScreen from "../screens/HistoricoLimpezasScreen";
import TelaCadastroUsuario from "../screens/TelaCadastroUsuario";
import FormSala from "../screens/FormSala";
import TelaAdmin from "../screens/TelaAdmin";
import FormEditSalaScreen from "../screens/FormEditSalaScreen";

// Limpeza
import IniciarLimpezaScreen from "../screens/IniciarLimpezaScreen";
import ConcluirLimpezaScreen from "../screens/ConcluirLimpezaScreen";

import {AuthContext } from "../context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;

  const { user, token } = authContext;

  return (
    <SafeAreaProvider>
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
            <Stack.Screen name="Home" component={HomeScreen}  options={{title: ""}} />
            <Stack.Screen name="Salas" component={SalasScreen} />
            <Stack.Screen name="SalaDetalhes" component={SalaDetalhesScreen} options={{title: ""}} />
            <Stack.Screen name="TelaPerfil" component={TelaPerfil}  options={{title: ""}}/>
            <Stack.Screen name="HistoricoLimpezas" component={HistoricoLimpezasScreen} options={{ title: ""}} />
            <Stack.Screen name="QRCode" component={QRCodeScreen} options={{title: ""}} />

            {/* TELAS DE LIMPEZA ACESSÍVEIS A ZELADORES */}
         
            <Stack.Screen
              name="IniciarLimpeza"
              component={IniciarLimpezaScreen }
              options={{ title: "" }}
            />
            <Stack.Screen
              name="ConcluirLimpeza"
              component={ConcluirLimpezaScreen}
              options={{ title: "" }}
            />
            {/* CRIAÇÃO DE TELA */}
            <Stack.Screen
                name="FormSala"
                component={FormSala}
                options={{ title: "" }}
                />
            <Stack.Screen
                name="FormEditSala"
                component={FormEditSalaScreen}
                options={{ title: "" }}
                />
                
            <Stack.Screen 
                name="Notificacao"
                component={NotificacoesScreen} 
                options={{ title: "" }}
                   />

            {/* ROTAS SOMENTE PARA ADMINISTRADORES */}
            {user?.is_staff && (
              <>
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
      
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
</SafeAreaProvider>
  );
}
