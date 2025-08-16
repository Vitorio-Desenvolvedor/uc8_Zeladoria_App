// src/screens/HistoricoScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { api } from '../services/api';
import { Limpeza } from '../routes/types';

export default function HistoricoScreen() {
  const [items, setItems] = useState<Limpeza[]>([]);
  const [search, setSearch] = useState('');

  async function loadData() {
    const { data } = await api.get<{ results?: Limpeza[] }>(`/limpezas/?ordering=-data${search ? `&search=${encodeURIComponent(search)}` : ''}`);
    const list = Array.isArray(data) ? (data as unknown as Limpeza[]) : (data.results ?? []);
    setItems(list);
  }

  useEffect(() => {
    loadData();
  }, [search]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>

      <TextInput
        placeholder="Buscar por observação..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.sala_nome ?? `Sala #${item.sala}`}</Text>
            <Text style={styles.cardLine}>Data: {new Date(item.data).toLocaleString()}</Text>
            <Text style={styles.cardLine}>Por: {item.usuario_username ?? `#${item.usuario}`}</Text>
            {item.observacao ? <Text style={styles.cardObs}>{item.observacao}</Text> : null}
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#666' }}>Sem registros.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 12 },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, marginBottom: 10 },
  cardTitle: { fontWeight: '800', marginBottom: 4 },
  cardLine: { color: '#444' },
  cardObs: { marginTop: 6, color: '#111' },
});
