import React, { useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";
import { Ionicons } from "@expo/vector-icons";
import { useNotificacoes } from "../hooks/useNotificacoes";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { notificacoes, carregarNotificacoes } = useNotificacoes();

  // Recarrega notificações sempre que o usuário voltar para a Home
  useFocusEffect(
    useCallback(() => {
      carregarNotificacoes();
    }, [carregarNotificacoes])
  );

  // Conta quantas notificações não lidas existem
  const naoLidas = useMemo(() => {
    return notificacoes.filter((n) => !n.lida).length;
  }, [notificacoes]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Bem-vindo</Text>
      </View>

      {/* Área de botões principais */}
      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Salas")}>
          <Ionicons name="business" size={26} color="#004A8D" />
          <Text style={styles.cardLabel}>Ver Salas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("HistoricoLimpezas")}>
          <Ionicons name="time-outline" size={26} color="#004A8D" />
          <Text style={styles.cardLabel}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Notificacao")}>
          <View style={styles.notifIconWrapper}>
            <Ionicons name="notifications-outline" size={26} color="#004A8D" />
            {naoLidas > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{naoLidas}</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardLabel}>Notificações</Text>
        </TouchableOpacity>
      </View>

      {/* Texto informativo */}
      <View style={styles.centerContent}>
        <Text style={styles.centerText}>Escolha uma das opções acima para continuar.</Text>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={24} color="#fff" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>

         <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("QRCode")}> 
          <Ionicons name="qr-code-outline" size={24} color="#fff" />
          <Text style={styles.footerLabel}>QRCode</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("TelaPerfil")}>
          <Ionicons name="person-circle" size={24} color="#fff" />
          <Text style={styles.footerLabel}>Perfil</Text>
        </TouchableOpacity>

        {user?.is_staff && (
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("Admin")}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
            <Text style={styles.footerLabel}>Admin</Text>
          </TouchableOpacity>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9" },

  header: {
    backgroundColor: "#004A8D",
    paddingVertical: 18,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginTop: 25,
  },
  card: {
    width: "28%",
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#004A8D",
    textAlign: "center",
    marginTop: 6,
  },

  notifIconWrapper: { position: "relative" },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "#E53935",
    borderRadius: 8,
    paddingHorizontal: 5,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },

  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  centerText: { fontSize: 15, color: "#555", textAlign: "center", paddingHorizontal: 25 },

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
