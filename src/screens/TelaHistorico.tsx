import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

type Limpeza = {
  id: number;
  sala: string;
  usuario: string;
  observacao: string;
  data_limpeza: string;
};

export default function TelaHistorico() {
  const { token, user } = useContext(AuthContext);
  const [historico, setHistorico] = useState<Limpeza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.is_staff) {
      Alert.alert('Acesso negado', 'Você não tem permissão para acessar esta tela.');
      return;
    }

    buscarHistorico();
  }, []);

  const buscarHistorico = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/limpezas/', {
        headers: { Authorization: `Token ${token}` },
      });
      setHistorico(response.data);
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível carregar o histórico.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Limpeza }) => {
    const data = new Date(item.data_limpeza).toLocaleString();
    return (
      <View style={styles.card}>
        <Text style={styles.sala}>🧼 {item.sala}</Text>
        <Text>👤 {item.usuario}</Text>
        <Text>🕒 {data}</Text>
        {item.observacao ? <Text>🗒️ {item.observacao}</Text> : null}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
        <Text>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  sala: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
