import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";
// import {createStackNavigato}

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import SalasScreen from "../screens/SalasScreen";
import LimpezaScreen from "../screens/LimpezaScreen";
import HistoricoScreen from "../screens/HistoricoScreen";
import AdminScreen from "../screens/AdminScreen";
import DetalhesSalaScreen from "../screens/DetalhesSalaScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AdminSalas" component={SalasScreen} />
        <Stack.Screen name="RegistroLimpeza" component={LimpezaScreen} />
        <Stack.Screen name="HistoricoLimpezas" component={HistoricoScreen} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="DetalhesSala" component={DetalhesSalaScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// const AppNavigator = createStack

// export function AppNavigator(){

// }