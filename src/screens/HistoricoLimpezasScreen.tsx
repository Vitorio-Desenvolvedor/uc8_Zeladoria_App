import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api } from '../services/api';
import { Sala, Limpeza } from '../routes/types';

type RootStackParamList = {
  HistoricoLimpezas: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'HistoricoLimpezas'>;

type Paged<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hh}:${mm}`;
  } catch {
    return iso;
  }
}

export default function HistoricoLimpezasScreen({}: Props) {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [selectedSalaId, setSelectedSalaId] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<'7' | '30' | 'all'>('7');

  const [data, setData] = useState<Limpeza[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // calcula range de datas baseado no "period"
  const { dateFrom, dateTo } = useMemo(() => {
    if (period === 'all') return { dateFrom: null as string | null, dateTo: null as string | null };
    const now = new Date();
    const toISO = (d: Date) => d.toISOString();
    const days = period === '7' ? 7 : 30;
    const from = new Date(now);
    from.setDate(from.getDate() - days);
    return { dateFrom: toISO(from), dateTo: toISO(now) };
  }, [period]);

  async function loadSalas() {
    const res = await api.get<Sala[]>('/salas/');
    setSalas(res.data);
  }

  async function loadFirstPage() {
    setLoading(true);
    try {
      const params: Record<string, any> = { ordering: '-data' };
      if (selectedSalaId) params.sala_id = selectedSalaId;
      if (search) params.search = search.trim();
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const res = await api.get<Paged<Limpeza>>('/limpezas/', { params });
      setData(res.data.results);
      setNextUrl(res.data.next);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!nextUrl || loadingMore) return;
    setLoadingMore(true);
    try {
      const relative = nextUrl.replace(api.defaults.baseURL || '', '');
      const res = await api.get<Paged<Limpeza>>(relative);
      setData(prev => [...prev, ...res.data.results]);
      setNextUrl(res.data.next);
    } finally {
      setLoadingMore(false);
    }
  }

  // inicial
  useEffect(() => {
    loadSalas();
  }, []);

  // recarrega quando filtros mudam
  useEffect(() => {
    loadFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSalaId, period]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Limpezas</Text>

      {/* Filtros */}
      <View style={styles.filters}>
        <View style={styles.chipsBox}>
          <TouchableOpacity
            style={[styles.chip, period === '7' && styles.chipActive]}
            onPress={() => setPeriod('7')}
          >
            <Text style={[styles.chipText, period === '7' && styles.chipTextActive]}>Últimos 7 dias</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, period === '30' && styles.chipActive]}
            onPress={() => setPeriod('30')}
          >
            <Text style={[styles.chipText, period === '30' && styles.chipTextActive]}>Últimos 30 dias</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, period === 'all' && styles.chipActive]}
            onPress={() => setPeriod('all')}
          >
            <Text style={[styles.chipText, period === 'all' && styles.chipTextActive]}>Todos</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.search}
          placeholder="Buscar por observação..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={loadFirstPage}
          returnKeyType="search"
        />

        {/* Lista de salas como chips */}
        <View style={styles.salasRow}>
          <TouchableOpacity
            style={[styles.salaChip, selectedSalaId === null && styles.salaChipActive]}
            onPress={() => setSelectedSalaId(null)}
          >
            <Text style={[styles.salaChipText, selectedSalaId === null && styles.salaChipTextActive]}>Todas</Text>
          </TouchableOpacity>

          {salas.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.salaChip, selectedSalaId === s.id && styles.salaChipActive]}
              onPress={() => setSelectedSalaId(s.id)}
            >
              <Text style={[styles.salaChipText, selectedSalaId === s.id && styles.salaChipTextActive]}>{s.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.reloadBtn} onPress={loadFirstPage}>
          <Text style={styles.reloadText}>Aplicar filtros</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.sala}>{item.sala_nome}</Text>
                <Text style={styles.data}>{formatDate(item.data)}</Text>
              </View>
              <Text style={styles.obs} numberOfLines={3}>
                {item.observacao || 'Sem observações.'}
              </Text>
              <View style={styles.footer}>
                <Text style={styles.user}>Por: {item.usuario_username}</Text>
                <Text style={styles.status}>{item.status || 'realizado'}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 24 }}>
              Nenhum registro encontrado.
            </Text>
          }
          onEndReachedThreshold={0.2}
          onEndReached={loadMore}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator style={{ marginTop: 10 }} /> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  filters: { marginBottom: 12 },
  chipsBox: { flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  chip: { borderWidth: 1, borderColor: '#e5e7eb', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 9999 },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipText: { color: '#111827' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  search: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, marginBottom: 8 },
  salasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  salaChip: { borderWidth: 1, borderColor: '#e5e7eb', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 9999 },
  salaChipActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  salaChipText: { color: '#111827' },
  salaChipTextActive: { color: '#fff', fontWeight: '700' },
  reloadBtn: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: '#111827', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  reloadText: { color: '#fff', fontWeight: '700' },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, marginBottom: 10, backgroundColor: '#f9fafb' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  sala: { fontWeight: '800' },
  data: { color: '#6b7280' },
  obs: { color: '#111827', marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  user: { color: '#374151' },
  status: { color: '#6b7280', fontStyle: 'italic' },
});
