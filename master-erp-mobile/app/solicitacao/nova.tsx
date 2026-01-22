import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme, HelperText, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { useSolicitacoes } from '../../src/hooks/useSolicitacoes';
import { UserSelectModal } from '../../src/components/UserSelectModal';

export default function NovaSolicitacaoScreen() {
  const theme = useTheme();
  const { createSolicitacao, isCreating } = useSolicitacoes();
  
  const [nomeCliente, setNomeCliente] = useState('');
  const [descricao, setDescricao] = useState('');
  const [usuariosResponsaveis, setUsuariosResponsaveis] = useState<string[]>([]);
  const [showUserSelectModal, setShowUserSelectModal] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setError('');
    
    if (!nomeCliente.trim() || !descricao.trim()) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      const payload: any = {
        nomeCliente: nomeCliente.trim(),
        descricao: descricao.trim(),
      };
      
      // Se houver usuários selecionados, adiciona ao payload
      if (usuariosResponsaveis.length > 0) {
        payload.usuariosDesignados = usuariosResponsaveis.join(', ');
      }
      
      await createSolicitacao(payload);
      
      router.back();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar solicitação');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.card} elevation={2}>
          <Text variant="headlineSmall" style={styles.title}>
            Nova Solicitação de Serviço
          </Text>
          
          <View style={styles.form}>
            <TextInput
              label="Nome do Cliente *"
              value={nomeCliente}
              onChangeText={setNomeCliente}
              mode="outlined"
              left={<TextInput.Icon icon="account" />}
              style={styles.input}
              error={!!error && !nomeCliente.trim()}
            />

            <TextInput
              label="Descrição do Serviço *"
              value={descricao}
              onChangeText={setDescricao}
              mode="outlined"
              multiline
              numberOfLines={6}
              left={<TextInput.Icon icon="text" />}
              style={styles.textArea}
              error={!!error && !descricao.trim()}
            />

            {/* Seleção de usuários responsáveis */}
            <View style={styles.userSection}>
              <Text variant="labelLarge" style={styles.sectionLabel}>
                Usuários Responsáveis (Opcional)
              </Text>
              <Button
                mode="outlined"
                icon="account-multiple-plus"
                onPress={() => setShowUserSelectModal(true)}
                style={styles.selectButton}
              >
                {usuariosResponsaveis.length > 0 
                  ? `${usuariosResponsaveis.length} usuário(s) selecionado(s)`
                  : 'Selecionar usuários responsáveis'}
              </Button>
              
              {usuariosResponsaveis.length > 0 && (
                <View style={styles.selectedUsers}>
                  {usuariosResponsaveis.map((usuario, index) => (
                    <Chip
                      key={index}
                      onClose={() => {
                        setUsuariosResponsaveis(usuariosResponsaveis.filter((_, i) => i !== index));
                      }}
                      style={styles.userChip}
                    >
                      {usuario}
                    </Chip>
                  ))}
                </View>
              )}
            </View>

            {error ? (
              <HelperText type="error" visible={true}>
                {error}
              </HelperText>
            ) : null}

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => router.back()}
                disabled={isCreating}
                style={styles.button}
              >
                Cancelar
              </Button>
              
              <Button
                mode="contained"
                onPress={handleCreate}
                loading={isCreating}
                disabled={isCreating}
                style={styles.button}
              >
                Criar
              </Button>
            </View>
          </View>
        </Surface>
      </ScrollView>
      
      {/* Modal de seleção de usuários */}
      <UserSelectModal
        visible={showUserSelectModal}
        onDismiss={() => setShowUserSelectModal(false)}
        onConfirm={(usuarios) => {
          setUsuariosResponsaveis(usuarios);
          setShowUserSelectModal(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontWeight: '600',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  textArea: {
    backgroundColor: 'transparent',
    minHeight: 120,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
  userSection: {
    marginTop: 8,
  },
  sectionLabel: {
    marginBottom: 8,
    opacity: 0.8,
  },
  selectButton: {
    marginBottom: 8,
  },
  selectedUsers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  userChip: {
    marginBottom: 4,
  },
});
