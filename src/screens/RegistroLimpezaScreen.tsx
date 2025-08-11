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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type RegistroLimpeza = {
  id: number;
  sala_nome: string;
  usuario: string;
  observacao: string;
  data: string;
};

export default function HistoricoLimpezasScreen() {
  const [historico, setHistorico] = useState<RegistroLimpeza[]>([]);
  const [filtroSala, setFiltroSala] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const carregarHistorico = async (novaPagina = 1) => {
    if (loading) return;
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      let url = `http://192.168.15.3:8000/historico-limpezas/?page=${novaPagina}`;

      if (filtroSala) url += `&sala=${encodeURIComponent(filtroSala)}`;
      if (filtroData) url += `&data=${encodeURIComponent(filtroData)}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Token ${token}` },
      });

      if (novaPagina === 1) {
        setHistorico(response.data.results);
      } else {
        setHistorico((prev) => [...prev, ...response.data.results]);
      }

      setHasMore(response.data.next !== null);
      setPage(novaPagina);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o histórico");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarMais = () => {
    if (hasMore && !loading) {
      carregarHistorico(page + 1);
    }
  };

  const renderItem = ({ item }: { item: RegistroLimpeza }) => (
    <View style={styles.item}>
      <Text style={styles.sala}>{item.sala_nome}</Text>
      <Text style={styles.info}>Usuário: {item.usuario}</Text>
      <Text style={styles.info}>Observação: {item.observacao}</Text>
      <Text style={styles.data}>{new Date(item.data).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Limpezas</Text>

      <TextInput
        style={styles.input}
        placeholder="Filtrar por sala"
        value={filtroSala}
        onChangeText={setFiltroSala}
      />
      <TextInput
        style={styles.input}
        placeholder="Filtrar por data (AAAA-MM-DD)"
        value={filtroData}
        onChangeText={setFiltroData}
      />

      <Button title="Aplicar Filtros" onPress={() => carregarHistorico(1)} />

      <FlatList
        data={historico}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  sala: { fontSize: 18, fontWeight: "bold" },
  info: { fontSize: 14 },
  data: { fontSize: 12, color: "#666", marginTop: 5 },
});
