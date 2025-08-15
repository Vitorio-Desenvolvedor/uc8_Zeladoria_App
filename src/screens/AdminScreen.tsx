import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AdminSalasScreen() {
  const [salas, setSalas] = useState([]);
  const [nome, setNome] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const fetchSalas = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.get("http://192.168.15.3:8000/api/salas/", {
      headers: { Authorization: `Token ${token}` }
    });
    setSalas(res.data);
  };

  const salvarSala = async () => {
    const token = await AsyncStorage.getItem("token");
    if (editandoId) {
      await axios.put(`http://192.168.15.3:8000/api/salas/${editandoId}/`, { nome }, {
        headers: { Authorization: `Token ${token}` }
      });
      setEditandoId(null);
    } else {
      await axios.post("http://192.168.15.3:8000/api/salas/", { nome }, {
        headers: { Authorization: `Token ${token}` }
      });
    }
    setNome("");
    fetchSalas();
  };

  const deletarSala = async (id: number) => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`http://192.168.15.3:8000/api/salas/${id}/`, {
      headers: { Authorization: `Token ${token}` }
    });
    fetchSalas();
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  const editarSala = (sala: any) => {
    setNome(sala.nome);
    setEditandoId(sala.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gerenciar Salas</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da sala"
        value={nome}
        onChangeText={setNome}
      />

      <Button title={editandoId ? "Atualizar Sala" : "Adicionar Sala"} onPress={salvarSala} />

      <FlatList
        data={salas}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <View style={styles.item}>
            <Text>{item.nome}</Text>
            <View style={styles.botoes}>
              <TouchableOpacity onPress={() => editarSala(item)}>
                <Text style={styles.editar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deletarSala(item.id)}>
                <Text style={styles.excluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10, borderRadius: 5 },
  item: { backgroundColor: "#eee", padding: 10, borderRadius: 5, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  botoes: { flexDirection: "row", gap: 10 },
  editar: { color: "blue" },
  excluir: { color: "red" }
});
