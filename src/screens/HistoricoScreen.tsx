import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

interface Limpeza {
  id: number;
  sala: { nome: string };
  usuario: { username: string };
  observacao: string;
  data: string;
}

const HistoricoScreen = () => {
  const { token, user } = useContext(AuthContext);
  const [historico, setHistorico] = useState<Limpeza[]>([]);

  useEffect(() => {
    if (token && user?.is_staff) {
      carregarHistorico();
    }
  }, [token]);

  const carregarHistorico = async () => {
    try {
      const response = await api.get('/salas/historico/');
      setHistorico(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico.');
    }
  };

  if (!user?.is_staff) {
    return (
      <View style={styles.container}>
        <Text style={styles.negado}>Acesso negado. Somente administradores.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Limpezas</Text>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.sala}>Sala: {item.sala.nome}</Text>
            <Text>Responsável: {item.usuario.username}</Text>
            <Text>Observação: {item.observacao}</Text>
            <Text style={styles.data}>Data: {new Date(item.data).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  card: { marginBottom: 15, padding: 15, borderWidth: 1, borderRadius: 8, backgroundColor: '#f2f2f2' },
  sala: { fontSize: 16, fontWeight: 'bold' },
  data: { fontSize: 12, color: 'gray', marginTop: 5 },
  negado: { fontSize: 18, textAlign: 'center', color: 'red', marginTop: 50 }
});

export default HistoricoScreen;
