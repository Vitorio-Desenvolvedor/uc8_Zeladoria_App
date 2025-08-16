// src/screens/RegistrarLimpezaScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { api } from '../services/api';
import { Sala } from '../routes/types';
// Obs: Se não usa @react-native-picker/picker, você pode substituir por um select simples de botões.

export default function RegistrarLimpezaScreen({ navigation }: any) {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [selectedSala, setSelectedSala] = useState<number | null>(null);
  const [observacao, setObservacao] = useState('');

  async function loadSalas() {
    const res = await api.get<Sala[]>('/salas/');
    setSalas(res.data);
  }

  async function registrar() {
    if (!selectedSala) {
      Alert.alert('Aviso', 'Selecione uma sala.');
      return;
    }
    try {
      await api.post('/limpezas/', { sala: selectedSala, observacao });
      Alert.alert('Sucesso', 'Limpeza registrada!');
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível registrar. Verifique a conexão e se está logado.');
    }
  }

  useEffect(() => {
    loadSalas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Limpeza</Text>

      <View style={styles.salasWrap}>
        {salas.map((s) => (
          <TouchableOpacity
            key={s.id}
            onPress={() => setSelectedSala(s.id)}
            style={[styles.salaChip, selectedSala === s.id && styles.salaChipActive]}
          >
            <Text style={[styles.salaChipText, selectedSala === s.id && styles.salaChipTextActive]}>
              {s.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Observações..."
        value={observacao}
        onChangeText={setObservacao}
        style={styles.input}
        multiline
      />

      <TouchableOpacity style={styles.btn} onPress={registrar}>
        <Text style={styles.btnText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  salasWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12, gap: 8 },
  salaChip: { borderWidth: 1, borderColor: '#ccc', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20 },
  salaChipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  salaChipText: { color: '#333' },
  salaChipTextActive: { color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, height: 110, marginBottom: 12 },
  btn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: '700', textAlign: 'center' }
});
