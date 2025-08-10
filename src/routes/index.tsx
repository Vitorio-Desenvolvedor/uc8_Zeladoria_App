import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SalaDetalhes from '../screens/SalaDetalhesScreen';
import TelaAdminSalas from '../screens/TelaAdminSalas';
import TelaPerfil from '../screens/TelaPerfil';
import TelaHistorico from '../screens/TelaHistorico';
import FormSala from '../screens/FormSala';
import TelaCadastroUsuario from '../screens/TelaCadastroUsuario';

import { AuthContext } from '../context/AuthContext';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SalaDetalhes" component={SalaDetalhes} />
            <Stack.Screen name="TelaPerfil" component={TelaPerfil} />

            {/* Rotas de admin */}
            {user?.is_staff && (
              <>
                <Stack.Screen name="TelaAdminSalas" component={TelaAdminSalas} />
                <Stack.Screen name="FormSala" component={FormSala} />
                <Stack.Screen name="TelaHistorico" component={TelaHistorico} />
                <Stack.Screen name="TelaCadastroUsuario" component={TelaCadastroUsuario} />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
