import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotAuthorized() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acesso negado</Text>
      <Text style={styles.desc}>Você não tem permissão para acessar esta área.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  desc: { color: '#6b7280', textAlign: 'center' },
});
