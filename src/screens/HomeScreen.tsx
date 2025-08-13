import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function getAdminStatus() {
      const adminStatus = await AsyncStorage.getItem("isAdmin");
      setIsAdmin(adminStatus === "true");
    }
    getAdminStatus();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Sistema de Zeladoria</Text>

      {isAdmin && (
        <Button
          title="Ver Histórico de Limpezas"
          onPress={() => navigation.navigate("HistoricoLimpezas")}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Sair" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
