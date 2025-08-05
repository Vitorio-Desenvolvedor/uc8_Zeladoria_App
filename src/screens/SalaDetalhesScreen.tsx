import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

type Sala = {
  id: number;
  nome: string;
  capacidade: number;
  recursos: string;
  status_limpeza: string;
  ultima_limpeza_data_hora: string | null;
  bloco: string;
};

type Limpeza = {
  id: number;
  funcionario: string;
  data_hora: string;
  observacao?: string;
};

type RouteParams = {
  SalaDetalhes: {
    sala: Sala;
  };
};

export default function SalaDetalhesScreen() {
  const { token, user } = useContext(AuthContext);
  const route = useRoute<RouteProp<RouteParams, 'SalaDetalhes'>>();
  const navigation = useNavigation();
  const { sala } = route.params;

  const [observacao, setObservacao] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [atualizada, setAtualizada] = useState<Sala>(sala);
  const [historico, setHistorico] = useState<Limpeza[]>([]);

  const formatarData = (dataUtc: string | null): string => {
    if (!dataUtc) return 'Nunca limpa';
    const data = new Date(dataUtc);
    return data.toLocaleString('pt-BR');
  };

  const confirmarLimpeza = async () => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/salas/${atualizada.id}/marcar_como_limpa/`,
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
      setAtualizada({ ...atualizada, status_limpeza: 'limpa' });
      carregarHistorico(); // atualizar histórico após limpeza
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível marcar como limpa.');
    }
  };

  const carregarHistorico = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/salas/${sala.id}/historico/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setHistorico(response.data);
    } catch (error: any) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (user?.is_staff) {
      carregarHistorico();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{atualizada.nome}</Text>
      <Text>Capacidade: {atualizada.capacidade}</Text>
      <Text>Recursos: {atualizada.recursos}</Text>
      <Text>Bloco: {atualizada.bloco}</Text>
      <Text>Status: {atualizada.status_limpeza}</Text>
      <Text>Última Limpeza: {formatarData(atualizada.ultima_limpeza_data_hora)}</Text>

      {atualizada.status_limpeza !== 'limpa' && (
        <View style={{ marginTop: 20 }}>
          <Button title="Marcar como limpa" onPress={() => setModalVisible(true)} />
        </View>
      )}

      {/* HISTÓRICO PARA ADMIN */}
      {user?.is_staff && (
        <View style={{ marginTop: 30 }}>
          <Text style={styles.historicoTitulo}>Histórico de Limpezas</Text>

          {historico.length === 0 ? (
            <Text>Nenhum registro de limpeza.</Text>
          ) : (
            <FlatList
              data={historico}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.historicoItem}>
                  <Text style={{ fontWeight: 'bold' }}>
                    {item.funcionario} - {new Date(item.data_hora).toLocaleString('pt-BR')}
                  </Text>
                  {item.observacao && <Text>Obs: {item.observacao}</Text>}
                </View>
              )}
            />
          )}
        </View>
      )}

      {/* Modal de Observação */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Observação da limpeza</Text>

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
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
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
  historicoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historicoItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
});
