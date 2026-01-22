import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, ActivityIndicator, Divider, useTheme, Portal, Dialog, Checkbox } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSolicitacao, useSolicitacoes } from '../../src/hooks/useSolicitacoes';
import { useAuth } from '../../src/hooks/useAuth';
import { StatusChip } from '../../src/components/StatusChip';
import { UserSelectModal } from '../../src/components/UserSelectModal';
import { StatusSolicitacao } from '../../src/types';
import { canEditSolicitacao, canDeleteSolicitacao } from '../../src/utils/permissions';

export default function SolicitacaoDetalhesScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { data: solicitacao, isLoading } = useSolicitacao(Number(id));
  const { aceitarSolicitacao, concluirSolicitacao, deleteSolicitacao } = useSolicitacoes();
  
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showConcluirModal, setShowConcluirModal] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return '-';
    }
  };

  const handleAceitar = async () => {
    if (!solicitacao) return;
    
    Alert.alert(
      'Aceitar Solicitação',
      'Deseja aceitar esta solicitação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceitar',
          onPress: async () => {
            setIsActionLoading(true);
            try {
              await aceitarSolicitacao(solicitacao.id);
              Alert.alert('Sucesso', 'Solicitação aceita!');
              router.back();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível aceitar a solicitação');
            } finally {
              setIsActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDelete = async () => {
    if (!solicitacao) return;
    
    setShowDeleteDialog(false);
    setIsActionLoading(true);
    
    try {
      await deleteSolicitacao(solicitacao.id);
      Alert.alert('Sucesso', 'Solicitação excluída!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a solicitação');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConcluir = async (usuarios: string[]) => {
    if (!solicitacao) return;
    
    setShowConcluirModal(false);
    setIsActionLoading(true);
    
    try {
      await concluirSolicitacao({ id: solicitacao.id, payload: { usuarios } });
      Alert.alert('Sucesso', 'Solicitação concluída!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível concluir a solicitação');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading || !solicitacao) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const canEdit = canEditSolicitacao(user?.role);
  const canDelete = canDeleteSolicitacao(user?.role);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Header com Status e ID */}
        <View style={styles.header}>
          <StatusChip status={solicitacao.status} size="medium" />
          <Text variant="bodyLarge" style={styles.idText}>
            Solicitação #{solicitacao.id.toString().padStart(4, '0')}
          </Text>
        </View>

        {/* Cliente */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={styles.label}>
            Cliente
          </Text>
          <Text variant="titleLarge" style={styles.clientName}>
            {solicitacao.nomeCliente}
          </Text>
        </View>

        <Divider />

        {/* Descrição */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={styles.label}>
            Descrição do Serviço
          </Text>
          <Text variant="bodyLarge" style={styles.description}>
            {solicitacao.descricao}
          </Text>
        </View>

        <Divider />

        {/* Usuários Designados (se houver) */}
        {solicitacao.usuariosDesignados && (
          <>
            <View style={styles.section}>
              <Text variant="labelLarge" style={styles.label}>
                Usuários Responsáveis Designados
              </Text>
              <View style={styles.designatedContainer}>
                <Text variant="bodyLarge" style={styles.designatedText}>
                  👥 {solicitacao.usuariosDesignados}
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.helperText}>
                Estes usuários foram escolhidos para realizar este serviço
              </Text>
            </View>
            <Divider />
          </>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.timelineTitle}>
            Histórico
          </Text>

          {/* Criação */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: theme.colors.outline }]} />
            <View style={styles.timelineContent}>
              <Text variant="labelLarge">Solicitação Criada</Text>
              <Text variant="bodySmall" style={styles.timelineDate}>
                📅 {formatDate(solicitacao.dataSolicitacao)}
              </Text>
            </View>
          </View>

          {/* Aceite */}
          {solicitacao.status >= StatusSolicitacao.Aceita && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#42A5F5' }]} />
              <View style={styles.timelineContent}>
                <Text variant="labelLarge">Aceita</Text>
                <Text variant="bodySmall" style={styles.timelineDate}>
                  👤 {solicitacao.usuarioAceite}
                </Text>
                <Text variant="bodySmall" style={styles.timelineDate}>
                  📅 {formatDate(solicitacao.dataAceite ?? undefined)}
                </Text>
              </View>
            </View>
          )}

          {/* Conclusão */}
          {solicitacao.status === StatusSolicitacao.Concluida && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#66BB6A' }]} />
              <View style={styles.timelineContent}>
                <Text variant="labelLarge">Concluída</Text>
                <Text variant="bodySmall" style={styles.timelineDate}>
                  📅 {formatDate(solicitacao.dataConclusao ?? undefined)}
                </Text>
                {solicitacao.usuariosConclusao && (
                  <Text variant="bodySmall" style={styles.timelineDate}>
                    👥 {solicitacao.usuariosConclusao}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Ações */}
        <View style={styles.actionsContainer}>
          {solicitacao.status === StatusSolicitacao.Pendente && (
            <Button
              mode="contained"
              onPress={handleAceitar}
              loading={isActionLoading}
              disabled={isActionLoading}
              style={styles.actionButton}
            >
              Aceitar Solicitação
            </Button>
          )}

          {solicitacao.status === StatusSolicitacao.Aceita && (
            <Button
              mode="contained"
              onPress={() => setShowConcluirModal(true)}
              loading={isActionLoading}
              disabled={isActionLoading}
              style={styles.actionButton}
              buttonColor={theme.colors.tertiary}
            >
              Concluir Solicitação
            </Button>
          )}

          {canDelete && (
            <Button
              mode="outlined"
              onPress={() => setShowDeleteDialog(true)}
              disabled={isActionLoading}
              buttonColor={theme.colors.errorContainer}
              textColor={theme.colors.error}
              style={styles.actionButton}
            >
              Excluir
            </Button>
          )}
        </View>
      </View>

      {/* Modal de seleção de usuários para conclusão */}
      <UserSelectModal
        visible={showConcluirModal}
        onDismiss={() => setShowConcluirModal(false)}
        onConfirm={handleConcluir}
        isLoading={isActionLoading}
      />

      {/* Dialog de confirmação de exclusão */}
      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>Confirmar Exclusão</Dialog.Title>
          <Dialog.Content>
            <Text>Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button onPress={handleDelete} textColor={theme.colors.error}>Excluir</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  idText: {
    fontFamily: 'monospace',
    opacity: 0.7,
  },
  section: {
    paddingVertical: 16,
  },
  label: {
    opacity: 0.7,
    marginBottom: 8,
  },
  clientName: {
    fontWeight: '600',
  },
  description: {
    lineHeight: 24,
  },
  designatedContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  designatedText: {
    color: '#1976D2',
    fontWeight: '500',
  },
  helperText: {
    marginTop: 8,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  timelineTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
    gap: 4,
  },
  timelineDate: {
    opacity: 0.7,
  },
  actionsContainer: {
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    borderRadius: 8,
  },
});
