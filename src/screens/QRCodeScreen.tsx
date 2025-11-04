import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Modal,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { RootStackParamList } from "../routes/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import api from "../api/api";

type Sala = {
  id: number;
  qr_code_id: string;
  nome_numero: string;
  localizacao: string;
  imagem?: string | null;
};

type QRCodeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "QRCode"
>;

export default function QRCodeScreen() {
  const navigation = useNavigation<QRCodeScreenNavigationProp>();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState<string | null>(null); // QR ampliado
  const baseURL = "http://127.0.0.1:8000";

  useEffect(() => {
    carregarSalas();
  }, []);

  async function carregarSalas() {
    try {
      const response = await api.get("/salas/");
      setSalas(response.data);
    } catch (error) {
      console.error("Erro ao carregar salas:", error);
    } finally {
      setLoading(false);
    }
  }

  function abrirPDF() {
    const url = `${baseURL}/media/salas_qr_codes.pdf`;
    Linking.openURL(url);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Carregando salas...</Text>
      </View>
    );
  }

  const renderSala = ({ item }: { item: Sala }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setSelectedQR(item.qr_code_id)}>
        <QRCode value={`${baseURL}/api/salas/${item.qr_code_id}/`} size={90} />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.nomeSala}>{item.nome_numero}</Text>
        <Text style={styles.detalhe}>Localização: {item.localizacao}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>QR Codes das Salas</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.botaoAbrir} onPress={abrirPDF}>
          <Text style={styles.botaoTexto}>Abrir PDF</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={salas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSala}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text>Nenhuma sala encontrada.</Text>}
      />

      {/* Modal para exibir QR ampliado */}
      <Modal
        visible={!!selectedQR}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedQR(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedQR && (
              <QRCode
                value={`${baseURL}/api/salas/${selectedQR}/`}
                size={300}
              />
            )}
            <TouchableOpacity
              style={styles.botaoFechar}
              onPress={() => setSelectedQR(null)}
            >
              <Text style={styles.botaoFecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  botaoAbrir: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "60%",
  },
  botaoTexto: { color: "#fff", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: { flex: 1, marginLeft: 12 },
  nomeSala: { fontSize: 18, fontWeight: "600", color: "#222" },
  detalhe: { fontSize: 14, color: "#555" },
  lista: { paddingBottom: 20 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  botaoFechar: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  botaoFecharTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
