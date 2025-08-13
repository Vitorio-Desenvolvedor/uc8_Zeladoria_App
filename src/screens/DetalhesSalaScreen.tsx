import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../routes/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DetalhesSalaRouteProp = RouteProp<RootStackParamList, 'DetalhesSala'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DetalhesSala'>;

export default function DetalhesSalaScreen() {
  const route = useRoute<DetalhesSalaRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { salaId } = route.params;

  const [sala, setSala] = useState<any>(null);
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSala = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`http://192.168.15.3:8000/salas/${salaId}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setSala(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes da sala:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSala();
  }, [salaId]);

  const marcarComoLimpa = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `http://192.168.15.3:8000/salas/${salaId}/marcar_limpeza/`,
        { observacao },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      Alert.alert('Sucesso', 'Sala marcada como limpa!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao marcar limpeza:', error);
      Alert.alert('Erro', 'Não foi possível registrar a limpeza.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sala?.nome}</Text>
      <Text style={styles.info}>Status: {sala?.status}</Text>

      <Text style={styles.label}>Observação:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite uma observação..."
        value={observacao}
        onChangeText={setObservacao}
      />

      <Button title="Marcar como Limpa" onPress={marcarComoLimpa} color="green" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  info: { fontSize: 16, marginBottom: 20 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 15,
    borderRadius: 5,
  },
});
