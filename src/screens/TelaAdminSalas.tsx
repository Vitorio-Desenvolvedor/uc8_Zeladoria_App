import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { api } from '../api/api';
import { Sala } from '../routes/types';

export default function TelaAdminSalas() {
  const [salas, setSalas] = useState<Sala[]>([]);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await api.get<Sala[]>('/salas/');
        setSalas(response.data);
      } catch (error) {
        console.error('Erro ao carregar salas:', error);
      }
    };

    fetchSalas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Administração de Salas</Text>
      <FlatList
        data={salas}
        keyExtractor={(sala) => sala.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.salaItem}>
            <Text style={styles.nomeSala}>{item.nome}</Text>
            <Button title="Editar" onPress={() => console.log('Editar', item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  salaItem: { padding: 12, backgroundColor: '#eee', marginBottom: 8, borderRadius: 6 },
  nomeSala: { fontSize: 16 },
});
