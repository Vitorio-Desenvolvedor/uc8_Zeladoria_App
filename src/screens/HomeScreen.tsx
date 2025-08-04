import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type Sala = {
  id: number;
  nome: string;
  capacidade: number;
  recursos: string;
  status_limpeza: string;
  ultima_limpeza_data_hora: string | null;
};

export default function HomeScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarSalas() {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Erro', 'Token não encontrado.');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/salas/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setSalas(response.data);
      } catch (error: any) {
        console.log(error.response?.data || error.message);
        Alert.alert('Erro', 'Falha ao carregar salas.');
      } finally {
        setLoading(false);
      }
    }

    carregarSalas();
  }, []);

  const formatarData = (dataUtc: string | null): string => {
    if (!dataUtc) return 'Nunca limpa';
    const data = new Date(dataUtc);
    return data.toLocaleString('pt-BR'); // ex: 04/08/2025 10:33
  };

  const renderSala = ({ item }: { item: Sala }) => (
    <View style={styles.sala}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text>Capacidade: {item.capacidade}</Text>
      <Text>Recursos: {item.recursos}</Text>
      <Text>Status: {item.status_limpeza}</Text>
      <Text>Última Limpeza: {formatarData(item.ultima_limpeza_data_hora)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#444" />
        <Text>Carregando salas...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={salas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderSala}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  sala: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  nome: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
