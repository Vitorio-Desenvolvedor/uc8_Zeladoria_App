// src/screens/HomeScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { user, signOut, refreshMe } = useAuth();

  useEffect(() => {
    refreshMe().catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo{user ? `, ${user.username}` : ''} 👋</Text>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('RegistrarLimpeza')}>
        <Text style={styles.btnText}>Registrar Limpeza</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Historico')}>
        <Text style={styles.btnText}>Ver Histórico</Text>
      </TouchableOpacity>

      {user?.is_staff && (
        <TouchableOpacity style={[styles.btn, styles.btnAdmin]} onPress={() => navigation.navigate('Admin')}>
          <Text style={styles.btnText}>Administração (Salas)</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.btn, styles.btnLogout]} onPress={signOut}>
        <Text style={styles.btnText}>Sair</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.muted}>Perfil: {user?.is_staff ? 'Administrador' : 'Usuário'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
  btn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, marginBottom: 12 },
  btnAdmin: { backgroundColor: '#7c3aed' },
  btnLogout: { backgroundColor: '#dc2626' },
  btnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  footer: { marginTop: 'auto' },
  muted: { color: '#666' },
});
