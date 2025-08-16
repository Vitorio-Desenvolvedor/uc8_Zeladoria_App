// src/screens/AdminScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { Sala } from '../routes/types';
import { api } from '../services/api';

export default function AdminScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [newSala, setNewSala] = useState('');

  async function loadSalas() {
    const res = await api.get<Sala[]>('/salas/');
    setSalas(res.data);
  }

  async function addSala() {
    if (!newSala.trim()) return;
    try {
      const res = await api.post<Sala>('/salas/', { nome: newSala });
      setSalas(prev => [...prev, res.data]);
      setNewSala('');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível adicionar sala. Verifique se você é administrador.');
    }
  }

  async function updateSala(id: number, nome: string) {
    try {
      const res = await api.put<Sala>(`/salas/${id}/`, { nome });
      setSalas(prev => prev.map(s => (s.id === id ? res.data : s)));
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    }
  }

  async function deleteSala(id: number) {
    try {
      await api.delete(`/salas/${id}/`);
      setSalas(prev => prev.filter(s => s.id !== id));
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir.');
    }
  }

  useEffect(() => {
    loadSalas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administração de Salas</Text>

      <View style={styles.row}>
        <TextInput
          placeholder="Nova sala"
          value={newSala}
          onChangeText={setNewSala}
          style={styles.input}
        />
        <TouchableOpacity style={styles.btnAdd} onPress={addSala}>
          <Text style={styles.btnText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={salas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TextInput
              value={item.nome}
              onChangeText={(txt) => updateSala(item.id, txt)}
              style={styles.inputInline}
            />
            <TouchableOpacity onPress={() => deleteSala(item.id)} style={styles.btnDel}>
              <Text style={styles.btnText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#666' }}>Nenhuma sala cadastrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, flex: 1, padding: 8, marginRight: 8 },
  btnAdd: { backgroundColor: '#2563eb', padding: 10, borderRadius: 6 },
  btnDel: { backgroundColor: '#dc2626', padding: 8, borderRadius: 6, marginLeft: 8 },
  btnText: { color: '#fff', fontWeight: '700' },
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  inputInline: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 6 }
});
