import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Sala } from "../api/apiTypes";

type SalaDetalhesRouteProp = RouteProp<{ SalaDetalhes: { sala: Sala } }, "SalaDetalhes">;

export default function SalaDetalhesScreen() {
  const route = useRoute<SalaDetalhesRouteProp>();
  const { sala } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sala.nome_numero}</Text>
      <Text style={styles.info}>Capacidade: {sala.capacidade}</Text>
      <Text style={styles.info}>Localização: {sala.localizacao}</Text>
      <Text style={styles.info}>Descrição: {sala.descricao}</Text>
      <Text style={styles.info}>
        Última limpeza:{" "}
        {sala.ultima_limpeza_data_hora
          ? sala.ultima_limpeza_data_hora
          : "Nunca registrada"}
      </Text>
      <Text
        style={[
          styles.status,
          { color: sala.status_limpeza === "Limpa" ? "green" : "red" },
        ]}
      >
        Status: {sala.status_limpeza}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  info: { fontSize: 16, marginBottom: 8 },
  status: { fontSize: 18, fontWeight: "bold", marginTop: 15 },
});
