import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme, Surface, HelperText, List, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { IOrcamento } from '../../src/types';
import { orcamentoService } from '../../src/api/orcamento.service';

type ClienteEncontrado = {
  nomeCliente?: string;
  cpfOrCnpj?: string;
  telefone?: string;
  endereco?: string;
  emailCliente?: string;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function NovoOrcamentoScreen() {
  const theme = useTheme();
  const { user } = useAuth();

  const [nomeCliente, setNomeCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpfOrCnpj, setCpfOrCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [clientes, setClientes] = useState<ClienteEncontrado[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<ClienteEncontrado | null>(null);
  const [error, setError] = useState('');

  const debouncedNome = useDebounce(nomeCliente, 400);

  const consolidateClientes = (clientesList: ClienteEncontrado[]): ClienteEncontrado[] => {
    const clienteMap = new Map<string, ClienteEncontrado>();
    clientesList.forEach((cliente) => {
      const nomeNormalizado = (cliente.nomeCliente || '').toLowerCase().trim();
      if (!nomeNormalizado) return;
      const existente = clienteMap.get(nomeNormalizado);
      if (!existente) {
        clienteMap.set(nomeNormalizado, { ...cliente });
      } else {
        clienteMap.set(nomeNormalizado, {
          nomeCliente: existente.nomeCliente || cliente.nomeCliente,
          cpfOrCnpj: existente.cpfOrCnpj || cliente.cpfOrCnpj,
          telefone: existente.telefone || cliente.telefone,
          endereco: existente.endereco || cliente.endereco,
          emailCliente: existente.emailCliente || cliente.emailCliente,
        });
      }
    });
    return Array.from(clienteMap.values());
  };

  useEffect(() => {
    const searchClientes = async () => {
      if (!debouncedNome.trim() || debouncedNome.length < 2 || selectedCliente) {
        setClientes([]);
        return;
      }

      setIsSearching(true);
      try {
        const data = await orcamentoService.buscaNomeCliente(debouncedNome.trim());
        const list = Array.isArray(data) ? data : [data];
        const consolidados = consolidateClientes(list as ClienteEncontrado[]);
        setClientes(consolidados);
      } catch (err) {
        setClientes([]);
      } finally {
        setIsSearching(false);
      }
    };
    searchClientes();
  }, [debouncedNome, selectedCliente]);

  const handleSelectCliente = (cliente: ClienteEncontrado) => {
    setSelectedCliente(cliente);
    setNomeCliente(cliente.nomeCliente || '');
    setCpfOrCnpj(cliente.cpfOrCnpj || '');
    setTelefone(cliente.telefone || '');
    setEndereco(cliente.endereco || '');
    setEmailCliente(cliente.emailCliente || '');
    setClientes([]);
  };

  const handleClearSelection = () => {
    setSelectedCliente(null);
    setNomeCliente('');
    setCpfOrCnpj('');
    setTelefone('');
    setEndereco('');
    setEmailCliente('');
  };

  const handleCreate = async () => {
    setError('');
    if (!nomeCliente.trim()) {
      setError('Nome do cliente é obrigatório');
      return;
    }

    setIsCreating(true);
    try {
      const orcamento: IOrcamento = {
        nomeCliente: nomeCliente.trim().replace(/\s\s+/g, ' '),
        emailCliente: emailCliente.trim().replace(/\s\s+/g, ' '),
        telefone: telefone,
        endereco: endereco.trim().replace(/\s\s+/g, ' '),
        cpfOrCnpj: cpfOrCnpj,
        desconto: 0,
        tipoPagamento: 'Cartão de Crédito',
        responsavelOrcamento: user?.userName,
      };

      const data = await orcamentoService.create(orcamento);
      router.replace(`/orcamento/${data.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao criar orçamento');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.card} elevation={2}>
        <Text variant="headlineSmall" style={styles.title}>
          Novo Orçamento
        </Text>

        <TextInput
          label="Nome do Cliente *"
          value={nomeCliente}
          onChangeText={(value) => {
            setNomeCliente(value);
            setSelectedCliente(null);
          }}
          mode="outlined"
          style={styles.input}
          right={
            selectedCliente ? (
              <TextInput.Icon icon="close" onPress={handleClearSelection} />
            ) : isSearching ? (
              <TextInput.Icon icon="loading" />
            ) : undefined
          }
        />

        {isSearching && (
          <View style={styles.searchInfo}>
            <ActivityIndicator size="small" />
            <Text style={styles.helperText}>Buscando clientes...</Text>
          </View>
        )}

        {clientes.length > 0 && (
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Clientes encontrados</Text>
            {clientes.map((cliente, idx) => (
              <TouchableOpacity key={`${cliente.nomeCliente}-${idx}`} onPress={() => handleSelectCliente(cliente)}>
                <List.Item
                  title={cliente.nomeCliente || 'Cliente'}
                  description={cliente.cpfOrCnpj || cliente.emailCliente || 'Sem informações'}
                  left={(props) => <List.Icon {...props} icon="account" />}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TextInput
          label="Email"
          value={emailCliente}
          onChangeText={setEmailCliente}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="CPF ou CNPJ"
          value={cpfOrCnpj}
          onChangeText={setCpfOrCnpj}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Endereço"
          value={endereco}
          onChangeText={setEndereco}
          mode="outlined"
          style={styles.input}
        />

        {error ? (
          <HelperText type="error" visible={true}>
            {error}
          </HelperText>
        ) : null}

        <View style={styles.buttonRow}>
          <Button mode="outlined" onPress={() => router.back()} disabled={isCreating}>
            Cancelar
          </Button>
          <Button mode="contained" onPress={handleCreate} loading={isCreating} disabled={isCreating}>
            Criar
          </Button>
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  dropdownTitle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    opacity: 0.7,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  searchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  helperText: {
    opacity: 0.7,
  },
});
