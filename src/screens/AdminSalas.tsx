import React, { useCallback, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../api/api";

type Sala = { id: number; nome: string; descricao?: string };

export default function AdminSalasScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSalas = async () => {
    const res = await api.get<Sala[]>("/api/salas/");
    setSalas(res.data ?? []);
  };

  useFocusEffect(
    useCallback(() => {
      fetchSalas();
    }, [])
  );

  const adicionarSala = async () => {
    try {
      if (!nome) return Alert.alert("Atenção", "Informe o nome da sala.");
      setLoading(true);
      const res = await api.post<Sala>("/api/salas/", { nome, descricao });
      setSalas((prev) => [res.data, ...prev]);
      setNome("");
      setDescricao("");
    } catch (e: any) {
      Alert.alert("Erro", e?.response?.data?.detail ?? "Não foi possível adicionar.");
    } finally {
      setLoading(false);
    }
  };

  const excluirSala = async (id: number) => {
    try {
      await api.delete(`/api/salas/${id}/`);
      setSalas((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      Alert.alert("Erro", e?.response?.data?.detail ?? "Não foi possível excluir.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administração de Salas</Text>

      <TextInput
        placeholder="Nome da sala"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Descrição (opcional)"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.input}
      />
      <Button title={loading ? "Salvando..." : "Adicionar Sala"} onPress={adicionarSala} disabled={loading} />

      <FlatList
        data={salas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingVertical: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            {item.descricao ? <Text style={styles.desc}>{item.descricao}</Text> : null}
            <TouchableOpacity onPress={() => excluirSala(item.id)} style={styles.deleteBtn}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 10,
  },
  card: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 12, backgroundColor: "#fff",
  },
  nome: { fontWeight: "700", fontSize: 16 },
  desc: { marginTop: 4 },
  deleteBtn: {
    alignSelf: "flex-start",
    marginTop: 10,
    backgroundColor: "#e53935",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
