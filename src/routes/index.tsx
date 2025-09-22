import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "../routes/types";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import SalasScreen from "../screens/SalasScreen";
import SalaDetalhesScreen from "../screens/SalaDetalhesScreen";
import TelaPerfil from "../screens/TelaPerfil";

// Admin
import TelaAdminSalas from "../screens/TelaAdminSalas";
import TelaHistorico from "../screens/TelaHistorico";
import TelaCadastroUsuario from "../screens/TelaCadastroUsuario";
import DetalhesSalaScreen from "../screens/DetalhesSalaScreen";
import AdminScreen from "../screens/AdminScreen";
import FormSala from "../screens/FormSala";
import HistoricoScreen from "../screens/HistoricoScreen";
import LimpezaScreen from "../screens/LimpezaScreen";
import RegistrarLimpezaScreen from "../screens/RegistrarLimpezaScreen";
import FormEditSalaScreen from "../screens/FormEditSalaScreen";

import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;

  const { user, token } = authContext;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: true }}
        initialRouteName={token ? "Home" : "Login"}
      >
        {/* Tela de login */}
        {!token ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            {/* Rotas comuns a todos os usuários logados */}
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Salas" component={SalasScreen} />
            <Stack.Screen name="SalaDetalhes" component={SalaDetalhesScreen} />
            <Stack.Screen name="TelaPerfil" component={TelaPerfil} />

            {/* Rotas apenas para administradores */}
            {user?.is_staff && (
              <>
                <Stack.Screen name="AdminSalas" component={TelaAdminSalas} />
                <Stack.Screen name="Historico" component={TelaHistorico} />
                <Stack.Screen
                  name="CadastroUsuario"
                  component={TelaCadastroUsuario}
                />
                <Stack.Screen
                  name="DetalhesSalaAdmin"
                  component={DetalhesSalaScreen}
                />
                <Stack.Screen name="AdminScreen" component={AdminScreen} />
                <Stack.Screen name="FormSala" component={FormSala} />
                <Stack.Screen
                  name="FormEditSala"
                  component={FormEditSalaScreen}
                  options={{ title: "Editar Sala" }}
                />
                <Stack.Screen
                  name="HistoricoLimpezas"
                  component={HistoricoScreen}
                />
                <Stack.Screen
                  name="RegistroLimpeza"
                  component={LimpezaScreen}
                />
                <Stack.Screen
                  name="RegistrarLimpeza"
                  component={RegistrarLimpezaScreen}
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
