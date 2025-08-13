import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetalhesSalaScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { sala } = route.params;
  const [observacao, setObservacao] = useState('');

  const marcarComoLimpa = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Você precisa estar logado.');
        return;
      }

      await axios.post(
        'http://192.168.15.3:8000/api/limpezas/',
        { sala: sala.id, observacao },
        { headers: { Authorization: `Token ${token}` } }
      );

      Alert.alert('Sucesso', 'Sala marcada como limpa.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível registrar a limpeza.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{sala.nome}</Text>
      <Text style={styles.descricao}>{sala.descricao}</Text>

      <TextInput
        style={styles.input}
        placeholder="Observação (opcional)"
        value={observacao}
        onChangeText={setObservacao}
      />

      <Button title="Marcar como limpa" onPress={marcarComoLimpa} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  descricao: { fontSize: 16, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});
