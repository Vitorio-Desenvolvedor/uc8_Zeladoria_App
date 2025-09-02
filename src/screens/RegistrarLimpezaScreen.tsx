import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { Sala } from '../routes/types'; // importando a interface

export default function RegistrarLimpezaScreen() {
  const [observacao, setObservacao] = useState('');
  const [salaSelecionada, setSalaSelecionada] = useState<Sala | null>(null);

  const registrarLimpeza = () => {
    if (!salaSelecionada) {
      alert('Selecione uma sala antes de registrar.');
      return;
    }
    console.log('Limpeza registrada na sala:', salaSelecionada.nome, 'Obs:', observacao);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Limpeza</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite uma observação"
        value={observacao}
        onChangeText={setObservacao}
      />
      <Button title="Registrar" onPress={registrarLimpeza} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 6 },
});
