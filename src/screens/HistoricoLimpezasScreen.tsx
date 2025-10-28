import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import api from "../api/api";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

type Historico = {
  id: number;
  sala: string;
  sala_nome: string;
  funcionario_responsavel: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  observacoes?: string;
};

export default function HistoricoLimpezasScreen() {
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroSala, setFiltroSala] = useState("");
  console.log(`Procurando... ${filtroSala}`)
  const [filtroFuncionario, setFiltroFuncionario] = useState("");
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFimPicker, setShowFimPicker] = useState(false);

  const fetchHistorico = async () => {
    setLoading(true);
    try {
      let query = "?";
      if (filtroSala) query += `sala_nome=${filtroSala}&`;
      if (filtroFuncionario) query += `funcionario_username=${filtroFuncionario}&`;
      if (dataInicio)
        query += `data_hora_limpeza_after=${dataInicio
          .toISOString()
          .split("T")[0]}&`;
      if (dataFim)
        query += `data_hora_limpeza_before=${dataFim
          .toISOString()
          .split("T")[0]}&`;

      const res = await api.get(`/limpezas/${query}`);
      setHistorico(res.data);
    } catch (error) {
      console.log("Erro ao buscar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorico();
  }, []);

  const aplicarFiltros = () => fetchHistorico();

  const getStatusColor = (observacoes?: string) =>
    observacoes ? "#27AE60" : "#F39C12";

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#004A8D" />
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Limpezas</Text>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        <View style={styles.inputRow}>
          <Ionicons name="business" size={18} color="#004A8D" />
          <TextInput
            placeholder="Filtrar por sala"
            style={styles.input}
            value={filtroSala}
            onChangeText={setFiltroSala}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="person-circle" size={18} color="#004A8D" />
          <TextInput
            placeholder="Filtrar por funcionário"
            style={styles.input}
            value={filtroFuncionario}
            onChangeText={setFiltroFuncionario}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.dateRow}>
          <TouchableOpacity
            onPress={() => setShowInicioPicker(true)}
            style={styles.dateButton}
          >
            <Ionicons name="calendar" size={20} color="#004A8D" />
            <Text style={styles.dateText}>
              {dataInicio
                ? dataInicio.toLocaleDateString()
                : "Data início"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowFimPicker(true)}
            style={styles.dateButton}
          >
            <Ionicons name="calendar" size={20} color="#004A8D" />
            <Text style={styles.dateText}>
              {dataFim ? dataFim.toLocaleDateString() : "Data fim"}
            </Text>
          </TouchableOpacity>
        </View>

        {showInicioPicker && (
          <DateTimePicker
            value={dataInicio || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowInicioPicker(false);
              if (selectedDate) setDataInicio(selectedDate);
            }}
          />
        )}

        {showFimPicker && (
          <DateTimePicker
            value={dataFim || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowFimPicker(false);
              if (selectedDate) setDataFim(selectedDate);
            }}
          />
        )}

        <TouchableOpacity onPress={aplicarFiltros} style={styles.botaoAplicar}>
          <Ionicons name="search" size={18} color="#fff" />
          <Text style={styles.botaoTexto}>Aplicar filtros</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de histórico */}
      {historico.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="time-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>Nenhum histórico encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={historico}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const statusColor = getStatusColor(item.observacoes);
            const dataFormatada = new Date(
              item.data_hora_fim || item.data_hora_inicio
            ).toLocaleString();

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="business" size={20} color="#004A8D" />
                  <Text style={styles.cardSala}>{item.sala_nome}</Text>
                </View>

                <View style={styles.cardRow}>
                  <Ionicons name="person-circle" size={18} color="#555" />
                  <Text style={styles.cardText}>
                    Responsável: {item.funcionario_responsavel}
                  </Text>
                </View>

                <View style={styles.cardRow}>
                  <Ionicons name="calendar" size={18} color="#555" />
                  <Text style={styles.cardText}>Data: {dataFormatada}</Text>
                </View>

                <View style={styles.cardRow}>
                  <Ionicons
                    name="checkmark-done-circle"
                    size={18}
                    color={statusColor}
                  />
                  <Text style={[styles.cardText, { color: statusColor }]}>
                    Status:{" "}
                    {item.observacoes ? "Finalizada" : "Em andamento"}
                  </Text>
                </View>

                {item.observacoes && (
                  <View style={styles.cardRow}>
                    <Ionicons
                      name="chatbox-ellipses"
                      size={18}
                      color="#555"
                    />
                    <Text
                      style={[styles.cardText, { fontStyle: "italic" }]}
                    >
                      Obs: {item.observacoes}
                    </Text>
                  </View>
                )}
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F4F6F9" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004A8D",
    textAlign: "center",
    marginBottom: 20,
  },

  filtrosContainer: {
    backgroundColor: "#EAF2FB",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  input: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: "#333",
  },

  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 8,
    flex: 1,
    marginHorizontal: 4,
  },

  dateText: { marginLeft: 6, color: "#555", fontSize: 14 },

  botaoAplicar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#004A8D",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 5,
  },

  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 6,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardSala: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#004A8D",
    marginLeft: 8,
  },
  cardRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  cardText: { fontSize: 14, color: "#555", marginLeft: 6 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 10, color: "#777", fontSize: 16 },
  loadingText: { color: "#555", marginTop: 10 },
});
