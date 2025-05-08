import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SectionCardProps extends PropsWithChildren {
  title?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const cardBackground = useThemeColor({ light: '#ffffff', dark: Colors.dark.background }, 'background');
  const shadowColor = colorScheme === 'light' ? '#000' : '#fff'; // Sombra preta no claro, branca no escuro (sutil)
  const titleColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: 'rgba(0,0,0,0.1)', dark: 'rgba(255,255,255,0.2)'}, 'icon');


  return (
    <View style={[
        styles.card,
        { backgroundColor: cardBackground, shadowColor: shadowColor, borderColor: borderColor }
    ]}>
      {title && (
        <ThemedText type="subtitle" style={[styles.title, { color: titleColor, borderBottomColor: borderColor }]}>
          {title}
        </ThemedText>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 25,
    padding: 18,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth, // Borda muito fina
    // Sombras (ajustar conforme necessário para a plataforma)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Para Android
  },
  title: {
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 18,
    fontWeight: 'bold',
  },
});