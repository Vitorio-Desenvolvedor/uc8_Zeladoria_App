import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import api from "../services/api";

interface Limpeza {
  id: number;
  sala_nome: string;
  observacao: string;
  data: string;
  usuario_nome: string;
}

export default function HistoricoScreen() {
  const [historico, setHistorico] = useState<Limpeza[]>([]);

  useEffect(() => {
    api.get("/historico/").then((res) => setHistorico(res.data));
  }, []);

  return (
    <FlatList
      data={historico}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 16 }}>{item.sala_nome}</Text>
          <Text>Por: {item.usuario_nome}</Text>
          <Text>Obs: {item.observacao}</Text>
          <Text>Data: {new Date(item.data).toLocaleString()}</Text>
        </View>
      )}
    />
  );
}
