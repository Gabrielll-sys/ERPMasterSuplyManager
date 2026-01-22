import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ISolicitacaoServico, getStatusLabel, getStatusColor } from '../types';

interface SolicitacaoCardProps {
  solicitacao: ISolicitacaoServico;
  onPress?: () => void;
}

export function SolicitacaoCard({ solicitacao, onPress }: SolicitacaoCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return '-';
    }
  };

  const statusColor = getStatusColor(solicitacao.status);
  const statusLabel = getStatusLabel(solicitacao.status);

  return (
    <Card style={styles.card} onPress={onPress} mode="elevated">
      <Card.Content>
        {/* Header com status e número */}
        <View style={styles.header}>
          <Chip
            mode="flat"
            style={[styles.statusChip, { backgroundColor: statusColor + '20' }]}
            textStyle={{ color: statusColor, fontWeight: '600' }}
          >
            {statusLabel}
          </Chip>
          <Text variant="bodySmall" style={styles.idText}>
            #{solicitacao.id.toString().padStart(4, '0')}
          </Text>
        </View>

        {/* Nome do cliente */}
        <Text variant="titleMedium" style={styles.clientName}>
          {solicitacao.nomeCliente}
        </Text>

        {/* Descrição */}
        <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
          {solicitacao.descricao}
        </Text>

        {/* Usuários Designados */}
        {solicitacao.usuariosDesignados && (
          <View style={styles.designatedUsers}>
            <Text variant="bodySmall" style={styles.designatedLabel}>
              👥 Responsáveis: {solicitacao.usuariosDesignados}
            </Text>
          </View>
        )}

        {/* Footer com data e usuário */}
        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.dateText}>
            📅 {formatDate(solicitacao.dataSolicitacao)}
          </Text>
          {solicitacao.usuarioAceite && (
            <Text variant="bodySmall" style={styles.userText}>
              👤 {solicitacao.usuarioAceite}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
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
  idText: {
    color: '#757575',
    fontFamily: 'monospace',
  },
  clientName: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#212121',
  },
  description: {
    color: '#616161',
    marginBottom: 12,
    lineHeight: 20,
  },
  designatedUsers: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  designatedLabel: {
    color: '#1976D2',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateText: {
    color: '#757575',
  },
  userText: {
    color: '#1E88E5',
    fontWeight: '500',
  },
});
