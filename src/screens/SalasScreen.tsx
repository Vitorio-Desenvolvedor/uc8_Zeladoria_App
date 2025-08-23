import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import api from "../services/api";

interface Sala {
  id: number;
  nome: string;
  descricao: string;
}

export default function SalasScreen({ navigation }: any) {
  const [salas, setSalas] = useState<Sala[]>([]);

  useEffect(() => {
    api.get("/salas/").then((res) => setSalas(res.data));
  }, []);

  return (
    <FlatList
      data={salas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 18 }}>{item.nome}</Text>
          <Text>{item.descricao}</Text>
          <Button
            title="Registrar Limpeza"
            onPress={() => navigation.navigate("Limpeza", { salaId: item.id })}
          />
        </View>
      )}
    />
  );
}
