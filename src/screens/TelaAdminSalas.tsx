import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TelaAdminSalas'>;

type Sala = {
  id: number;
  nome: string;
  capacidade: number;
  recursos: string;
  bloco: string;
};

export default function TelaAdminSalas() {
  const { token, user } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp>();

  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.is_staff) {
      Alert.alert('Acesso negado', 'Você não tem permissão para acessar esta tela.');
      navigation.goBack();
      return;
    }

    carregarSalas();
  }, []);

  const carregarSalas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/salas/', {
        headers: { Authorization: `Token ${token}` },
      });
      setSalas(response.data);
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível carregar as salas.');
    } finally {
      setLoading(false);
    }
  };

  const excluirSala = async (id: number) => {
    Alert.alert('Confirmar', 'Deseja realmente excluir esta sala?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://127.0.0.1:8000/api/salas/${id}/`, {
              headers: { Authorization: `Token ${token}` },
            });
            carregarSalas();
            Alert.alert('Sucesso', 'Sala excluída com sucesso.');
          } catch (error: any) {
            console.log(error.response?.data || error.message);
            Alert.alert('Erro', 'Não foi possível excluir a sala.');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Sala }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>{item.nome}</Text>
      <Text>Bloco: {item.bloco}</Text>
      <Text>Capacidade: {item.capacidade}</Text>
      <Text>Recursos: {item.recursos}</Text>

      <View style={styles.botoes}>
        <Button
          title="Editar"
          onPress={() => navigation.navigate('FormSala', { sala: item })}
        />
        <Button
          title="Excluir"
          color="#d9534f"
          onPress={() => excluirSala(item.id)}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#444" />
        <Text>Carregando salas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="➕ Nova Sala"
        onPress={() => navigation.navigate('FormSala', {})}
      />

      <FlatList
        data={salas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
