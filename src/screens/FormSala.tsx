import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/types';

type Sala = {
  id: number;
  nome: string;
  capacidade: number;
  recursos: string;
  bloco: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const { token, user } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const [salas, setSalas] = useState<Sala[]>([]);
  const [blocoSelecionado, setBlocoSelecionado] = useState<string | null>(null);
  const [blocosDisponiveis, setBlocosDisponiveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarSalas();
  }, []);

  const buscarSalas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/salas/', {
        headers: { Authorization: `Token ${token}` },
      });

      setSalas(response.data);

      // Corrigido: set tipado como string[]
      const blocosUnicos: string[] = [...new Set<string>(response.data.map((s: Sala) => s.bloco))];
      setBlocosDisponiveis(blocosUnicos);
    } catch (error: any) {
      console.error('Erro ao buscar salas:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const salasFiltradas = blocoSelecionado
    ? salas.filter((s) => s.bloco === blocoSelecionado)
    : salas;

  const renderSala = ({ item }: { item: Sala }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetalhesSala', { salaId: item.id })}
    >
      <Text style={styles.titulo}>{item.nome}</Text>
      <Text>Bloco: {item.bloco}</Text>
      <Text>Capacidade: {item.capacidade}</Text>
      <Text>Recursos: {item.recursos}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
        <Text>Carregando salas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Blocos</Text>
      <FlatList
        data={blocosDisponiveis}
        horizontal
        keyExtractor={(item) => item}
        contentContainerStyle={styles.blocosContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.bloco,
              blocoSelecionado === item && styles.blocoSelecionado,
            ]}
            onPress={() => setBlocoSelecionado(item === blocoSelecionado ? null : item)}
          >
            <Text style={styles.blocoTexto}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={salasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSala}
        contentContainerStyle={styles.listaSalas}
      />

      {user?.is_staff && (
        <View style={styles.adminArea}>
          <Button title="⚙️ Gerenciar Salas" onPress={() => navigation.navigate('AdminSalas')} />
          <Button title="📜 Ver Histórico" onPress={() => navigation.navigate('TelaHistorico')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  blocosContainer: {
    marginBottom: 10,
  },
  bloco: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  blocoSelecionado: {
    backgroundColor: '#007bff',
  },
  blocoTexto: {
    color: '#000',
  },
  listaSalas: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  adminArea: {
    marginTop: 20,
  },
});
