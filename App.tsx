import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { RootStackParamList } from "./src/routes/types";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RegistroLimpezaScreen from "./src/screens/RegistroLimpezaScreen";
import HistoricoLimpezasScreen from "./src/screens/HistoricoLimpezasScreen";
import AdminSalasScreen from "./src/screens/AdminSalas";
import DetalhesSalaScreen from "./src/screens/DetalhesSalaScreen";
import { ActivityIndicator, View } from "react-native";

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Início" }} />
          <Stack.Screen name="RegistroLimpeza" component={RegistroLimpezaScreen} options={{ title: "Registrar Limpeza" }} />
          <Stack.Screen name="HistoricoLimpezas" component={HistoricoLimpezasScreen} options={{ title: "Histórico" }} />
          <Stack.Screen name="AdminSalas" component={AdminSalasScreen} options={{ title: "Admin. Salas" }} />
          <Stack.Screen name="DetalhesSala" component={DetalhesSalaScreen} options={{ title: "Detalhes da Sala" }} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </AuthProvider>
  );
}
