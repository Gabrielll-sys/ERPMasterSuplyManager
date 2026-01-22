import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lightTheme } from '../src/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30 * 1000,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={lightTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="solicitacao/[id]" 
            options={{ 
              presentation: 'modal',
              headerShown: true,
              title: 'Detalhes da Solicitação' 
            }} 
          />
          <Stack.Screen 
            name="solicitacao/nova" 
            options={{ 
              presentation: 'modal',
              headerShown: true,
              title: 'Nova Solicitação' 
            }} 
          />
        </Stack>
      </PaperProvider>
    </QueryClientProvider>
  );
}
