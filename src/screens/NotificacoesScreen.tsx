import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native"; 
import { useNotificacoes } from "../hooks/useNotificacoes";

export default function NotificacoesScreen() {
  const {
    notificacoes,
    loading,
    error,
    marcarComoLida,
    marcarTodasComoLidas,
    carregarNotificacoes, // Vamos usar este
  } = useNotificacoes();

  // Recarrega notificações ao focar na tela
  useFocusEffect(
    useCallback(() => {
      carregarNotificacoes();
    }, [carregarNotificacoes])
  );

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004A8D" />
        <Text style={styles.loadingText}>Carregando notificações...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={40} color="#E53935" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificações</Text>
        <TouchableOpacity
          style={styles.readAllButton}
          onPress={marcarTodasComoLidas}
        >
          <Ionicons name="checkmark-done-outline" size={20} color="#fff" />
          <Text style={styles.readAllText}>Marcar todas como lidas</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de notificações */}
      {notificacoes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={50} color="#888" />
          <Text style={styles.emptyText}>Nenhuma notificação por aqui</Text>
        </View>
      ) : (
        <FlatList
          data={notificacoes}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.notificationCard,
                { backgroundColor: item.lida ? "#E9ECEF" : "#D6EAF8" },
              ]}
              onPress={() => marcarComoLida(item.id)}
            >
              <View style={styles.notificationHeader}>
                <Ionicons
                  name={item.lida ? "mail-open-outline" : "mail-outline"}
                  size={22}
                  color={item.lida ? "#777" : "#004A8D"}
                />
                <Text
                  style={[
                    styles.notificationText,
                    { fontWeight: item.lida ? "normal" : "bold" },
                  ]}
                >
                  {item.mensagem}
                </Text>
              </View>
              <Text style={styles.notificationDate}>
                {new Date(item.data_criacao).toLocaleString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#004A8D",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  readAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0066CC",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  readAllText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 5,
    fontWeight: "500",
  },

  listContent: { padding: 15 },

  notificationCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  notificationText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
    flexShrink: 1,
  },

  notificationDate: { fontSize: 12, color: "#666", marginLeft: 32 },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#555", marginTop: 10 },

  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#E53935", marginTop: 10, fontSize: 16 },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#777", marginTop: 10 },
});
