import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { FAB, Searchbar, Text, ActivityIndicator, useTheme, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { useSolicitacoes } from '../../src/hooks/useSolicitacoes';
import { SolicitacaoCard } from '../../src/components/SolicitacaoCard';
import { StatusSolicitacao, ISolicitacaoServico } from '../../src/types';

export default function SolicitacoesScreen() {
  const theme = useTheme();
  const { solicitacoes, isLoading, refetch } = useSolicitacoes();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Filtrar solicitações
  const filteredSolicitacoes = solicitacoes.filter((sol: ISolicitacaoServico) => {
    const matchesSearch = 
      sol.nomeCliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sol.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sol.id.toString().includes(searchQuery);
    
    const matchesStatus = selectedStatus === null || sol.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Contadores por status
  const counts = {
    total: solicitacoes.length,
    pendente: solicitacoes.filter((s: ISolicitacaoServico) => s.status === StatusSolicitacao.Pendente).length,
    aceita: solicitacoes.filter((s: ISolicitacaoServico) => s.status === StatusSolicitacao.Aceita).length,
    concluida: solicitacoes.filter((s: ISolicitacaoServico) => s.status === StatusSolicitacao.Concluida).length,
  };

  if (isLoading && solicitacoes.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando solicitações...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Buscar por cliente, descrição ou número..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        elevation={1}
      />

      {/* Status Filters */}
      <View style={styles.filtersContainer}>
        <Chip
          selected={selectedStatus === null}
          onPress={() => setSelectedStatus(null)}
          style={styles.filterChip}
        >
          Todas ({counts.total})
        </Chip>
        <Chip
          selected={selectedStatus === StatusSolicitacao.Pendente}
          onPress={() => setSelectedStatus(selectedStatus === StatusSolicitacao.Pendente ? null : StatusSolicitacao.Pendente)}
          style={styles.filterChip}
        >
          Pendentes ({counts.pendente})
        </Chip>
        <Chip
          selected={selectedStatus === StatusSolicitacao.Aceita}
          onPress={() => setSelectedStatus(selectedStatus === StatusSolicitacao.Aceita ? null : StatusSolicitacao.Aceita)}
          style={styles.filterChip}
        >
          Aceitas ({counts.aceita})
        </Chip>
        <Chip
          selected={selectedStatus === StatusSolicitacao.Concluida}
          onPress={() => setSelectedStatus(selectedStatus === StatusSolicitacao.Concluida ? null : StatusSolicitacao.Concluida)}
          style={styles.filterChip}
        >
          Concluídas ({counts.concluida})
        </Chip>
      </View>

      {/* Lista de Solicitações */}
      <FlatList
        data={filteredSolicitacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SolicitacaoCard
            solicitacao={item}
            onPress={() => router.push(`/solicitacao/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyTitle}>
              Nenhuma solicitação encontrada
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              {searchQuery || selectedStatus !== null
                ? 'Tente ajustar os filtros'
                : 'Crie uma nova solicitação usando o botão +'}
            </Text>
          </View>
        }
      />

      {/* FAB para nova solicitação */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push('/solicitacao/nova')}
      />
    </View>
  );
}

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
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 100,
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
