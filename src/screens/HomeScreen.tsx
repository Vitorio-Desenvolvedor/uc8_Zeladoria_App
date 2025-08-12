import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type HomeScreenNavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela Inicial</Text>
      <Button title="Registrar Limpeza" onPress={() => navigation.navigate("RegistrarLimpeza")} />
      <View style={{ marginTop: 15 }}>
        <Button title="Histórico de Limpezas" onPress={() => navigation.navigate("HistoricoLimpezas")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});
