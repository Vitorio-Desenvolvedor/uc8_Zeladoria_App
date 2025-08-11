import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RegistroLimpezaScreen from "./src/screens/RegistroLimpezaScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  RegistroLimpeza: undefined;
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
          name="RegistroLimpeza"
          component={RegistroLimpezaScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
