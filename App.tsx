import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "./src/routes/types";
import { AuthProvider } from "./src/context/AuthContext";

// Importação de telas
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SalaDetalhesScreen from "./src/screens/SalaDetalhesScreen";
import TelaAdminSalas from "./src/screens/TelaAdminSalas";
import TelaPerfil from "./src/screens/TelaPerfil";
import TelaHistorico from "./src/screens/TelaHistorico";
import FormSala from "./src/screens/FormSala";
import TelaCadastroUsuario from "./src/screens/TelaCadastroUsuario"
import DetalhesSalaScreen from "./src/screens/DetalhesSalaScreen";
import AdminScreen from "./src/screens/AdminScreen";
import HistoricoScreen from "./src/screens/HistoricoScreen";
import LimpezaScreen from "./src/screens/LimpezaScreen";
import SalasScreen from "./src/screens/SalasScreen";
import RegistrarLimpezaScreen from "./src/screens/RegistrarLimpezaScreen";

// Contexto de autenticação
import { AuthContext } from "./src/context/AuthContext";


const Stack = createNativeStackNavigator<RootStackParamList>();

function Routes() {
  const authContext = useContext(AuthContext);
    if (!authContext) return null;
  
    const { user, token } = authContext;
  
  return (
    <Stack.Navigator
    screenOptions={{ headerShown: true }}
    // initialRouteName={token ? "Home" : "Login"}
  >
    {!token ? (
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    ) : (
      <>
        {/* 🔹 Rotas acessíveis para todos os usuários */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Salas" component={SalasScreen} />   
        <Stack.Screen name="SalaDetalhes" component={SalaDetalhesScreen} />
        <Stack.Screen name="TelaPerfil" component={TelaPerfil} />

        {/* 🔹 Rotas extras do administrador */}
        {user?.is_staff && (
          <>
            <Stack.Screen name="AdminSalas" component={TelaAdminSalas} />
            <Stack.Screen name="Historico" component={TelaHistorico} />
            <Stack.Screen name="CadastroUsuario" component={TelaCadastroUsuario}/>
            <Stack.Screen name="DetalhesSalaAdmin" component={DetalhesSalaScreen} />
            <Stack.Screen name="AdminScreen" component={AdminScreen} />
            <Stack.Screen name="FormSala" component={FormSala} />
            <Stack.Screen name="HistoricoLimpezas" component={HistoricoScreen}/>
            <Stack.Screen name="RegistroLimpeza" component={LimpezaScreen} />
            <Stack.Screen name="RegistrarLimpeza" component={RegistrarLimpezaScreen} />
          </>
        )}
      </>
    )}
  </Stack.Navigator>

  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </AuthProvider>
  );
}
