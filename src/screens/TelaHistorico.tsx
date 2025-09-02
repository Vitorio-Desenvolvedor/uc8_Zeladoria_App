import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Limpeza } from '../routes/types';

const TelaHistorico = () => {
  const { token, user } = useAuth();
  const [historico, setHistorico] = useState<Limpeza[]>([]);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const response = await api.get('/historico/', {
          headers: { Authorization: `Token ${token}` },
        });

        // 🔹 Normaliza: transforma sala em objeto se vier como número
        const historicoNormalizado: Limpeza[] = response.data.map((item: any) => ({
          ...item,
          sala:
            typeof item.sala === 'number'
              ? { id: item.sala, nome: `Sala ${item.sala}` }
              : item.sala,
        }));

        setHistorico(historicoNormalizado);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    };

    if (token) {
      fetchHistorico();
    }
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Limpezas</Text>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Sala: {item.sala.nome}</Text>
            <Text>Observação: {item.observacao}</Text>
            <Text>Data: {item.data}</Text>
            <Text>Responsável: {user?.username || 'Desconhecido'}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default TelaHistorico;
