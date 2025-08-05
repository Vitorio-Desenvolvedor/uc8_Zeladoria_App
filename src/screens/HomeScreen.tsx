import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Sala = {
  id: number;
  nome: string;
  capacidade: number;
  recursos: string;
  status_limpeza: string;
  ultima_limpeza_data_hora: string | null;
  bloco: string;
};

export default function HomeScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'limpa' | 'pendente'>('todos');
  const [filtroBloco, setFiltroBloco] = useState<string>('todos');
  const [blocosDisponiveis, setBlocosDisponiveis] = useState<string[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [observacao, setObservacao] = useState('');
  const [salaSelecionada, setSalaSelecionada] = useState<Sala | null>(null);

  const { token, logout } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    carregarSalas();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Sair" onPress={logout} color="#d9534f" />
      ),
      title: 'Salas',
    });
  }, [navigation]);

  const carregarSalas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/salas/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setSalas(response.data);

      const blocosUnicos: string[] = [...new Set<string>(response.data.map((s: Sala) => s.bloco))];
      setBlocosDisponiveis(blocosUnicos);
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', 'Falha ao carregar salas.');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalLimpeza = (sala: Sala) => {
    setSalaSelecionada(sala);
    setObservacao('');
    setModalVisible(true);
  };

  const confirmarLimpeza = async () => {
    if (!salaSelecionada) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/salas/${salaSelecionada.id}/marcar_como_limpa/`,
        { observacao },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      Alert.alert('Sucesso', 'Sala marcada como limpa.');
      setModalVisible(false);
      setObservacao('');
      setSalaSelecionada(null);
      carregarSalas();
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível marcar a sala como limpa.');
    }
  };

  const formatarData = (dataUtc: string | null): string => {
    if (!dataUtc) return 'Nunca limpa';
    const data = new Date(dataUtc);
    return data.toLocaleString('pt-BR');
  };

  const salasFiltradas = salas.filter((sala) => {
    const statusOk =
      filtroStatus === 'todos' ||
      (filtroStatus === 'limpa' && sala.status_limpeza === 'limpa') ||
      (filtroStatus === 'pendente' && sala.status_limpeza !== 'limpa');

    const blocoOk = filtroBloco === 'todos' || sala.bloco === filtroBloco;

    return statusOk && blocoOk;
  });

  const renderSala = ({ item }: { item: Sala }) => (
    <View style={styles.sala}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text>Capacidade: {item.capacidade}</Text>
      <Text>Recursos: {item.recursos}</Text>
      <Text>Bloco: {item.bloco}</Text>
      <Text>Status: {item.status_limpeza}</Text>
      <Text>Última Limpeza: {formatarData(item.ultima_limpeza_data_hora)}</Text>

      {item.status_limpeza !== 'limpa' && (
      <Button
      title="Detalhes"
       onPress={() => navigation.navigate('SalaDetalhes', { sala: item })}/>
      )}
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
    <View style={{ flex: 1 }}>
      <ScrollView horizontal style={styles.filtros} showsHorizontalScrollIndicator={false}>
        <Button
          title="Todas"
          onPress={() => setFiltroStatus('todos')}
          color={filtroStatus === 'todos' ? '#007bff' : '#ccc'}
        />
        <Button
          title="Limpas"
          onPress={() => setFiltroStatus('limpa')}
          color={filtroStatus === 'limpa' ? '#28a745' : '#ccc'}
        />
        <Button
          title="Pendentes"
          onPress={() => setFiltroStatus('pendente')}
          color={filtroStatus === 'pendente' ? '#ffc107' : '#ccc'}
        />
      </ScrollView>

      <ScrollView horizontal style={styles.filtros} showsHorizontalScrollIndicator={false}>
        <Button
          title="Todos os Blocos"
          onPress={() => setFiltroBloco('todos')}
          color={filtroBloco === 'todos' ? '#17a2b8' : '#ccc'}
        />
        {blocosDisponiveis.map((bloco) => (
          <Button
            key={bloco}
            title={bloco}
            onPress={() => setFiltroBloco(bloco)}
            color={filtroBloco === bloco ? '#17a2b8' : '#ccc'}
          />
        ))}
      </ScrollView>

      <FlatList
        data={salasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSala}
        contentContainerStyle={styles.container}
        refreshing={refreshing}
        onRefresh={carregarSalas}
      />

      {/* Modal de Observação */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Observação da limpeza ({salaSelecionada?.nome})
            </Text>

            <TextInput
              placeholder="Digite uma observação (opcional)"
              value={observacao}
              onChangeText={setObservacao}
              style={styles.modalInput}
              multiline
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#ccc" />
              <Button title="Confirmar" onPress={confirmarLimpeza} color="#28a745" />
              
              <View style={{ marginTop: 20 }}>
              <Button title="👤 Meu Perfil" onPress={() => navigation.navigate('TelaPerfil')} />
              </View>

            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  sala: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  nome: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '90%',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
});
