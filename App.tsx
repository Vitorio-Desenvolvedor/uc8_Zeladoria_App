import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import HistoricoLimpezasScreen from "./src/screens/HistoricoLimpezas";

// Definição dos tipos de rotas
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  HistoricoLimpezas: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="HistoricoLimpezas"
          component={HistoricoLimpezasScreen}
          options={{ title: "Histórico de Limpezas" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
