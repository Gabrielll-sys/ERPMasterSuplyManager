import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme, IconButton } from 'react-native-paper';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.surfaceVariant,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="solicitacoes"
        options={{
          title: 'SolicitaÃ§Ãµes',
          tabBarLabel: 'SolicitaÃ§Ãµes',
          tabBarIcon: ({ color }) => <IconButton icon="clipboard-list" iconColor={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="orcamentos"
        options={{
          title: 'OrÃ§amentos',
          tabBarLabel: 'OrÃ§amentos',
          tabBarIcon: ({ color }) => <IconButton icon="file-document" iconColor={color} size={20} />,
        }}
      />
      {/* Aba de APR */}
      <Tabs.Screen
        name="apr"
        options={{
          title: 'APR',
          tabBarLabel: 'APR',
          tabBarIcon: ({ color }) => <IconButton icon="clipboard-text" iconColor={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <IconButton icon="account" iconColor={color} size={20} />,
        }}
      />
    </Tabs>
  );
}
