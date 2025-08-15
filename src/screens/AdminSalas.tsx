import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

type Sala = {
  id: number;
  nome: string;
  status: string;
};

export default function AdminSalas() {
  const {token} = useContext(AuthContext);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [novoNome, setNovoNome] = useState('');
  const [loading, setLoading] = useState(true);

  const carregarSalas = () => {
    axios
      .get('http://192.168.15.3:8000/api/salas/', {
        headers: { Authorization: `Token ${token}` }
      })
      .then((res) => setSalas(res.data))
      .catch((err) => console.error('Erro ao carregar salas', err))
      .finally(() => setLoading(false));
  };

  const adicionarSala = () => {
    if (!novoNome.trim()) return;
    axios
      .post(
        'http://192.168.15.3:8000/api/salas/',
        { nome: novoNome, status: 'Desconhecido' },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(() => {
        setNovoNome('');
        carregarSalas();
      })
      .catch((err) => console.error('Erro ao adicionar sala', err));
  };

  const excluirSala = (id: number) => {
    axios
      .delete(`http://192.168.15.3:8000/api/salas/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(() => carregarSalas())
      .catch((err) => console.error('Erro ao excluir sala', err));
  };

  useEffect(() => {
    carregarSalas();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administração de Salas</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da nova sala"
        value={novoNome}
        onChangeText={setNovoNome}
      />
      <Button title="Adicionar Sala" onPress={adicionarSala} />
      <FlatList
        data={salas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.sala}>
            <Text style={styles.nome}>{item.nome}</Text>
            <TouchableOpacity onPress={() => excluirSala(item.id)}>
              <Text style={styles.excluir}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  sala: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  nome: { fontWeight: 'bold' },
  excluir: { color: 'red' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});