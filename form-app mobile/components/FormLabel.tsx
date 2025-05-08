import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface FormLabelProps {
  label: string;
  isRequired?: boolean;
  style?: object; // Allow passing extra styles
}

export const FormLabel: React.FC<FormLabelProps> = ({ label, isRequired, style }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Text style={[styles.labelBase, { color: colors.tint }, style]}>
      {label}
      {isRequired && <Text style={styles.requiredIndicator}> *</Text>}
    </Text>
  );
};

const styles = StyleSheet.create({
  labelBase: {
    fontSize: 16,
    fontWeight: '600', // SemiBold
    marginBottom: 8,
  },
  requiredIndicator: {
    color: 'red',
    fontWeight: 'bold',
  },
});