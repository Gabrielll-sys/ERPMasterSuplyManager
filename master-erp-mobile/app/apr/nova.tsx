import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import AprForm from '../../src/components/AprForm';
import { useAprs } from '../../src/hooks/useAprs';
import { IApr } from '../../src/types';

// Tela para criar uma nova APR
export default function NovaAprScreen() {
  const { createApr, isSaving } = useAprs();
  const [error, setError] = useState('');

  // Handler de criaÃ§Ã£o com feedback bÃ¡sico de erro
  const handleSave = async (payload: IApr) => {
    setError('');
    try {
      const data = await createApr(payload);
      if (data?.id) {
        router.replace(`/apr/${data.id}`);
      }
    } catch (err: any) {
      setError(err?.response?.data || 'Erro ao criar APR');
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <AprForm onSave={handleSave} saving={isSaving} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    color: '#B00020',
    marginHorizontal: 16,
    marginTop: 12,
  },
});
