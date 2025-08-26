import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert } from 'react-native';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

interface Sala {
  id: number;
  nome: string;
  descricao: string;
}

const SalasScreen = () => {
  const { token } = useContext(AuthContext);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [observacao, setObservacao] = useState<string>('');

  useEffect(() => {
    if (token) {
      carregarSalas();
    }
  }, [token]);

  const carregarSalas = async () => {
    try {
      const response = await api.get('/salas/');
      setSalas(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar as salas.');
    }
  };

  const marcarComoLimpa = async (salaId: number) => {
    try {
      await api.post('/salas/limpeza/', {
        sala: salaId,
        observacao: observacao || 'Sem observação'
      });
      Alert.alert('Sucesso', 'Sala marcada como limpa!');
      setObservacao('');
      carregarSalas();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível registrar a limpeza.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salas</Text>
      <FlatList
        data={salas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.desc}>{item.descricao}</Text>
            <TextInput
              style={styles.input}
              placeholder="Observação"
              value={observacao}
              onChangeText={setObservacao}
            />
            <Button title="Marcar como limpa" onPress={() => marcarComoLimpa(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  card: { marginBottom: 15, padding: 15, borderWidth: 1, borderRadius: 8, backgroundColor: '#f9f9f9' },
  nome: { fontSize: 18, fontWeight: 'bold' },
  desc: { fontSize: 14, marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, borderRadius: 5, marginBottom: 10 }
});

export default SalasScreen;
