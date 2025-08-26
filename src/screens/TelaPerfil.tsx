import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { AuthContext} from '../context/AuthContext';

export default function TelaPerfil() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>👤 Meu Perfil</Text>
      <Text style={styles.info}>Usuário: {user?.username}</Text>
      <Text style={styles.info}>Tipo: {user?.is_staff ? 'Administrador' : 'Funcionário'}</Text>

      <View style={styles.botaoSair}>
        <Button title="🚪 Sair" onPress={handleLogout} color="#d9534f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  info: { fontSize: 18, marginBottom: 10 },
  botaoSair: { marginTop: 40 },
});
