import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, FAB, Searchbar, Text, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { useAprs } from '../../src/hooks/useAprs';
import { IApr } from '../../src/types';

// Tela de listagem de APRs com filtro simples
export default function AprsScreen() {
  const theme = useTheme();
  const { aprs, isLoading, refetch } = useAprs();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Refresh manual via pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Normaliza data ISO para dd/mm/aaaa
  const formatDate = (value?: string | Date) => {
    if (!value) return 'Sem data';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Sem data';
    return date.toLocaleDateString('pt-BR');
  };

  // Busca rÃ¡pida por tÃ­tulo, local ou ID
  const filteredAprs = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    const list = aprs.filter((apr) => {
      const titulo = (apr.titulo || '').toLowerCase();
      const idMatch = apr.id?.toString().includes(term);
      const local = getLocalFromJson(apr).toLowerCase();
      return !term || titulo.includes(term) || local.includes(term) || Boolean(idMatch);
    });
    return [...list].sort((a, b) => (b.id || 0) - (a.id || 0));
  }, [aprs, searchQuery]);

  // Renderiza card individual
  const renderItem = ({ item }: { item: IApr }) => (
    <Card style={styles.card} onPress={() => router.push(`/apr/${item.id}`)}>
      <Card.Content>
        <Text variant="titleMedium">APR #{item.id}</Text>
        <Text style={styles.subtitle}>{item.titulo || 'APR sem tÃ­tulo'}</Text>
        <Text style={styles.metaText}>Local: {getLocalFromJson(item) || 'NÃ£o informado'}</Text>
        <Text style={styles.metaText}>Data: {formatDate(item.data)}</Text>
      </Card.Content>
    </Card>
  );

  if (isLoading && aprs.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando APRs...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Buscar por tÃ­tulo, local ou nÃºmero..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        elevation={1}
      />

      <FlatList
        data={filteredAprs}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyTitle}>
              Nenhuma APR encontrada
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Tente ajustar o filtro' : 'Crie uma nova APR usando o botÃ£o +'}
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push('/apr/nova')}
      />
    </View>
  );
}

// Extrai local/setor do JSON salvo
const getLocalFromJson = (apr: IApr): string => {
  if (!apr.conteudoJson) return '';
  try {
    const parsed = JSON.parse(apr.conteudoJson) as { localSetor?: string };
    return parsed.localSetor || '';
  } catch {
    return '';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    marginTop: 8,
  },
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 12,
  },
  subtitle: {
    marginTop: 4,
    fontWeight: '600',
  },
  metaText: {
    marginTop: 2,
    opacity: 0.7,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
