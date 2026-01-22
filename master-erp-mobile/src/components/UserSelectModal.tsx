import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Portal, Dialog, Text, Button, Checkbox, Searchbar, ActivityIndicator, useTheme } from 'react-native-paper';
import api from '../api/client';

interface Usuario {
  id: number;
  nome: string;
  cargo: string;
  isActive: boolean;
}

interface UserSelectModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (usuarios: string[]) => void;
  isLoading?: boolean;
}

export function UserSelectModal({ visible, onDismiss, onConfirm, isLoading = false }: UserSelectModalProps) {
  const theme = useTheme();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadUsuarios();
      setSelectedUsers([]);
    }
  }, [visible]);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const response = await api.get<Usuario[]>('/Usuarios');
      // Filtrar apenas usuários ativos
      const activeUsers = response.data.filter(u => u.isActive);
      setUsuarios(activeUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (nome: string) => {
    if (selectedUsers.includes(nome)) {
      setSelectedUsers(selectedUsers.filter(n => n !== nome));
    } else {
      setSelectedUsers([...selectedUsers, nome]);
    }
  };

  const filteredUsuarios = usuarios.filter(u =>
    u.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (selectedUsers.length > 0) {
      onConfirm(selectedUsers);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Selecionar Executantes</Dialog.Title>
        
        <Dialog.Content>
          <Text variant="bodyMedium" style={{ marginBottom: 16, color: theme.colors.outline }}>
            Selecione os usuários que participaram da conclusão do serviço
          </Text>

          <Searchbar
            placeholder="Buscar usuário..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              data={filteredUsuarios}
              keyExtractor={(item) => item.id.toString()}
              style={styles.list}
              renderItem={({ item }) => (
                <View style={styles.userItem}>
                  <Checkbox.Item
                    label={item.nome}
                    status={selectedUsers.includes(item.nome) ? 'checked' : 'unchecked'}
                    onPress={() => toggleUser(item.nome)}
                    labelStyle={styles.checkboxLabel}
                  />
                  <Text variant="bodySmall" style={styles.cargo}>
                    {item.cargo}
                  </Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
              }
            />
          )}

          {selectedUsers.length > 0 && (
            <Text variant="bodySmall" style={styles.selectedCount}>
              {selectedUsers.length} usuário(s) selecionado(s)
            </Text>
          )}
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={onDismiss} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onPress={handleConfirm}
            disabled={selectedUsers.length === 0 || isLoading}
            loading={isLoading}
          >
            Confirmar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    maxHeight: '80%',
  },
  searchbar: {
    marginBottom: 12,
  },
  list: {
    maxHeight: 300,
  },
  userItem: {
    marginBottom: 4,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  cargo: {
    marginLeft: 56,
    marginTop: -8,
    marginBottom: 8,
    opacity: 0.7,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    padding: 32,
    opacity: 0.7,
  },
  selectedCount: {
    marginTop: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
