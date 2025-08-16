import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TelaAdmin() {
  const [salas, setSalas] = useState([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const API_URL = 'http://192.168.15.3:8000/salas/';

  async function carregarSalas() {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Token ${token}` }
      });
      setSalas(res.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as salas');
    }
  }

  async function salvarSala() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (editandoId) {
        await axios.put(`${API_URL}${editandoId}/`, { nome }, {
          headers: { Authorization: `Token ${token}` }
        });
        Alert.alert('Sucesso', 'Sala atualizada com sucesso');
      } else {
        await axios.post(API_URL, { nome }, {
          headers: { Authorization: `Token ${token}` }
        });
        Alert.alert('Sucesso', 'Sala criada com sucesso');
      }
      setNome('');
      setEditandoId(null);
      carregarSalas();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a sala');
    }
  }

  async function deletarSala(id: number) {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      Alert.alert('Sucesso', 'Sala removida');
      carregarSalas();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a sala');
    }
  }

  function iniciarEdicao(sala: any) {
    setNome(sala.nome);
    setEditandoId(sala.id);
  }

  useEffect(() => {
    carregarSalas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gerenciamento de Salas</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da sala"
        value={nome}
        onChangeText={setNome}
      />
      <Button title={editandoId ? "Atualizar Sala" : "Adicionar Sala"} onPress={salvarSala} />

      <FlatList
        data={salas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nome}</Text>
            <Button title="Editar" onPress={() => iniciarEdicao(item)} />
            <Button title="Excluir" color="red" onPress={() => deletarSala(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  item: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }
});
