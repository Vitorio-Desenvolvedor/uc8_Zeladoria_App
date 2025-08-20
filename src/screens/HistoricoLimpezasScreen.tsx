import React, { useCallback, useState } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../api/api";

type Limpeza = {
  id: number;
  sala: number | { id: number; nome: string };
  observacao?: string;
  status?: string; // backend pode enviar status (ex.: "Concluída")
  criado_em?: string;
  usuario?: number | { id: number; username: string };
};

export default function HistoricoLimpezasScreen() {
  const [data, setData] = useState<Limpeza[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const res = await api.get<Limpeza[]>("/api/limpezas/");
    setData(res.data ?? []);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Limpeza }) => {
    const salaNome =
      typeof item.sala === "object" ? item.sala.nome ?? item.sala.id : item.sala;
    const usuarioNome =
      typeof item.usuario === "object" ? item.usuario.username ?? item.usuario.id : item.usuario;

    return (
      <View style={styles.card}>
        <Text style={styles.label}>Sala:</Text>
        <Text style={styles.value}>{salaNome}</Text>

        {item.observacao ? (
          <>
            <Text style={styles.label}>Obs:</Text>
            <Text style={styles.value}>{item.observacao}</Text>
          </>
        ) : null}

        {item.status ? (
          <>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{item.status}</Text>
          </>
        ) : null}

        {item.criado_em ? (
          <>
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.value}>{new Date(item.criado_em).toLocaleString()}</Text>
          </>
        ) : null}

        {item.usuario ? (
          <>
            <Text style={styles.label}>Usuário:</Text>
            <Text style={styles.value}>{usuarioNome}</Text>
          </>
        ) : null}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  label: { fontWeight: "600", marginTop: 6 },
  value: { marginTop: 2 },
});
