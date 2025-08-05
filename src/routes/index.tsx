import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SalaDetalhesScreen from '../screens/SalaDetalhesScreen';
import TelaAdminSalas from '../screens/TelaAdminSalas';
import FormSala from '../screens/FormSala';
import TelaHistorico from '../screens/TelaHistorico';
import TelaPerfil from '../screens/TelaPerfil';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  const { isAuthenticated } = useContext(AuthContext);
  

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SalaDetalhes" component={SalaDetalhesScreen} />
            <Stack.Screen name="TelaAdminSalas" component={TelaAdminSalas} />
            <Stack.Screen name="FormSala" component={FormSala} />
            <Stack.Screen name="TelaHistorico" component={TelaHistorico} />
            <Stack.Screen name="TelaPerfil" component={TelaPerfil} />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
