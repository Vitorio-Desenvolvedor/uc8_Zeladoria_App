import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from "../routes/types";



import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SalaDetalhes from '../screens/SalaDetalhesScreen';
import TelaAdminSalas from '../screens/TelaAdminSalas';
import TelaPerfil from '../screens/TelaPerfil';
import TelaHistorico from '../screens/TelaHistorico';
import FormSala from '../screens/FormSala';
import TelaCadastroUsuario from '../screens/TelaCadastroUsuario';

import { AuthContext } from '../context/AuthContext';
import DetalhesSalaScreen from '../screens/DetalhesSalaScreen';
import AdminScreen from '../screens/AdminScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import LimpezaScreen from '../screens/LimpezaScreen';
import SalasScreen from '../screens/SalasScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  const authContext = useContext(AuthContext);

  if(!authContext) {
    return null
  };
  const {user, token}= authContext;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}
         initialRouteName={token ? "Home" : "Login"}>? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          </>
        ):{  (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="DetalhesSala" component={SalaDetalhes} />
            <Stack.Screen name="TelaPerfil" component={TelaPerfil} />

            {/* Rotas de admin */}
            {user?.is_staff && (
              <>
                <Stack.Screen name="AdminSalas" component={TelaAdminSalas} />
                <Stack.Screen name="TelaHistorico" component={TelaHistorico} />
                <Stack.Screen name="CadastroUsuario" component={TelaCadastroUsuario} />
                <Stack.Screen name="DetalhesSala" component={DetalhesSalaScreen}/>
                <Stack.Screen name="AdminScreen" component={AdminScreen} />
                <Stack.Screen name="FormSala" component={FormSala} />
                <Stack.Screen name="HistoricoLimpezas" component={HistoricoScreen} />
                <Stack.Screen name="RegistroLimpeza" component={LimpezaScreen} />
                <Stack.Screen name="Salas" component={SalasScreen}/>
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
