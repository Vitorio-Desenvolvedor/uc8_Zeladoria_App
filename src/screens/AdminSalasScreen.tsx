import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Sala {
  id: number;
  nome: string;
  descricao: string;
  status: string;
}

export default function AdminSalasScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  const fetchSalas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://192.168.15.3:8000/api/salas/salas/', {
        headers: { Authorization: `Token ${token}` },
      });
      setSalas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const adicionarSala = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Digite o nome da sala');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        'http://192.168.15.3:8000/api/salas/salas/',
        { nome, descricao },
        { headers: { Authorization: `Token ${token}` } }
      );
      setNome('');
      setDescricao('');
      fetchSalas();
    } catch (error) {
      console.error(error);
    }
  };

  const removerSala = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://192.168.15.3:8000/api/salas/salas/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchSalas();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administração de Salas</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Sala"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <Button title="Adicionar Sala" onPress={adicionarSala} />

      <FlatList
        data={salas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.sala}>{item.nome}</Text>
            <Text>{item.descricao}</Text>
            <Button title="Remover" color="red" onPress={() => removerSala(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  sala: { fontWeight: 'bold', fontSize: 16 },
});
