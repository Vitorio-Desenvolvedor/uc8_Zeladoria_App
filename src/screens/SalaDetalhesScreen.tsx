import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { RootStackParamList } from '../routes/types';

type SalaDetalhesRouteProp = RouteProp<RootStackParamList, 'SalaDetalhes'>;

export default function SalaDetalhes() {
  const route = useRoute<SalaDetalhesRouteProp>();
  const navigation = useNavigation();
  const { token, user } = useContext(AuthContext);
  const { sala } = route.params;

  const [observacao, setObservacao] = useState('');
  const [historico, setHistorico] = useState<any[]>([]);

  useEffect(() => {
    buscarHistorico();
  }, []);

  const buscarHistorico = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/historico/sala/${sala.id}/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setHistorico(response.data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const marcarComoLimpa = async () => {
    if (!observacao.trim()) {
      Alert.alert('Erro', 'A observação é obrigatória!');
      return;
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/limpezas/',
        {
          sala: sala.id,
          observacao: observacao,
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      Alert.alert('Sucesso', 'Limpeza registrada com sucesso!');
      setObservacao('');
      buscarHistorico();
    } catch (error) {
      console.error('Erro ao marcar limpeza:', error);
      Alert.alert('Erro', 'Não foi possível registrar a limpeza.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{sala.nome}</Text>
      <Text>Capacidade: {sala.capacidade}</Text>
      <Text>Recursos: {sala.recursos}</Text>
      <Text>Bloco: {sala.bloco}</Text>

      <TextInput
        style={styles.input}
        placeholder="Observação da limpeza..."
        value={observacao}
        onChangeText={setObservacao}
      />
      <Button title="Marcar como limpa" onPress={marcarComoLimpa} />

      <Text style={styles.subtitulo}>Histórico de Limpezas</Text>

      <FlatList
        data={historico}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>🧹 Por: {item.usuario}</Text>
            <Text>📅 Em: {new Date(item.data).toLocaleString()}</Text>
            <Text>📝 Obs: {item.observacao}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtitulo: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
});
