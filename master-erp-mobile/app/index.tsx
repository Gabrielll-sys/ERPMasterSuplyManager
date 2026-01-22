import { Redirect } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Redireciona baseado no estado de autenticação
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/solicitacoes" />;
  }

  return <Redirect href="/(auth)/login" />;
}
