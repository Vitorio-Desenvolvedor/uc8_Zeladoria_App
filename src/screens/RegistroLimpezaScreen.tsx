import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type Limpeza = {
  id: number;
  sala_nome: string;
  data: string;
  observacao: string;
};

export default function HistoricoLimpezasScreen() {
  const [historico, setHistorico] = useState<Limpeza[]>([]);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Erro', 'Token não encontrado');
          return;
        }

        const response = await axios.get<Limpeza[]>('http://192.168.15.3:8000/registro-limpeza/', {
          headers: { Authorization: `Token ${token}` },
        });

        setHistorico(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível carregar o histórico');
      }
    };

    fetchHistorico();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Limpezas</Text>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.sala}>{item.sala_nome}</Text>
            <Text>{item.data}</Text>
            <Text>{item.observacao}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  sala: { fontWeight: 'bold' },
});
