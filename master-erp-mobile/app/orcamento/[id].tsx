import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Button,
  ActivityIndicator,
  Divider,
  useTheme,
  Surface,
  TextInput,
  Card,
  Chip,
  Portal,
  Dialog,
  HelperText,
  Snackbar,
} from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import * as SecureStore from 'expo-secure-store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../src/hooks/useAuth';
import { useOrcamento } from '../../src/hooks/useOrcamentos';
import { itensOrcamentoService } from '../../src/api/itens-orcamento.service';
import { materialService } from '../../src/api/material.service';
import { orcamentoService } from '../../src/api/orcamento.service';
import { IInventario, IItemOrcamento, IOrcamento } from '../../src/types';
import { API_BASE_URL } from '../../src/api/client';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function OrcamentoDetalhesScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orcamentoId = Number(id);
  const queryClient = useQueryClient();

  const { data: orcamento, isLoading: isLoadingOrcamento } = useOrcamento(orcamentoId);
  const { data: materiais = [], isLoading: isLoadingMateriais } = useQuery({
    queryKey: ['materiaisOrcamento', orcamentoId],
    queryFn: () => itensOrcamentoService.getMateriaisByOrcamentoId(orcamentoId),
    enabled: !!orcamentoId,
    placeholderData: [],
    staleTime: 0,
  });

  const [formState, setFormState] = useState({
    nomeCliente: '',
    endereco: '',
    emailCliente: '',
    cpfOrCnpj: '',
    telefone: '',
    observacoes: '',
    metodoPagamento: 'Cartão de Crédito',
    desconto: '0',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [searchResults, setSearchResults] = useState<IInventario[]>([]);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<IItemOrcamento | null>(null);
  const [currentInventario, setCurrentInventario] = useState<IInventario | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [confirmAuthorize, setConfirmAuthorize] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarIsError, setSnackbarIsError] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orcamento) {
      setFormState({
        nomeCliente: orcamento.nomeCliente || '',
        endereco: orcamento.endereco || '',
        emailCliente: orcamento.emailCliente || '',
        cpfOrCnpj: orcamento.cpfOrCnpj || '',
        telefone: orcamento.telefone || '',
        observacoes: orcamento.observacoes || '',
        metodoPagamento: orcamento.tipoPagamento || 'PIX',
        desconto: orcamento.desconto?.toString() || '0',
      });
    }
  }, [orcamento]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (debouncedSearch.trim().length < 3) {
        setSearchResults([]);
        return;
      }
      try {
        const results = await materialService.searchByDescription(debouncedSearch.trim());
        setSearchResults(results || []);
      } catch {
        setSearchResults([]);
      }
    };
    fetchSearch();
  }, [debouncedSearch]);

  const updateMutation = useMutation({
    mutationFn: (payload: IOrcamento) => orcamentoService.update(payload),
    onSuccess: () => {
      showSnackbar('Orçamento atualizado!');
      queryClient.invalidateQueries({ queryKey: ['orcamento', orcamentoId] });
    },
    onError: (err: any) => {
      showSnackbar(err?.message || 'Erro ao atualizar orçamento', true);
    },
  });

  const authorizeMutation = useMutation({
    mutationFn: (payload: IOrcamento) => orcamentoService.authorize(payload),
    onSuccess: () => {
      showSnackbar('Orçamento autorizado!');
      queryClient.invalidateQueries({ queryKey: ['orcamento', orcamentoId] });
      queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
    },
    onError: (err: any) => {
      showSnackbar(err?.message || 'Erro ao autorizar orçamento', true);
    },
  });

  const addItemMutation = useMutation({
    mutationFn: itensOrcamentoService.createItemOrcamento,
    onSuccess: () => {
      showSnackbar('Material adicionado!');
      queryClient.invalidateQueries({ queryKey: ['materiaisOrcamento', orcamentoId] });
      setShowQuantityDialog(false);
    },
    onError: (err: any) => {
      showSnackbar(err?.message || 'Erro ao adicionar material', true);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: itensOrcamentoService.updateItemOrcamento,
    onSuccess: () => {
      showSnackbar('Quantidade atualizada!');
      queryClient.invalidateQueries({ queryKey: ['materiaisOrcamento', orcamentoId] });
      setShowQuantityDialog(false);
    },
    onError: (err: any) => {
      showSnackbar(err?.message || 'Erro ao atualizar material', true);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: itensOrcamentoService.deleteItemOrcamento,
    onSuccess: () => {
      showSnackbar('Material removido!');
      queryClient.invalidateQueries({ queryKey: ['materiaisOrcamento', orcamentoId] });
    },
    onError: (err: any) => {
      showSnackbar(err?.message || 'Erro ao remover material', true);
    },
  });

  const showSnackbar = (message: string, isError = false) => {
    setSnackbarMessage(message);
    setSnackbarIsError(isError);
    setSnackbarVisible(true);
  };

  const subtotal = useMemo(() => {
    return materiais.reduce((acc, item) => {
      const preco = Number(item.precoItemOrcamento ?? item.material?.precoVenda ?? 0);
      return acc + preco * Number(item.quantidadeMaterial || 0);
    }, 0);
  }, [materiais]);

  const descontoPercentual = useMemo(() => {
    return parseFloat(String(formState.desconto || '0').replace(',', '.')) || 0;
  }, [formState.desconto]);

  const totalComDesconto = useMemo(() => {
    const descontoValor = (subtotal * descontoPercentual) / 100;
    return subtotal - descontoValor;
  }, [subtotal, descontoPercentual]);

  const handleUpdateBudget = () => {
    if (!orcamento || updateMutation.isPending) return;
    if (!formState.nomeCliente.trim()) {
      setError('Nome do cliente é obrigatório');
      return;
    }

    const payload: IOrcamento = {
      ...orcamento,
      nomeCliente: formState.nomeCliente,
      endereco: formState.endereco,
      emailCliente: formState.emailCliente,
      cpfOrCnpj: formState.cpfOrCnpj,
      telefone: formState.telefone,
      observacoes: formState.observacoes,
      tipoPagamento: formState.metodoPagamento,
      desconto: parseFloat(formState.desconto.replace(',', '.')) || 0,
    };
    updateMutation.mutate(payload);
  };

  const handleOpenAddDialog = (inventario: IInventario) => {
    const exists = materiais.some((m) => m.material?.id === inventario.materialId);
    if (exists) {
      showSnackbar('Este material já está no orçamento.', true);
      return;
    }
    setCurrentInventario(inventario);
    setCurrentItem(null);
    setQuantity('1');
    setShowQuantityDialog(true);
  };

  const handleOpenEditDialog = (item: IItemOrcamento) => {
    setCurrentItem(item);
    setCurrentInventario(null);
    setQuantity(String(item.quantidadeMaterial));
    setShowQuantityDialog(true);
  };

  const handleConfirmQuantity = () => {
    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty < 1) return;
    if (currentItem) {
      updateItemMutation.mutate({ item: currentItem, novaQuantidade: qty });
      return;
    }
    if (currentInventario?.materialId) {
      addItemMutation.mutate({
        orcamentoId,
        materialId: currentInventario.materialId,
        quantidadeMaterial: qty,
        responsavelAdicao: user?.userName || 'Sistema',
      });
    }
  };

  const handleAuthorize = () => {
    if (!orcamento) return;
    if (confirmText !== 'AUTORIZAR') return;
    authorizeMutation.mutate({ ...orcamento });
    setConfirmAuthorize(false);
    setConfirmText('');
  };

  const handleGeneratePdf = async () => {
    if (!orcamentoId) return;
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const pdfUrl = `${API_BASE_URL}/Orcamentos/${orcamentoId}/pdf`;
      const fileUri = `${FileSystem.cacheDirectory}orcamento-${orcamentoId}.pdf`;

      const download = await FileSystem.downloadAsync(pdfUrl, fileUri, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(download.uri);
      } else {
        showSnackbar('PDF gerado, mas compartilhamento n?o est? dispon?vel.', true);
      }
    } catch (err: any) {
      showSnackbar(err?.message || 'Erro ao gerar PDF', true);
    }
  };

  if (isLoadingOrcamento || isLoadingMateriais || !orcamento) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.card} elevation={2}>
        <View style={styles.header}>
          <Text variant="titleLarge">Orçamento #{orcamento.id}</Text>
          <Chip
            style={[
              styles.statusChip,
              { backgroundColor: orcamento.isPayed ? '#E8F5E9' : '#FFF3E0' },
            ]}
            textStyle={{ color: orcamento.isPayed ? '#2E7D32' : '#EF6C00' }}
          >
            {orcamento.isPayed ? 'Concluído' : 'Em Aberto'}
          </Chip>
        </View>

        <TextInput
          label="Nome do Cliente *"
          value={formState.nomeCliente}
          onChangeText={(value) => {
            setFormState({ ...formState, nomeCliente: value });
            setError('');
          }}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Endereço"
          value={formState.endereco}
          onChangeText={(value) => setFormState({ ...formState, endereco: value })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={formState.emailCliente}
          onChangeText={(value) => setFormState({ ...formState, emailCliente: value })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="CPF/CNPJ"
          value={formState.cpfOrCnpj}
          onChangeText={(value) => setFormState({ ...formState, cpfOrCnpj: value })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Telefone"
          value={formState.telefone}
          onChangeText={(value) => setFormState({ ...formState, telefone: value })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Observações"
          value={formState.observacoes}
          onChangeText={(value) => setFormState({ ...formState, observacoes: value })}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />
        <TextInput
          label="Método de Pagamento"
          value={formState.metodoPagamento}
          onChangeText={(value) => setFormState({ ...formState, metodoPagamento: value })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Desconto (%)"
          value={formState.desconto}
          onChangeText={(value) => setFormState({ ...formState, desconto: value })}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        {error ? (
          <HelperText type="error" visible={true}>
            {error}
          </HelperText>
        ) : null}

        <Button mode="contained" onPress={handleUpdateBudget} loading={updateMutation.isPending}>
          Salvar Alterações
        </Button>
      </Surface>

      <Surface style={styles.card} elevation={2}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Materiais do Orçamento
        </Text>

        {!orcamento.isPayed && (
          <>
            <TextInput
              label="Buscar material"
              value={searchTerm}
              onChangeText={setSearchTerm}
              mode="outlined"
              style={styles.input}
            />
            {searchResults.length > 0 && (
              <View style={styles.searchResults}>
                {searchResults.map((inv) => (
                  <Button
                    key={inv.id}
                    mode="outlined"
                    style={styles.searchResult}
                    onPress={() => handleOpenAddDialog(inv)}
                  >
                    {inv.material?.descricao || 'Material'}
                  </Button>
                ))}
              </View>
            )}
          </>
        )}

        {materiais.length === 0 ? (
          <Text style={styles.helperText}>Nenhum material adicionado</Text>
        ) : (
          materiais.map((item) => (
            <Card key={item.id} style={styles.materialCard}>
              <Card.Content>
                <Text style={styles.materialTitle}>
                  {item.material?.descricao || 'Material'}
                </Text>
                <Text style={styles.materialMeta}>
                  Quantidade: {item.quantidadeMaterial}
                </Text>
                <Text style={styles.materialMeta}>
                  Preço: {(item.precoItemOrcamento ?? item.material?.precoVenda ?? 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
                {!orcamento.isPayed && (
                  <View style={styles.materialActions}>
                    <Button mode="outlined" onPress={() => handleOpenEditDialog(item)}>
                      Editar
                    </Button>
                    <Button mode="outlined" textColor={theme.colors.error} onPress={() => deleteItemMutation.mutate(item.id)}>
                      Remover
                    </Button>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))
        )}
      </Surface>

      <Surface style={styles.card} elevation={2}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Resumo
        </Text>
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Desconto</Text>
          <Text>{descontoPercentual}%</Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalLabel}>Total</Text>
          <Text style={styles.summaryTotalValue}>
            {totalComDesconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Text>
        </View>
      </Surface>

      <Surface style={styles.card} elevation={2}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Ações
        </Text>
        {!orcamento.isPayed ? (
          <Button mode="contained" onPress={() => setConfirmAuthorize(true)} loading={authorizeMutation.isPending}>
            Autorizar Orçamento
          </Button>
        ) : (
          <Text style={styles.helperText}>Orçamento autorizado</Text>
        )}
        <Button mode="outlined" style={{ marginTop: 8 }} onPress={handleGeneratePdf}>
          Gerar PDF
        </Button>
      </Surface>

      {/* Dialog para quantidade */}
      <Portal>
        <Dialog visible={showQuantityDialog} onDismiss={() => setShowQuantityDialog(false)}>
          <Dialog.Title>
            {currentItem ? 'Editar Quantidade' : 'Adicionar Material'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Quantidade"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowQuantityDialog(false)}>Cancelar</Button>
            <Button onPress={handleConfirmQuantity}>Confirmar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog de confirmação de autorização */}
      <Portal>
        <Dialog visible={confirmAuthorize} onDismiss={() => setConfirmAuthorize(false)}>
          <Dialog.Title>Confirmar Autorização</Dialog.Title>
          <Dialog.Content>
            <Text>Digite AUTORIZAR para confirmar.</Text>
            <TextInput
              value={confirmText}
              onChangeText={(value) => setConfirmText(value.toUpperCase())}
              mode="outlined"
              style={{ marginTop: 12 }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmAuthorize(false)}>Cancelar</Button>
            <Button onPress={handleAuthorize} disabled={confirmText !== 'AUTORIZAR'}>
              Confirmar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={snackbarIsError ? styles.snackbarError : undefined}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  searchResults: {
    gap: 8,
    marginBottom: 12,
  },
  searchResult: {
    borderRadius: 8,
  },
  materialCard: {
    marginBottom: 10,
  },
  materialTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  materialMeta: {
    opacity: 0.7,
  },
  materialActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryTotalLabel: {
    fontWeight: '700',
  },
  summaryTotalValue: {
    fontWeight: '700',
  },
  divider: {
    marginVertical: 8,
  },
  helperText: {
    opacity: 0.7,
  },
  snackbarError: {
    backgroundColor: '#B00020',
  },
});
