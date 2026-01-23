import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as SecureStore from 'expo-secure-store';
import AprForm from '../../src/components/AprForm';
import { useApr, useAprs } from '../../src/hooks/useAprs';
import { IApr } from '../../src/types';
import { API_BASE_URL } from '../../src/api/client';

// Tela de ediÃ§Ã£o/detalhe de APR
export default function AprDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const aprId = Number(id);
  const { data: apr, isLoading, isError, refetch } = useApr(aprId);
  const { updateApr, isSaving } = useAprs();
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Handler de atualizaÃ§Ã£o com feedback simples
  const handleSave = async (payload: IApr) => {
    setError('');
    try {
      await updateApr(payload);
      await refetch();
    } catch (err: any) {
      setError(err?.response?.data || 'Erro ao atualizar APR');
    }
  };

  // Gera o PDF da APR e abre o compartilhamento no dispositivo.
  const handleDownloadPdf = async () => {
    if (!aprId) return;
    setError('');
    try {
      setIsDownloading(true);
      const token = await SecureStore.getItemAsync('authToken');
      const pdfUrl = `${API_BASE_URL}/Aprs/${aprId}/pdf`;
      const fileUri = `${FileSystem.cacheDirectory}apr-${aprId}.pdf`;

      const download = await FileSystem.downloadAsync(pdfUrl, fileUri, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(download.uri);
      } else {
        setError('PDF gerado, mas o compartilhamento n\u00e3o est\u00e1 dispon\u00edvel.');
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao gerar PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.helperText}>Carregando APR...</Text>
      </View>
    );
  }

  if (isError || !apr) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>NÃ£o foi possÃ­vel carregar a APR</Text>
        <Button mode="outlined" onPress={() => refetch()}>
          Tentar novamente
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.pdfButtonWrapper}>
        <Button mode="outlined" onPress={handleDownloadPdf} loading={isDownloading} disabled={isDownloading}>
          {isDownloading ? 'Gerando PDF...' : 'Baixar PDF'}
        </Button>
      </View>
      <AprForm apr={apr} onSave={handleSave} saving={isSaving} />
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
    gap: 12,
  },
  helperText: {
    opacity: 0.7,
  },
  errorText: {
    color: '#B00020',
    marginHorizontal: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  pdfButtonWrapper: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
});
