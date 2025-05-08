import React from 'react';
import { TextInput, StyleSheet, View, type TextInputProps } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor'; // Para cores de fundo/borda

interface StyledTextInputProps extends TextInputProps {
  // Adicionar props customizadas se necessário, ex: error state
  hasError?: boolean;
}

export const StyledTextInput: React.FC<StyledTextInputProps> = ({ style, hasError, ...props }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const textColor = useThemeColor({}, 'text');
  const borderColor = hasError ? 'red' : useThemeColor({}, 'icon'); // Usa cor de ícone para borda normal
  const backgroundColor = useThemeColor({ light: 'rgba(0,0,0,0.02)', dark: 'rgba(255,255,255,0.05)' }, 'background'); // Fundo sutil

  return (
    <View style={[
        styles.inputContainer,
        { borderColor: borderColor, backgroundColor: backgroundColor },
        hasError ? styles.errorBorder : null
    ]}>
      <TextInput
        style={[styles.textInput, { color: textColor }, style]}
        placeholderTextColor={colors.icon} // Cor do placeholder
        {...props} // Passa todas as outras props para o TextInput original
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1.5, // Borda um pouco mais visível
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10, // Espaçamento abaixo do input
  },
  textInput: {
    minHeight: 48,
    fontSize: 16,
    paddingVertical: 12,
  },
   errorBorder: {
      borderColor: 'red',
  }
});