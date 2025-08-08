import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  TextInput,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
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
  const { token, user } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp>();

  const [salas, setSalas] = useState<Sala[]>([]);
  const [blocoSelecionado, setBlocoSelecionado] = useState<string | null>(null);
  const [blocosDisponiveis, setBlocosDisponiveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState<string>(''); // estado da busca por nome

  useEffect(() => {
    buscarSalas();
  }, []);

  const buscarSalas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/salas/', {
        headers: { Authorization: `Token ${token}` },
      });
      // Dentro do axios.post na LoginScreen
      await AsyncStorage.setItem('auth_token', token);
      navigation.reset({
      index: 0,
       routes: [{ name: 'Home' }],
});
      setSalas(response.data);

      const blocosUnicos: string[] = [...new Set<string>(response.data.map((s: Sala) => s.bloco))];
      setBlocosDisponiveis(blocosUnicos);
    } catch (error: any) {
      console.error('Erro ao buscar salas:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const salasFiltradas = salas.filter((s) => {
    const nomeCorrespondente = s.nome.toLowerCase().includes(busca.toLowerCase());
    const blocoCorrespondente = blocoSelecionado ? s.bloco === blocoSelecionado : true;
    return nomeCorrespondente && blocoCorrespondente;
  });

  const renderSala = ({ item }: { item: Sala }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('SalaDetalhes', { sala: item })}
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
      <Text style={styles.header}>Buscar por nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da sala..."
        value={busca}
        onChangeText={setBusca}
      />

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

      <View style={{ marginTop: 20 }}>
        <Button title="👤 Meu Perfil" onPress={() => navigation.navigate('TelaPerfil')} />
        {user?.is_staff && (
          <>
            <Button title="⚙️ Gerenciar Salas" onPress={() => navigation.navigate('TelaAdminSalas')} />
            <Button title="📜 Ver Histórico Geral" onPress={() => navigation.navigate('TelaHistorico')} />
            <Button title="➕ Cadastrar Usuário" onPress={() => navigation.navigate('TelaCadastroUsuario')} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
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
});
