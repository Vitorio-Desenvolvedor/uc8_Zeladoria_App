import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HistoricoLimpezasScreen() {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const fetchHistorico = async () => {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get("http://192.168.15.3:8000/api/historico/", {
        headers: { Authorization: `Token ${token}` }
      });
      setHistorico(res.data);
    };
    fetchHistorico();
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      <Text style={styles.sala}>Sala: {item.sala.nome}</Text>
      <Text>Responsável: {item.usuario.username}</Text>
      <Text>Observação: {item.observacao}</Text>
      <Text>Data: {new Date(item.data).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={historico}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  item: { backgroundColor: "#f1f1f1", padding: 10, marginBottom: 10, borderRadius: 5 },
  sala: { fontWeight: "bold" }
});
