import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {

  const authContext = useContext(AuthContext)

  if (!authContext) {
    return null
  }

  const { user, logout } = authContext;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {user?.username || 'Usuário'}!</Text>
      <Button title="Ver Salas" onPress={() => navigation.navigate('Salas' as never)} />
      {user?.is_staff && (
        <Button title="Histórico de Limpezas" onPress={() => navigation.navigate('Historico' as never)} />
      )}
      <Button title="Sair" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center'  },
  title: { fontSize: 20, marginBottom: 20,},
});

export default HomeScreen;
