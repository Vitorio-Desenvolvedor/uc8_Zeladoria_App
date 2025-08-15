import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import HistoricoLimpezasScreen from "./src/screens/HistoricoLimpezasScreen";
import AdminSalasScreen from "./src/screens/AdminScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Historico: undefined;
  Admin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>("Login");

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setInitialRoute("Home");
      }
    };
    checkLogin();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Historico" component={HistoricoLimpezasScreen} />
        <Stack.Screen name="Admin" component={AdminSalasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
