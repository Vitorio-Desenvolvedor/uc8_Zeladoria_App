import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("isAdmin").then((value) => {
      setIsAdmin(value === "true");
    });
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Registrar Limpeza" onPress={() => navigation.navigate("RegistrarLimpeza")} />

      {/* Botão visível somente para administradores */}
      {isAdmin && (
        <Button
          title="Histórico de Limpezas"
          onPress={() => navigation.navigate("HistoricoLimpezas")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
