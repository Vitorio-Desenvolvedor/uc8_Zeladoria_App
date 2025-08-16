// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./src/context/AuthContext";

// Importando telas
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RegistroLimpezaScreen from "./src/screens/RegistroLimpezaScreen";
import HistoricoScreen from "./src/screens/HistoricoScreen";
import AdminScreen from "./src/screens/AdminScreen";
import SalaDetalhesScreen from "./src/screens/SalaDetalhesScreen";

// Tipos centralizados
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  RegistroLimpeza: { salaId: number; salaNome: string };
  Historico: undefined;
  AdminSalas: undefined;
  SalaDetalhes: { salaId: number; salaNome: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Login" }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Início" }}
          />
          <Stack.Screen
            name="RegistroLimpeza"
            component={RegistroLimpezaScreen}
            options={{ title: "Registrar Limpeza" }}
          />
          <Stack.Screen
            name="Historico"
            component={HistoricoScreen}
            options={{ title: "Histórico de Limpezas" }}
          />
          <Stack.Screen
            name="AdminSalas"
            component={AdminScreen}
            options={{ title: "Administração de Salas" }}
          />
          <Stack.Screen
            name="SalaDetalhes"
            component={SalaDetalhesScreen}
            options={{ title: "Detalhes da Sala" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};
