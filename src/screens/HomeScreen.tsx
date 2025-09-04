import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { getSalas, Sala } from "../api/salas";
import { getHistoricoPorSala, Historico } from "../api/historico";

export default function HomeScreen() {
  const { token } = useAuth();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [historicos, setHistoricos] = useState<{ [key: number]: Historico[] }>({});
  const [loading, setLoading] = useState(false);

  const fetchSalas = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getSalas(token);
      setSalas(data);

      // Buscar histórico de cada sala
      const historicoData: { [key: number]: Historico[] } = {};
      for (const sala of data) {
        historicoData[sala.id] = await getHistoricoPorSala(token, sala.id);
      }
      setHistoricos(historicoData);
    } catch (error) {
      console.error("Erro ao carregar salas ou histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salas e Histórico</Text>

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

              <Text style={styles.subTitle}>Últimas Limpezas:</Text>
              {historicos[item.id]?.length ? (
                historicos[item.id].slice(0, 2).map((h) => (
                  <Text key={h.id} style={styles.histText}>
                    • {h.usuario.username} - {h.data_limpeza} ({h.status})
                  </Text>
                ))
              ) : (
                <Text style={styles.histEmpty}>Nenhum registro</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  cardDesc: { fontSize: 14, color: "#555", marginBottom: 8 },
  subTitle: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  histText: { fontSize: 13, color: "#333" },
  histEmpty: { fontSize: 13, fontStyle: "italic", color: "#777" },
});
