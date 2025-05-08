// Localização: app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab'; // Componente para feedback tátil (opcional)
import { IconSymbol } from '@/components/ui/IconSymbol'; // Componente de Ícone (SF Symbols/Material Icons)
import TabBarBackground from '@/components/ui/TabBarBackground'; // Fundo customizado da barra de abas (opcional)
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Importar ícones específicos se não usar IconSymbol ou precisar de outros
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false, // Geralmente os headers são definidos nas telas individuais com <Stack.Screen>
        tabBarButton: HapticTab, // Botão customizado com feedback tátil
        tabBarBackground: TabBarBackground, // Fundo com blur no iOS
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // Necessário para o efeito de blur no iOS
          },
          default: {
             backgroundColor: Colors[colorScheme ?? 'light'].background, // Fundo sólido para Android/Web
             borderTopColor: Colors[colorScheme ?? 'light'].icon === Colors.light.icon ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)', // Linha superior sutil
             borderTopWidth: StyleSheet.hairlineWidth,
          },
        }),
      }}>

      {/* 1. ABA INICIAL: Formulários */}
      <Tabs.Screen
        // O nome DEVE corresponder ao caminho do ficheiro relativo a esta pasta (tabs)
        // Se o seu ficheiro está em app/(tabs)/forms/index.tsx, o nome correto é "forms/index"
        name="forms/index"
        options={{
          title: 'Formulários',
          // Verifique se 'pencil.and.list.clipboard' está mapeado em components/ui/IconSymbol.tsx
          // ou use um ícone MaterialIcons como fallback.
          tabBarIcon: ({ color, focused }) => (
              <IconSymbol
                  size={28}
                  name="pencil.and.list.clipboard" // Exemplo SF Symbol
                  color={color}
                  weight={focused ? 'bold' : 'regular'} // Exemplo de peso diferente para aba focada
              />
          ),
          // Exemplo com MaterialIcons:
          // tabBarIcon: ({ color }) => <MaterialIcons name="description" size={28} color={color} />,
        }}
      />

      {/* 2. ABA: Home (Antiga inicial) */}
      <Tabs.Screen
        // O nome corresponde a app/(tabs)/index.tsx
        name="index"
        options={{
          title: 'Home',
           tabBarIcon: ({ color, focused }) => (
              <IconSymbol
                  size={28}
                  name="house.fill"
                  color={color}
                  weight={focused ? 'bold' : 'regular'}
              />
           ),
        }}
      />

      {/* 3. ABA: Explore */}
      <Tabs.Screen
         // O nome corresponde a app/(tabs)/explore.tsx
        name="explore"
        options={{
          title: 'Explore',
           tabBarIcon: ({ color, focused }) => (
              <IconSymbol
                  size={28}
                  name="paperplane.fill"
                  color={color}
                  weight={focused ? 'bold' : 'regular'}
              />
           ),
        }}
      />

      {/* Adicione outras abas aqui, se houver */}

    </Tabs>
  );
}

// Adicionar StyleSheet se precisar de estilos específicos para a TabBar no Android/Web
import { StyleSheet } from 'react-native';
