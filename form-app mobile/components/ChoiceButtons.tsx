import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ChoiceOption {
  label: string;
  value: string;
}

interface ChoiceButtonsProps {
  options: ChoiceOption[];
  selectedValue: string | null | undefined;
  onSelect: (value: string) => void;
  layout?: 'horizontal' | 'vertical'; // Layout dos botões
}

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({
  options,
  selectedValue,
  onSelect,
  layout = 'horizontal',
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Cores específicas para seleção (pode personalizar mais)
  const selectedBackgroundColor = colors.tint;
  const selectedTextColor = colorScheme === 'light' ? '#FFFFFF' : Colors.dark.background; // Branco no claro, Fundo no escuro
  const defaultBackgroundColor = colors.background;
  const defaultTextColor = colors.text;
  const defaultBorderColor = colors.icon;

  return (
    <View style={[
        styles.container,
        layout === 'vertical' ? styles.containerVertical : styles.containerHorizontal
    ]}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <Pressable
            key={option.value}
            style={[
              styles.button,
              {
                borderColor: isSelected ? selectedBackgroundColor : defaultBorderColor,
                backgroundColor: isSelected ? selectedBackgroundColor : defaultBackgroundColor,
              },
              layout === 'vertical' ? styles.buttonVertical : styles.buttonHorizontal
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[
                styles.buttonText,
                { color: isSelected ? selectedTextColor : defaultTextColor }
            ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Padrão horizontal
    flexWrap: 'wrap', // Permite quebrar linha se não couber
    marginBottom: 10,
  },
  containerHorizontal: {
    justifyContent: 'flex-start',
    gap: 10,
  },
  containerVertical: {
    flexDirection: 'column',
    alignItems: 'stretch', // Faz botões ocuparem largura
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHorizontal: {
    // Estilos específicos para horizontal se necessário
  },
  buttonVertical: {
    // Estilos específicos para vertical se necessário
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600', // SemiBold
  },
});