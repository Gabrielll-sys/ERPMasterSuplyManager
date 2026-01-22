import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Surface, Divider, Portal, Dialog, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../../src/hooks/useAuth';
import { userService } from '../../src/api/user.service';

export default function PerfilScreen() {
  const theme = useTheme();
  const { user, logout } = useAuth();
  
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    // Validações
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (novaSenha.length < 4) {
      Alert.alert('Erro', 'A nova senha deve ter no mínimo 4 caracteres');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'A nova senha e a confirmação não coincidem');
      return;
    }

    if (senhaAtual === novaSenha) {
      Alert.alert('Erro', 'A nova senha deve ser diferente da senha atual');
      return;
    }

    setIsLoading(true);
    try {
      await userService.changePassword({
        senhaAtual,
        novaSenha,
      });
      
      Alert.alert(
        'Sucesso',
        'Senha alterada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowPasswordDialog(false);
              setSenhaAtual('');
              setNovaSenha('');
              setConfirmarSenha('');
            },
          },
        ]
      );
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao alterar senha';
      Alert.alert('Erro', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  if (!user) {
    return null;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.card} elevation={2}>
        {/* Avatar */}
        <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>
            {user.userName.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Informações do usuário */}
        <View style={styles.infoContainer}>
          <Text variant="headlineSmall" style={styles.userName}>
            {user.userName}
          </Text>
          <Text variant="bodyMedium" style={[styles.userRole, { color: theme.colors.primary }]}>
            {user.role}
          </Text>
        </View>

        <Divider style={styles.divider} />

        {/* Ações */}
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            icon="lock-reset"
            onPress={() => setShowPasswordDialog(true)}
            style={styles.actionButton}
          >
            Trocar Senha
          </Button>

          <Button
            mode="outlined"
            icon="logout"
            onPress={handleLogout}
            textColor={theme.colors.error}
            style={styles.actionButton}
          >
            Sair
          </Button>
        </View>
      </Surface>

      {/* Dialog de troca de senha */}
      <Portal>
        <Dialog visible={showPasswordDialog} onDismiss={() => !isLoading && setShowPasswordDialog(false)}>
          <Dialog.Title>Trocar Senha</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Senha Atual *"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              secureTextEntry={!showPasswords}
              mode="outlined"
              style={styles.input}
              disabled={isLoading}
              right={
                <TextInput.Icon
                  icon={showPasswords ? 'eye-off' : 'eye'}
                  onPress={() => setShowPasswords(!showPasswords)}
                />
              }
            />

            <TextInput
              label="Nova Senha *"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry={!showPasswords}
              mode="outlined"
              style={styles.input}
              disabled={isLoading}
            />

            <TextInput
              label="Confirmar Nova Senha *"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!showPasswords}
              mode="outlined"
              style={styles.input}
              disabled={isLoading}
            />

            <Text variant="bodySmall" style={styles.helperText}>
              A senha deve ter no mínimo 4 caracteres
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPasswordDialog(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onPress={handleChangePassword} loading={isLoading} disabled={isLoading}>
              Confirmar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  userRole: {
    fontWeight: '500',
  },
  divider: {
    width: '100%',
    marginVertical: 16,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
  },
  input: {
    marginBottom: 12,
  },
  helperText: {
    marginTop: 8,
    opacity: 0.7,
  },
});
