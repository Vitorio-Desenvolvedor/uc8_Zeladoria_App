import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "../api/api";

type Sala = { id: number; nome: string; descricao?: string };

export default function DetalhesSalaScreen({ route }: any) {
  const { salaId } = route.params;
  const [sala, setSala] = useState<Sala | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Sala>(`/api/salas/${salaId}/`);
        setSala(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [salaId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!sala) {
    return (
      <View style={styles.center}>
        <Text>Não foi possível carregar a sala.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sala #{sala.id}</Text>
      <Text style={styles.label}>Nome:</Text>
      <Text style={styles.value}>{sala.nome}</Text>

      {sala.descricao ? (
        <>
          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.value}>{sala.descricao}</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  label: { marginTop: 8, fontWeight: "600" },
  value: { marginTop: 4 },
});
