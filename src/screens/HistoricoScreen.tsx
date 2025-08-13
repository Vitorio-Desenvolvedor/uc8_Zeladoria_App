import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RegistroLimpeza {
  id: number;
  sala: string;
  usuario: string;
  observacao: string;
  data_limpeza: string;
}

export default function HistoricoScreen() {
  const [historico, setHistorico] = useState<RegistroLimpeza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://192.168.15.3:8000/api/salas/historico/', {
          headers: { Authorization: `Token ${token}` },
        });
        setHistorico(response.data);
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Limpezas</Text>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.sala}>{item.sala}</Text>
            <Text>Usuário: {item.usuario}</Text>
            <Text>Observação: {item.observacao || 'Nenhuma'}</Text>
            <Text>Data: {new Date(item.data_limpeza).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  sala: { fontWeight: 'bold', fontSize: 16 },
});
