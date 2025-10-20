import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";
import { Ionicons } from "@expo/vector-icons";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Bem-vindo</Text>
      </View>

      {/* Botões principais */}
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => navigation.navigate("Salas")}
        >
          <Ionicons name="business" size={28} color="#004A8D" />
          <Text style={styles.topButtonLabel}>Ver Salas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.topButton}
          onPress={() => navigation.navigate("HistoricoLimpezas")}
        >
          <Ionicons name="time" size={28} color="#004A8D" />
          <Text style={styles.topButtonLabel}>Histórico de Limpezas</Text>
        </TouchableOpacity>
      </View>

      {/* Espaço central */}
      <View style={styles.centerContent}>
        <Text style={styles.centerText}>
          Escolha uma opção acima para continuar.
        </Text>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={28} color="#fff" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("TelaPerfil")}
        >
          <Ionicons name="person-circle" size={28} color="#fff" />
          <Text style={styles.footerLabel}>Perfil</Text>
        </TouchableOpacity>

        {user?.is_staff && (
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("Admin")}
          >
            <Ionicons name="settings" size={28} color="#fff" />
            <Text style={styles.footerLabel}>Admin</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.footerButton} onPress={logout}>
          <Ionicons name="log-out" size={28} color="#E53935" />
          <Text style={[styles.footerLabel, { color: "#E53935" }]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9" },
  header: { backgroundColor: "#004A8D", padding: 20, alignItems: "center" },
  headerText: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  topButton: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#D6EAF8",
    padding: 15,
    borderRadius: 12,
    width: 150,
  },
  topButtonLabel: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: "bold",
    color: "#004A8D",
    textAlign: "center",
  },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  centerText: { fontSize: 16, color: "#555", textAlign: "center", paddingHorizontal: 20 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#004A8D",
    paddingVertical: 10,
    paddingBottom: 25,
  },
  footerButton: { flexDirection: "column", alignItems: "center" },
  footerLabel: { fontSize: 12, marginTop: 3, color: "#fff" },
});
