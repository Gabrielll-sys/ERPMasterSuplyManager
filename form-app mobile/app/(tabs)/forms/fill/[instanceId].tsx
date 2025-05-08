import {
  createNewDraftForm,
  getFilledFormById,
  saveOrUpdateFilledForm,
} from '@/app/data/filledFormRepository';
import { getFormTemplateStructureById } from '@/app/data/templateService';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router as expoRouter, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
// *** PASSO 4.2: Importar a função de tentativa de sync ***
import {
  FilledFormStatus,
  FormItemType,
  IFilledFormInstance,
  IFilledItemResponse,
  IFormTemplate,
} from '@/app/models/FormTypes';
import { attemptSyncPendingForms } from '@/app/services/syncService'; // Ajuste o caminho se necessário
import { ActionFooter } from '@/components/ActionFooter';
import { SectionCard } from '@/components/SectionCard';
import FormItemRenderer from '@/components/ui/FormItemRenderer';

const LOGGED_IN_USER_ID = 1; // Exemplo

export default function FillFormScreen() {
  const localRouter = useRouter();
  const params = useLocalSearchParams<{ instanceId: string; templateId?: string }>();
  const { instanceId: routeInstanceIdFromParams, templateId: routeTemplateIdFromParams } = params;
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [formTemplate, setFormTemplate] = useState<IFormTemplate | null>(null);
  const [filledForm, setFilledForm] = useState<IFilledFormInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // Usado para salvar e submeter
  const [isSyncingAfterSubmit, setIsSyncingAfterSubmit] = useState(false); // Estado para sync pós-submit
  const [currentInstanceId, setCurrentInstanceId] = useState<string | null>(routeInstanceIdFromParams);
  const [formTitle, setFormTitle] = useState('Carregando Formulário...');

  // Lógica de carregamento (mantida da versão anterior)
  useEffect(() => {
    let isMounted = true;
    const loadFormData = async () => {
        if (!currentInstanceId || !isMounted) {
            if(currentInstanceId !== 'new' && isMounted) { setIsLoading(false); } return;
        }
        setIsLoading(true); setFormTitle('Carregando...');
        try {
            let template: IFormTemplate | undefined; let formData: IFilledFormInstance | null = null;
            if (currentInstanceId === 'new' && routeTemplateIdFromParams) {
                const parsedTemplateId = parseInt(routeTemplateIdFromParams, 10);
                if (isNaN(parsedTemplateId)) { if(isMounted) Alert.alert('Erro', `ID de modelo inválido: ${routeTemplateIdFromParams}.`); localRouter.back(); return; }
                template = getFormTemplateStructureById(parsedTemplateId);
                if (!template) { if(isMounted) Alert.alert('Erro', `Modelo de formulário com ID ${routeTemplateIdFromParams} não encontrado.`); localRouter.back(); return; }
                formData = createNewDraftForm(template, LOGGED_IN_USER_ID);
                await saveOrUpdateFilledForm(formData);
                if (isMounted) {
                    setFormTemplate(template); setFilledForm(formData); setFormTitle(template.name);
                    setCurrentInstanceId(formData.id); expoRouter.replace(`/forms/fill/${formData.id}`);
                }
            } else if (currentInstanceId && currentInstanceId !== 'new') {
                formData = await getFilledFormById(currentInstanceId);
                if (!formData) { if(isMounted) Alert.alert('Erro', `Formulário com ID ${currentInstanceId} não encontrado.`); localRouter.back(); return; }
                template = getFormTemplateStructureById(formData.formTemplateId);
                if (isMounted) {
                    setFormTemplate(template ?? null); setFilledForm(formData); setFormTitle(template?.name ?? 'Formulário');
                    if (!template) { Alert.alert('Aviso', `Modelo de formulário original (ID: ${formData.formTemplateId}) não encontrado.`); }
                }
            }
        } catch (error) { console.error('Erro ao carregar dados do formulário:', error); if (isMounted) Alert.alert('Erro', 'Não foi possível carregar os dados do formulário.'); localRouter.back();
        } finally { if (isMounted) setIsLoading(false); }
    };
    loadFormData();
    return () => { isMounted = false; };
  }, [currentInstanceId, routeTemplateIdFromParams, localRouter]);

  // Callbacks handleResponseChange e handleHeaderChange (mantidos)
  const handleResponseChange = useCallback((itemId: number, field: keyof Omit<IFilledItemResponse, 'id' | 'filledFormInstanceId' | 'formTemplateItemId'>, value: string | null) => {
      setFilledForm((currentForm: IFilledFormInstance | null) => {
          if (!currentForm) return null;
          const updatedResponses = currentForm.responses.map(resp => {
              if (resp.formTemplateItemId === itemId) { return { ...resp, [field]: value }; }
              return resp;
          });
          return { ...currentForm, responses: updatedResponses };
      });
   }, []);
  const handleHeaderChange = useCallback((headerItemId: number, value: string | null) => {
      setFilledForm((currentForm: IFilledFormInstance | null) => {
          if (!currentForm || !formTemplate) return null;
          const headerField = formTemplate.headerFields.find(hf => hf.id === headerItemId);
          if (!headerField) return currentForm;
          const key = headerField.label.toLowerCase().replace(/[^a-z0-9_]/g, '_');
          try {
              const currentHeaderData = JSON.parse(currentForm.headerDataJson || '{}');
              const updatedHeaderData = { ...currentHeaderData, [key]: value };
              return { ...currentForm, headerDataJson: JSON.stringify(updatedHeaderData) };
          } catch (e) { console.error("Erro ao atualizar dados do cabeçalho JSON:", e); return currentForm; }
      });
  }, [formTemplate]);
  const headerData = useMemo(() => {
      if (!filledForm?.headerDataJson) return {};
      try { return JSON.parse(filledForm.headerDataJson); }
      catch { return {}; }
  }, [filledForm?.headerDataJson]);

  // Funções saveDraft e submitForm (submitForm modificado)
  const saveDraft = async () => {
      if (!filledForm) return;
      setIsSaving(true);
      try {
          const formToSave = { ...filledForm, status: FilledFormStatus.DRAFT };
          await saveOrUpdateFilledForm(formToSave);
          setFilledForm(formToSave); // Atualiza estado local com o status correto
          Alert.alert('Sucesso', 'Rascunho salvo localmente.');
      } catch (error) { console.error('Erro ao salvar rascunho:', error); Alert.alert('Erro', 'Não foi possível salvar o rascunho.'); }
      finally { setIsSaving(false); }
   };

  const submitForm = async () => {
    if (!filledForm || !formTemplate) return;
    // Validação de campos obrigatórios (mantida)
    let missingRequiredFieldLabel: string | null = null;
    for (const hf of formTemplate.headerFields) {
        const key = hf.label.toLowerCase().replace(/[^a-z0-9_]/g, '_');
        const value = headerData[key];
        if (hf.isRequired && (value === null || value === undefined || String(value).trim() === '')) { missingRequiredFieldLabel = hf.label; break; }
    }
    if (!missingRequiredFieldLabel) {
        for (const sec of formTemplate.sections) {
            for (const item of sec.items) {
                const response = filledForm.responses.find(r => r.formTemplateItemId === item.id);
                const isInformationalType = item.itemType === FormItemType.SECTION_DATETIME || item.itemType === FormItemType.SECTION_OBSERVATIONS;
                if (item.isRequired && !isInformationalType) {
                    if (!response || (response.responseValue === null || String(response.responseValue).trim() === '') && (item.itemType !== FormItemType.SIGNATURE || !response.signatureValueBase64) ) { missingRequiredFieldLabel = item.label; break; }
                }
            }
            if (missingRequiredFieldLabel) break;
        }
    }
    if (missingRequiredFieldLabel) { Alert.alert('Campo Obrigatório', `Por favor, preencha o campo obrigatório: "${missingRequiredFieldLabel}".`); return; }

    setIsSaving(true); // Indica que estamos a processar a submissão
    try {
      const now = new Date().toISOString();
      const formToSubmit: IFilledFormInstance = { ...filledForm, status: FilledFormStatus.PENDING_SYNC, deviceSubmittedAt: now };
      await saveOrUpdateFilledForm(formToSubmit); // Salva localmente como PENDING_SYNC
      Alert.alert('Formulário Finalizado', 'Formulário salvo localmente. A tentar sincronizar...');

      // *** PASSO 4.2: Tentar sincronizar imediatamente ***
      setIsSyncingAfterSubmit(true); // Mostra um indicador diferente ou ajusta o texto/estado do botão
      const syncAttempted = await attemptSyncPendingForms(false); // Tenta sincronizar sem mostrar alertas de sucesso/erro daqui
      setIsSyncingAfterSubmit(false);

      if (syncAttempted) {
          console.log("Tentativa de sincronização pós-submissão realizada (verificar logs do syncService para resultado).");
          // O feedback final (sucesso/erro do sync) virá dos Alertas dentro de attemptSyncPendingForms se showFeedback=true,
          // ou o utilizador verá o status atualizado na lista.
      } else {
          console.log("Dispositivo offline após submissão. Formulário ficará pendente.");
          // O listener de rede tentará sincronizar mais tarde.
      }

      localRouter.back(); // Volta para a tela anterior

    } catch (error) {
      console.error('Erro ao finalizar e tentar sincronizar formulário:', error);
      Alert.alert('Erro', 'Não foi possível finalizar o formulário.');
      // Garante que os indicadores sejam resetados em caso de erro
      setIsSaving(false);
      setIsSyncingAfterSubmit(false);
    }
    // Não precisa de finally aqui, pois isSyncingAfterSubmit controla o estado pós-salvamento
  };

  // --- Renderização ---
  if (isLoading) {
      return (
          <View style={[styles.centered, { backgroundColor: colors.background }]}>
              <ActivityIndicator size="large" color={colors.tint} />
              <Text style={[styles.loadingText, { color: colors.text }]}>Carregando Formulário...</Text>
          </View>
      );
  }
   if (!formTemplate || !filledForm) {
       return (
           <View style={[styles.centered, { backgroundColor: colors.background }]}>
               <Text style={styles.errorText}>Erro ao carregar dados do formulário. Por favor, tente novamente.</Text>
               <Button title="Voltar" onPress={() => localRouter.back()} color={colors.tint}/>
           </View>
       );
   }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoiding}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <Stack.Screen options={{ title: formTitle }} />
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <SectionCard title="Cabeçalho">
              {formTemplate.headerFields.map((item) => {
                 const headerKey = item.label.toLowerCase().replace(/[^a-z0-9_]/g, '_');
                 const handleHeaderItemChange = (itemId: number, field: keyof Omit<IFilledItemResponse, 'id' | 'filledFormInstanceId' | 'formTemplateItemId'>, value: string | null) => {
                     if(field === 'responseValue') { handleHeaderChange(itemId, value); }
                 };
                 const simulatedResponse: IFilledItemResponse = { id: `header_${item.id}`, filledFormInstanceId: filledForm.id, formTemplateItemId: item.id, responseValue: headerData[headerKey] ?? null };
                 return (<FormItemRenderer key={`header-${item.id}`} itemDefinition={item} currentResponse={simulatedResponse} onResponseChange={handleHeaderItemChange} isDisabled={false} />);
              })}
            </SectionCard>

            {formTemplate.sections.map((section: { id: any; name: any; items: any[]; }) => (
              <SectionCard key={section.id} title={section.name}>
                {section.items.map((item) => {
                  const response = filledForm.responses.find(r => r.formTemplateItemId === item.id);
                  if (!response) { return (<View key={item.id} style={styles.errorItem}><Text style={styles.errorItemText}>Erro: Resposta ausente para "{item.label}"</Text></View>); }
                  return (<FormItemRenderer key={item.id} itemDefinition={item} currentResponse={response} onResponseChange={handleResponseChange} isDisabled={false} />);
                })}
              </SectionCard>
            ))}
          </ScrollView>

          {/* Footer com estado de sincronização */}
          <ActionFooter
            onSaveDraft={saveDraft}
            onSubmit={submitForm}
            isSaving={isSaving || isSyncingAfterSubmit} // Desabilita botões durante salvamento OU sync pós-submit
            submitText={isSyncingAfterSubmit ? "A Sincronizar..." : "Finalizar e Enviar"} // Muda texto do botão
          />
        </KeyboardAvoidingView>
    </View>
  );
}

// Estilos (mantidos da versão anterior)
const styles = StyleSheet.create({
  container: { flex: 1, },
  keyboardAvoiding: { flex: 1, },
  scrollContent: { padding: 15, paddingBottom: 30, },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
  loadingText: { marginTop: 10, fontSize: 16, },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 20, fontSize: 16, fontWeight: 'bold', },
  errorItem: { padding:10, marginVertical: 5, backgroundColor: 'rgba(255,0,0,0.05)', borderColor: 'rgba(255,0,0,0.3)', borderWidth: 1, borderRadius: 5, },
  errorItemText: { color: '#cc0000', }
});