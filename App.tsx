import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import HistoricoLimpezasScreen from "./src/screens/HistoricoLimpezasScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  HistoricoLimpezas: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkLogin() {
      try {
        const token = await AsyncStorage.getItem("token");
        const adminStatus = await AsyncStorage.getItem("isAdmin");

        if (token) {
          setIsAuthenticated(true);
          setIsAdmin(adminStatus === "true");
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      } finally {
        setLoading(false);
      }
    }

    checkLogin();
  }, []);

  if (loading) {
    return null; // Pode trocar por uma tela de carregamento
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Tela Inicial" }}
            />
            {isAdmin && (
              <Stack.Screen
                name="HistoricoLimpezas"
                component={HistoricoLimpezasScreen}
                options={{ title: "Histórico de Limpezas" }}
              />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
