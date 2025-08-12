import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type Sala = {
  id: number;
  nome: string;
};

export default function SalasScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [novaSala, setNovaSala] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editNome, setEditNome] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const carregarSalas = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get("http://192.168.15.3:8000/salas/", {
        headers: { Authorization: `Token ${token}` },
      });
      setSalas(response.data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar as salas");
    }
  };

  const checarAdmin = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get("http://192.168.15.3:8000/auth/users/me/", {
        headers: { Authorization: `Token ${token}` },
      });
      setIsAdmin(response.data.is_staff);
    } catch {
      setIsAdmin(false);
    }
  };

  const adicionarSala = async () => {
    if (!novaSala.trim()) return;
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post(
        "http://192.168.15.3:8000/salas/",
        { nome: novaSala },
        { headers: { Authorization: `Token ${token}` } }
      );
      setNovaSala("");
      carregarSalas();
    } catch {
      Alert.alert("Erro", "Não foi possível adicionar a sala");
    }
  };

  const excluirSala = async (id: number) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.delete(`http://192.168.15.3:8000/salas/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      carregarSalas();
    } catch {
      Alert.alert("Erro", "Não foi possível excluir");
    }
  };

  const abrirEdicao = (id: number, nome: string) => {
    setEditId(id);
    setEditNome(nome);
    setModalVisible(true);
  };

  const salvarEdicao = async () => {
    if (editId === null) return;
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.put(
        `http://192.168.15.3:8000/salas/${editId}/`,
        { nome: editNome },
        { headers: { Authorization: `Token ${token}` } }
      );
      setModalVisible(false);
      carregarSalas();
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar");
    }
  };

  useEffect(() => {
    carregarSalas();
    checarAdmin();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Salas</Text>

      {isAdmin && (
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Nova sala"
            value={novaSala}
            onChangeText={setNovaSala}
          />
          <Button title="Adicionar" onPress={adicionarSala} />
        </View>
      )}

      <FlatList
        data={salas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.nome}</Text>
            {isAdmin && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.btnEdit}
                  onPress={() => abrirEdicao(item.id, item.nome)}
                >
                  <Text style={styles.btnText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnDelete}
                  onPress={() => excluirSala(item.id)}
                >
                  <Text style={styles.btnText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      {/* Modal Edição */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Editar Sala</Text>
            <TextInput
              style={styles.input}
              value={editNome}
              onChangeText={setEditNome}
            />
            <Button title="Salvar" onPress={salvarEdicao} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, flex: 1, marginRight: 5 },
  item: { flexDirection: "row", justifyContent: "space-between", padding: 15, backgroundColor: "#fff", borderRadius: 5, marginBottom: 10 },
  nome: { fontSize: 18 },
  actions: { flexDirection: "row" },
  btnEdit: { backgroundColor: "#3498db", padding: 5, borderRadius: 5, marginRight: 5 },
  btnDelete: { backgroundColor: "#e74c3c", padding: 5, borderRadius: 5 },
  btnText: { color: "#fff" },
  modal: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, width: "80%", borderRadius: 10 },
});
