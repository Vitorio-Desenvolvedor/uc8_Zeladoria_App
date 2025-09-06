import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { getSalas, deleteSala, SalaCredenciais } from "../api/salas";
import { useNavigation } from "@react-navigation/native";

export default function TelaAdminSalas() {
  const { token } = useAuth();
  const navigation = useNavigation();
  const [salas, setSalas] = useState<SalaCredenciais[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar salas
  const fetchSalas = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getSalas(token);
      setSalas(data);
    } catch (error) {
      console.error("Erro ao buscar salas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Excluir sala
  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await deleteSala(token, id);
      Alert.alert("Sucesso", "Sala excluída com sucesso!");
      fetchSalas();
    } catch (error) {
      console.error("Erro ao excluir sala:", error);
      Alert.alert("Erro", "Não foi possível excluir a sala.");
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Salas</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("FormSala" as never)}
      >
        <Text style={styles.addText}>+ Nova Sala</Text>
      </TouchableOpacity>

      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardDesc}>{item.descricao}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate("FormSala" as never, { sala: item } as never)}
                >
                  <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.deleteText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  addButton: { backgroundColor: "#2ecc71", padding: 12, borderRadius: 8, marginBottom: 15 },
  addText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  cardDesc: { fontSize: 14, color: "#555", marginBottom: 8 },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  editButton: { backgroundColor: "#3498db", padding: 8, borderRadius: 6 },
  editText: { color: "#fff" },
  deleteButton: { backgroundColor: "#e74c3c", padding: 8, borderRadius: 6 },
  deleteText: { color: "#fff" },
});
