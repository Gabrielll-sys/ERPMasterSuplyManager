// Localização: app/(tabs)/forms/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, RefreshControl, Pressable, Alert } from 'react-native';
// Importar Button se for usar em algum lugar, senão pode remover
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
// Importa os serviços/repositórios e tipos
import { getAvailableFormTemplates } from '@/app/data/templateService'; // Corrigido caminho
import { getAllFilledFormsSummary } from '@/app/data/filledFormRepository'; // Corrigido caminho
import { IFormTemplate, IFilledFormInstance, FilledFormStatus } from '@/app/models/FormTypes'; // Corrigido caminho
// Importa componentes de UI (se criados)
// import FormTemplateListItem from '@/components/forms/FormTemplateListItem';
// import FilledFormListItem from '@/components/forms/FilledFormListItem';

// Tipo para o resumo do formulário preenchido (sem respostas)
type FilledFormSummary = Omit<IFilledFormInstance, 'responses'>;

export default function FormListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [availableTemplates, setAvailableTemplates] = useState<IFormTemplate[]>([]);
  const [filledForms, setFilledForms] = useState<FilledFormSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Função para carregar todos os dados necessários para a tela
  const loadData = useCallback(async () => {
    console.log("Carregando dados para FormListScreen...");
    // Não definir isLoading como true aqui se já estiver em refreshing para evitar piscar duplo
    if (!refreshing) {
        setIsLoading(true);
    }
    try {
      const templates = getAvailableFormTemplates();
      setAvailableTemplates(templates);

      const summaries = await getAllFilledFormsSummary();
      setFilledForms(summaries);
      console.log(`Encontrados ${summaries.length} formulários preenchidos.`);

    } catch (error) {
      console.error("Erro ao carregar dados da lista de formulários:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados dos formulários.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]); // Adiciona refreshing como dependência

  // useFocusEffect para recarregar os dados sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Função para lidar com o "Pull to Refresh"
  const onRefresh = useCallback(() => {
    console.log("A atualizar lista de formulários...");
    setRefreshing(true);
    // loadData será chamado novamente porque 'refreshing' mudou (se incluído na dependência de loadData)
    // ou chamamos explicitamente aqui
    loadData();
  }, [loadData]); // loadData agora depende de refreshing

  // Função para navegar para a criação de um novo formulário
  const handleStartNewForm = (templateId: number) => {
    // CORRIGIDO: Usar a sintaxe de objeto para router.push com Typed Routes
    router.push({
      pathname: '/forms/fill/[instanceId]', // Usa o nome do arquivo da rota dinâmica
      params: { instanceId: 'new', templateId: templateId.toString() } // Passa 'new' e o templateId como parâmetros
    });
  };

  // Função para navegar para a edição/visualização de um formulário existente
  const handleOpenFilledForm = (instanceId: string) => {
     // CORRIGIDO: Usar a sintaxe de objeto para router.push com Typed Routes
    router.push({
      pathname: '/forms/fill/[instanceId]', // Usa o nome do arquivo da rota dinâmica
      params: { instanceId: instanceId } // Passa o ID real da instância
    });
  };

  // Função auxiliar para obter a cor do status
  const getStatusColor = (status: FilledFormStatus): string => {
      switch (status) {
          case FilledFormStatus.DRAFT: return colors.icon;
          case FilledFormStatus.PENDING_SYNC: return 'orange';
          case FilledFormStatus.SYNCED: return 'green';
          case FilledFormStatus.ERROR: return 'red';
          default: return colors.text;
      }
  };

  // --- Renderização ---

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Formulários' }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
        }
      >
        {/* Seção de Modelos Disponíveis */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.icon === Colors.light.icon ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }]}>Iniciar Novo Formulário</Text>
          {/* Mostra loading apenas se não estiver em modo refresh */}
          {isLoading && !refreshing ? (
             <ActivityIndicator style={styles.loadingIndicator} size="small" color={colors.tint} />
          ) : availableTemplates.length === 0 ? (
             <Text style={[styles.emptyText, { color: colors.icon }]}>Nenhum modelo de formulário disponível.</Text>
          ) : (
            availableTemplates.map((template) => (
              <Pressable key={template.id} style={styles.listItemTouchable} onPress={() => handleStartNewForm(template.id)}>
                 <View style={[styles.listItem, { backgroundColor: colors.icon === Colors.light.icon ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.08)', borderColor: colors.icon === Colors.light.icon ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }]}>
                    <View style={styles.listItemContent}>
                        <Text style={[styles.listItemTitle, { color: colors.text }]}>{template.name}</Text>
                        <Text style={[styles.listItemSubtitle, { color: colors.icon }]}>Versão: {template.version}</Text>
                    </View>
                    {/* Adicionar um ícone ou texto mais claro */}
                    <Text style={[styles.startButton, { color: colors.tint }]}>Iniciar →</Text>
                 </View>
              </Pressable>
            ))
          )}
        </View>

        {/* Seção de Formulários Preenchidos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.icon === Colors.light.icon ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }]}>Meus Formulários</Text>
          {isLoading && !refreshing ? (
             <ActivityIndicator style={styles.loadingIndicator} size="small" color={colors.tint} />
          ) : filledForms.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.icon }]}>Nenhum formulário preenchido ainda.</Text>
          ) : (
            filledForms.map((form) => {
                let headerDisplay = `ID: ${form.id.substring(0, 8)}...`;
                try {
                    const headerData = JSON.parse(form.headerDataJson || '{}');
                    const os = headerData['ordem_servico'];
                    const equip = headerData['equipamento'];
                     if (os || equip) {
                         headerDisplay = `${equip || 'Sem Equip.'} / ${os || 'Sem OS'}`;
                     } else if (headerData['equipamento_/_ordem_de_serviço']) {
                         headerDisplay = headerData['equipamento_/_ordem_de_serviço'];
                     }
                } catch { /* Ignora erro de parse */ }

                return (
                 <Pressable key={form.id} style={styles.listItemTouchable} onPress={() => handleOpenFilledForm(form.id)}>
                     <View style={[styles.listItem, { backgroundColor: colors.icon === Colors.light.icon ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.08)', borderColor: colors.icon === Colors.light.icon ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }]}>
                        <View style={styles.listItemContent}>
                            <Text style={[styles.listItemTitle, { color: colors.text }]}>
                                {availableTemplates.find(t => t.id === form.formTemplateId)?.name ?? `Template ID ${form.formTemplateId}`} (v{form.formTemplateVersion})
                            </Text>
                            <Text style={[styles.listItemSubtitle, { color: colors.icon }]}>{headerDisplay}</Text>
                            <Text style={[styles.listItemDate, { color: colors.icon }]}>
                                Criado: {new Date(form.deviceCreatedAt).toLocaleDateString('pt-BR')} {new Date(form.deviceCreatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                        <View style={styles.statusContainer}>
                             <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(form.status) }]} />
                             <Text style={[styles.statusText, { color: getStatusColor(form.status) }]}>{form.status.replace('_', ' ')}</Text>
                        </View>
                     </View>
                 </Pressable>
                );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor é definido dinamicamente
  },
  listItemTouchable: {
    marginBottom: 12,
    borderRadius: 10, // Bordas um pouco mais arredondadas
    overflow: 'hidden',
  },
  listItem: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    // borderBottomWidth removido, usando borda no container
    borderWidth: 1, // Adiciona borda ao item
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor é definido dinamicamente
  },
  listItemContent: {
      flex: 1,
      marginRight: 10,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5, // Aumenta espaço
  },
  listItemSubtitle: {
    fontSize: 14,
    marginBottom: 5, // Adiciona espaço
  },
   listItemDate: {
    fontSize: 12,
    // color é definido dinamicamente
  },
  startButton: {
      fontSize: 15,
      fontWeight: 'bold',
      marginLeft: 10, // Espaço à esquerda do texto "Iniciar"
  },
  statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 12, // Mais arredondado
      backgroundColor: 'rgba(128, 128, 128, 0.1)', // Fundo sutil para o status
  },
  statusIndicator: {
      width: 9,
      height: 9,
      borderRadius: 4.5,
      marginRight: 6,
  },
  statusText: {
      fontSize: 11, // Ligeiramente menor
      fontWeight: 'bold',
      textTransform: 'uppercase',
  },
  loadingIndicator: {
      marginTop: 20,
      marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
  },
});
