import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { AuthContextType } from '../routes/types'; //  importando a tipagem

export default function TelaPerfil() {
  const auth = useAuth() as AuthContextType; //  forçando o tipo

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Perfil do Usuário</Text>
      {auth.user ? (
        <>
          <Text>Usuário: {auth.user.username}</Text>
          <Text>Email: {auth.user.email || 'Não informado'}</Text>
          <Button title="Sair" onPress={auth.logout} />
        </>
      ) : (
        <Text>Nenhum usuário logado</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
});
