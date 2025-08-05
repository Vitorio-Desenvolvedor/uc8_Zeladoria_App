import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

type Sala = {
  id: number;
  nome: string;
  bloco: string;
  capacidade: number;
  recursos: string;
};

type RouteParams = {
  FormSala: {
    sala?: Sala;
  };
};

export default function FormSala() {
  const route = useRoute<RouteProp<RouteParams, 'FormSala'>>();
  const navigation = useNavigation();
  const { token, user } = useContext(AuthContext);

  const sala = route.params?.sala;

  const [nome, setNome] = useState(sala?.nome || '');
  const [bloco, setBloco] = useState(sala?.bloco || '');
  const [capacidade, setCapacidade] = useState(String(sala?.capacidade || ''));
  const [recursos, setRecursos] = useState(sala?.recursos || '');

  useEffect(() => {
    if (!user?.is_staff) {
      Alert.alert('Acesso negado', 'Você não tem permissão para acessar esta tela.');
      navigation.goBack();
    }
  }, []);

  const salvarSala = async () => {
    if (!nome || !bloco || !capacidade) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      nome,
      bloco,
      capacidade: parseInt(capacidade),
      recursos,
    };

    try {
      if (sala) {
        // Edição
        await axios.put(
          `http://127.0.0.1:8000/api/salas/${sala.id}/`,
          payload,
          { headers: { Authorization: `Token ${token}` } }
        );
        Alert.alert('Sucesso', 'Sala atualizada.');
      } else {
        // Criação
        await axios.post(`http://127.0.0.1:8000/api/salas/`, payload, {
          headers: { Authorization: `Token ${token}` },
        });
        Alert.alert('Sucesso', 'Sala criada.');
      }

      navigation.goBack();
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível salvar a sala.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{sala ? 'Editar Sala' : 'Nova Sala'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Sala"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Bloco"
        value={bloco}
        onChangeText={setBloco}
      />

      <TextInput
        style={styles.input}
        placeholder="Capacidade"
        value={capacidade}
        onChangeText={setCapacidade}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Recursos"
        value={recursos}
        onChangeText={setRecursos}
      />

      <Button title="Salvar" onPress={salvarSala} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    height: 40,
  },
});
