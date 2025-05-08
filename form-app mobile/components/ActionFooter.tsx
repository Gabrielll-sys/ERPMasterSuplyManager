import React from 'react';
import { View, Button, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ActionFooterProps {
  onSaveDraft: () => void;
  onSubmit: () => void;
  isSaving: boolean;
  submitText?: string;
  draftText?: string;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({
  onSaveDraft,
  onSubmit,
  isSaving,
  submitText = "Finalizar e Enviar",
  draftText = "Salvar Rascunho",
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ThemedView style={[styles.footer, { borderTopColor: colors.icon, backgroundColor: colors.background }]}>
      <View style={styles.buttonWrapper}>
        <Button
          title={draftText}
          onPress={onSaveDraft}
          disabled={isSaving}
          color={Platform.OS === 'ios' ? colors.tint : colors.icon} // Cor secundária para rascunho
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          title={submitText}
          onPress={onSubmit}
          disabled={isSaving}
          color={colors.tint} // Cor primária para submeter
        />
      </View>
      {isSaving && <ActivityIndicator style={styles.savingIndicator} size="small" color={colors.tint} />}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12, // Mais padding no iOS
    paddingHorizontal: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  savingIndicator: {
    position: 'absolute', // Coloca sobre os botões se necessário
    right: 20, // Ajuste a posição conforme necessário
  },
});