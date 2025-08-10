import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import HistoricoLimpezasScreen from './src/screens/HistoricoLimpezasScreen';
import RegistroLimpezaScreen from './src/screens/RegistroLimpezaScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  HistoricoLimpezas: undefined;
  RegistroLimpeza: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login', headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Tela Inicial' }}
        />
        <Stack.Screen
          name="HistoricoLimpezas"
          component={HistoricoLimpezasScreen}
          options={{ title: 'Histórico de Limpezas' }}
        />
        <Stack.Screen
          name="RegistroLimpeza"
          component={RegistroLimpezaScreen}
          options={{ title: 'Registrar Limpeza' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
