import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, TextInput, Card, Chip, useTheme, ActivityIndicator, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { orcamentoService } from '../../src/api/orcamento.service';
import { IOrcamento } from '../../src/types';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function OrcamentosScreen() {
  const theme = useTheme();
  const [inputNumero, setInputNumero] = useState('');
  const [inputCliente, setInputCliente] = useState('');

  const debouncedNumero = useDebounce(inputNumero, 500);
  const debouncedCliente = useDebounce(inputCliente, 500);

  const { data, isLoading, isError, refetch } = useQuery<IOrcamento[], Error>({
    queryKey: ['orcamentos', { numero: debouncedNumero, cliente: debouncedCliente }],
    queryFn: async () => {
      if (debouncedNumero && debouncedNumero.trim().length > 0) {
        const id = Number(debouncedNumero);
        if (!Number.isNaN(id)) {
          try {
            const orc = await orcamentoService.getById(id);
            return orc ? [orc] : [];
          } catch {
            return [];
          }
        }
        return [];
      }
      return orcamentoService.getAll();
    },
    staleTime: 60 * 1000,
  });

  const orcamentosFiltrados = useMemo(() => {
    let list = data || [];
    if (debouncedCliente) {
      const term = debouncedCliente.toLowerCase();
      list = list.filter((orc) => (orc.nomeCliente || '').toLowerCase().includes(term));
    }
    return [...list].sort((a, b) => (b.id || 0) - (a.id || 0));
  }, [data, debouncedCliente]);

  const stats = useMemo(() => {
    const total = orcamentosFiltrados.length;
    const abertos = orcamentosFiltrados.filter((o) => !o.isPayed).length;
    const concluidos = orcamentosFiltrados.filter((o) => o.isPayed).length;
    const valorTotal = orcamentosFiltrados.reduce(
      (acc, o) => acc + (o.precoVendaComDesconto || o.precoVendaTotal || 0),
      0
    );
    return { total, abertos, concluidos, valorTotal };
  }, [orcamentosFiltrados]);

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const renderItem = ({ item }: { item: IOrcamento }) => (
    <Card style={styles.card} onPress={() => router.push(`/orcamento/${item.id}`)}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium">Orçamento #{item.id}</Text>
          <Chip
            style={[
              styles.statusChip,
              { backgroundColor: item.isPayed ? '#E8F5E9' : '#FFF3E0' },
            ]}
            textStyle={{ color: item.isPayed ? '#2E7D32' : '#EF6C00' }}
          >
            {item.isPayed ? 'Concluído' : 'Em Aberto'}
          </Chip>
        </View>
        <Text style={styles.clientName}>{item.nomeCliente || 'Cliente não informado'}</Text>
        <View style={styles.cardRow}>
          <Text style={styles.metaText}>Valor:</Text>
          <Text style={styles.metaValue}>
            {formatCurrency(item.precoVendaComDesconto || item.precoVendaTotal || 0)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Orçamentos
        </Text>
        <Button mode="contained" onPress={() => router.push('/orcamento/nova')}>
          Novo Orçamento
        </Button>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Em Aberto</Text>
            <Text style={styles.statValue}>{stats.abertos}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Concluídos</Text>
            <Text style={styles.statValue}>{stats.concluidos}</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.totalCard}>
        <Card.Content>
          <Text style={styles.statLabel}>Valor Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(stats.valorTotal)}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.filterCard}>
        <Card.Content>
          <TextInput
            label="Número do Orçamento"
            value={inputNumero}
            onChangeText={setInputNumero}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Nome do Cliente"
            value={inputCliente}
            onChangeText={setInputCliente}
            mode="outlined"
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator />
          <Text style={styles.helperText}>Carregando orçamentos...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Erro ao carregar orçamentos</Text>
          <Button mode="outlined" onPress={() => refetch()}>
            Tentar novamente
          </Button>
        </View>
      ) : (
        <FlatList
          data={orcamentosFiltrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text style={styles.helperText}>Nenhum orçamento encontrado</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalCard: {
    marginBottom: 12,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  filterCard: {
    marginBottom: 12,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    opacity: 0.7,
  },
  metaValue: {
    fontWeight: '600',
  },
  centerContent: {
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  helperText: {
    opacity: 0.7,
  },
  errorText: {
    color: '#B00020',
    marginBottom: 8,
  },
});
