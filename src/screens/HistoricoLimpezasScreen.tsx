// src/screens/HistoricoLimpezasScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

type Limpeza = {
  id: number;
  sala: number;
  sala_nome: string;
  usuario: number;
  usuario_nome: string;
  observacao: string;
  data_limpeza: string;
};

export default function HistoricoLimpezasScreen() {
  const navigation = useNavigation();
  const [historico, setHistorico] = useState<Limpeza[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filtroSala, setFiltroSala] = useState("");
  const [filtroData, setFiltroData] = useState("");

  const carregarHistorico = async (pagina = 1, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      let url = `http://192.168.15.3:8000/api/historico/?page=${pagina}`;

      if (filtroSala) url += `&sala=${encodeURIComponent(filtroSala)}`;
      if (filtroData) url += `&data=${encodeURIComponent(filtroData)}`;

      const resp = await axios.get(url, {
        headers: { Authorization: `Token ${token}` },
      });

      // DRF pagination returns results
      const results = resp.data.results ?? resp.data;
      if (reset) {
        setHistorico(results);
      } else {
        setHistorico((prev) => (pagina === 1 ? results : [...prev, ...results]));
      }

      setHasMore(Boolean(resp.data.next));
      setPage(pagina);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível carregar o histórico (verifique backend).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // inicial
    carregarHistorico(1, true);
  }, []);

  const carregarMais = () => {
    if (hasMore && !loading) {
      carregarHistorico(page + 1);
    }
  };

  const aplicarFiltros = () => {
    // resetar e aplicar
    carregarHistorico(1, true);
  };

  const renderItem = ({ item }: { item: Limpeza }) => (
    <View style={styles.card}>
      <Text style={styles.titleCard}>Sala: {item.sala_nome}</Text>
      <Text>Usuário: {item.usuario_nome}</Text>
      <Text>Observação: {item.observacao || "—"}</Text>
      <Text style={styles.dateText}>{new Date(item.data_limpeza).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Histórico de Limpezas</Text>

      <TextInput
        style={styles.input}
        placeholder="Filtrar por ID de sala (ex: 1)"
        value={filtroSala}
        onChangeText={setFiltroSala}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Data (AAAA-MM-DD)"
        value={filtroData}
        onChangeText={setFiltroData}
      />
      <Button title="Aplicar filtros" onPress={aplicarFiltros} />

      {loading && historico.length === 0 ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          style={{ marginTop: 12 }}
          data={historico}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={carregarMais}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  pageTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginBottom: 8 },
  card: { backgroundColor: "#f8f8f8", padding: 12, marginBottom: 8, borderRadius: 6 },
  titleCard: { fontWeight: "bold", marginBottom: 4 },
  dateText: { color: "#666", marginTop: 6, fontSize: 12 },
});
