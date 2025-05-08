// Localização: app/(tabs)/forms/fill/[instanceId].tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  Button,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter, router as expoRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getFormTemplateStructureById } from '@/app/data/templateService';
import {
  getFilledFormById,
  saveOrUpdateFilledForm,
  createNewDraftForm,
} from '@/app/data/filledFormRepository';
// Remover import do syncService, pois não será usado por agora
// import { attemptSyncPendingForms } from '@/services/syncService';
import {
  IFormTemplate,
  IFilledFormInstance,
  IFilledItemResponse,
  FilledFormStatus,
  FormItemType,
} from '@/app/models/FormTypes';
import FormItemRenderer from '@/components/ui/FormItemRenderer';
import { SectionCard } from '@/components/SectionCard';
import { ActionFooter } from '@/components/ActionFooter';
// *** PASSO PDF: Importar bibliotecas necessárias ***
import * as Print from 'expo-print'; // Para impressão/geração de PDF
import { shareAsync } from 'expo-sharing'; // Para partilhar o PDF

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
  const [isSaving, setIsSaving] = useState(false);
  // Remover estado de sync pós-submit
  // const [isSyncingAfterSubmit, setIsSyncingAfterSubmit] = useState(false);
  const [currentInstanceId, setCurrentInstanceId] = useState<string | null>(routeInstanceIdFromParams);
  const [formTitle, setFormTitle] = useState('Carregando Formulário...');

  // Lógica de carregamento (igual, mas verifica se filledForm é realmente único)
  useEffect(() => {
    let isMounted = true;
    const loadFormData = async () => {
        if (!currentInstanceId || !isMounted) { /* ... */ return; }
        setIsLoading(true); setFormTitle('Carregando...');
        try {
            let template: IFormTemplate | undefined; let formData: IFilledFormInstance | null = null;
            if (currentInstanceId === 'new' && routeTemplateIdFromParams) {
                // ... (lógica de criação mantida) ...
                 const parsedTemplateId = parseInt(routeTemplateIdFromParams, 10);
                 if (isNaN(parsedTemplateId)) { /* ... erro ... */ return; }
                 template = getFormTemplateStructureById(parsedTemplateId);
                 if (!template) { /* ... erro ... */ return; }
                 formData = createNewDraftForm(template, LOGGED_IN_USER_ID);
                 await saveOrUpdateFilledForm(formData); // Salva rascunho inicial
                 if (isMounted) {
                     console.log(`[FillFormScreen] Novo formulário criado e salvo localmente: ID=${formData.id}`);
                     setFormTemplate(template);
                     setFilledForm(formData); // Define o estado com o formulário criado
                     setFormTitle(template.name);
                     setCurrentInstanceId(formData.id); // Atualiza o ID de estado
                     expoRouter.replace(`/forms/fill/${formData.id}`); // Atualiza a rota
                 }
            } else if (currentInstanceId && currentInstanceId !== 'new') {
                console.log(`[FillFormScreen] Carregando formulário existente ID: ${currentInstanceId}`);
                formData = await getFilledFormById(currentInstanceId); // Busca do SQLite
                if (!formData) { /* ... erro ... */ return; }
                template = getFormTemplateStructureById(formData.formTemplateId);
                if (isMounted) {
                    console.log(`[FillFormScreen] Formulário ID ${currentInstanceId} carregado.`);
                    // *** DEBUG BUG: Logar os dados carregados ***
                    console.log("[FillFormScreen] HeaderDataJson Carregado:", formData.headerDataJson);
                    setFormTemplate(template ?? null);
                    // Garante que uma cópia profunda é feita, embora useState já deva lidar com isso
                    setFilledForm(JSON.parse(JSON.stringify(formData)));
                    setFormTitle(template?.name ?? 'Formulário');
                    if (!template) { Alert.alert('Aviso', `Modelo de formulário original (ID: ${formData.formTemplateId}) não encontrado.`); }
                }
            }
        } catch (error) { /* ... tratamento de erro ... */ }
        finally { if (isMounted) setIsLoading(false); }
    };
    loadFormData();
    return () => { isMounted = false; };
  }, [currentInstanceId, routeTemplateIdFromParams, localRouter]); // Depende de currentInstanceId

  // Callback para atualizar respostas dos itens (sem alterações)
  const handleResponseChange = useCallback((itemId: number, field: keyof Omit<IFilledItemResponse, 'id' | 'filledFormInstanceId' | 'formTemplateItemId'>, value: string | null) => {
      setFilledForm((currentForm: IFilledFormInstance | null) => {
          if (!currentForm) return null;
          // *** DEBUG BUG: Logar a atualização ***
          // console.log(`[handleResponseChange] ItemID: ${itemId}, Field: ${field}, Value: ${value}, FormID: ${currentForm.id}`);
          const updatedResponses = currentForm.responses.map(resp => {
              if (resp.formTemplateItemId === itemId) { return { ...resp, [field]: value }; }
              return resp;
          });
          return { ...currentForm, responses: updatedResponses };
      });
   }, []);

   // Callback para atualizar dados do cabeçalho (sem alterações na lógica principal)
  const handleHeaderChange = useCallback((headerItemId: number, value: string | null) => {
      setFilledForm((currentForm: IFilledFormInstance | null) => {
          if (!currentForm || !formTemplate) return null;
          const headerField = formTemplate.headerFields.find(hf => hf.id === headerItemId);
          if (!headerField) return currentForm;
          const key = headerField.label.toLowerCase().replace(/[^a-z0-9_]/g, '_');

          // *** DEBUG BUG: Logar a atualização do cabeçalho ***
          // console.log(`[handleHeaderChange] HeaderItemID: ${headerItemId}, Key: ${key}, Value: ${value}, FormID: ${currentForm.id}`);

          try {
              // Garante que estamos a trabalhar numa cópia
              const currentHeaderData = JSON.parse(currentForm.headerDataJson || '{}');
              // Cria um NOVO objeto para o headerData atualizado
              const updatedHeaderData = { ...currentHeaderData, [key]: value };
              // Retorna um NOVO objeto para o estado filledForm
              return { ...currentForm, headerDataJson: JSON.stringify(updatedHeaderData) };
          } catch (e) { console.error("Erro ao atualizar dados do cabeçalho JSON:", e); return currentForm; }
      });
  }, [formTemplate]);

  // Memoização do headerData (mantida)
  const headerData = useMemo(() => {
      if (!filledForm?.headerDataJson) return {};
      try { return JSON.parse(filledForm.headerDataJson); }
      catch { console.error("[headerData Memo] Erro ao desserializar:", filledForm?.headerDataJson); return {}; }
  }, [filledForm?.headerDataJson]);

  // Função saveDraft (mantida, apenas salva localmente)
  const saveDraft = async () => {
      if (!filledForm) return;
      setIsSaving(true);
      try {
          const formToSave = { ...filledForm, status: FilledFormStatus.DRAFT };
          await saveOrUpdateFilledForm(formToSave);
          setFilledForm(formToSave);
          Alert.alert('Sucesso', 'Rascunho salvo localmente.');
      } catch (error) { console.error('Erro ao salvar rascunho:', error); Alert.alert('Erro', 'Não foi possível salvar o rascunho.'); }
      finally { setIsSaving(false); }
   };

  // Função submitForm (Modificada: não sincroniza, apenas marca como "completo" localmente se necessário)
  const submitForm = async () => {
    if (!filledForm || !formTemplate) return;
    // Validação de campos obrigatórios (mantida)
    let missingRequiredFieldLabel: string | null = null;
    // ... (lógica de validação mantida) ...
    if (missingRequiredFieldLabel) { Alert.alert('Campo Obrigatório', `Por favor, preencha o campo obrigatório: "${missingRequiredFieldLabel}".`); return; }

    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      // Muda o status para DRAFT ou um novo status 'COMPLETED_LOCAL' se quiser diferenciar
      // Por agora, manteremos DRAFT, já que não há sync.
      const formToSubmit: IFilledFormInstance = {
          ...filledForm,
          status: FilledFormStatus.DRAFT, // Ou um novo status ex: 'COMPLETED_LOCAL'
          deviceSubmittedAt: now // Ainda pode ser útil saber quando foi finalizado
      };
      await saveOrUpdateFilledForm(formToSubmit);
      setFilledForm(formToSubmit); // Atualiza estado local
      Alert.alert('Formulário Concluído', 'Formulário salvo localmente. Agora pode exportar para PDF.');
      // Não tenta sincronizar e não volta automaticamente
      // localRouter.back(); // Remover ou deixar opcional
    } catch (error) {
      console.error('Erro ao finalizar formulário localmente:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações finais do formulário.');
    } finally {
      setIsSaving(false);
    }
  };

  // *** PASSO PDF: Função para gerar e partilhar o PDF ***
  const generateAndSharePdf = async () => {
      if (!filledForm || !formTemplate) {
          Alert.alert("Erro", "Dados do formulário não carregados.");
          return;
      }
      setIsSaving(true); // Reutiliza o estado de saving para indicar processamento
      console.log("[PDF] Iniciando geração do PDF...");

      // 1. Construir o HTML
      // Esta é a parte mais complexa, pois precisa recriar o layout do PDF com HTML e CSS.
      // Usaremos template strings para montar o HTML.
      // Incluir estilos inline ou numa tag <style> para formatar.
      const htmlContent = `
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${formTemplate.name}</title>
              <style>
                  body { font-family: sans-serif; margin: 20px; font-size: 10px; } /* Tamanho de fonte menor para caber mais */
                  .header, .section, .footer { margin-bottom: 15px; border: 1px solid #ccc; padding: 10px; border-radius: 5px; }
                  .header-title { text-align: center; font-size: 14px; font-weight: bold; margin-bottom: 15px; }
                  .header-info { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 15px; margin-bottom: 10px; } /* Layout de grid para cabeçalho */
                  .section-title { font-size: 12px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                  th, td { border: 1px solid #ddd; padding: 4px; text-align: left; vertical-align: top; }
                  th { background-color: #f2f2f2; font-size: 9px; }
                  .item-label { width: 60%; } /* Ajustar largura das colunas */
                  .item-response { width: 10%; text-align: center; }
                  .item-obs { width: 30%; }
                  .signature-box { border: 1px dashed #ccc; min-height: 60px; margin-top: 5px; display: flex; justify-content: center; align-items: center; }
                  .signature-img { max-width: 150px; max-height: 50px; }
                  .footer-signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;}
                  .page-break { page-break-before: always; } /* Forçar quebra de página se necessário */
              </style>
          </head>
          <body>
              <div class="header">
                  <div class="header-title">${formTemplate.name}</div>
                  <div class="header-info">
                      ${formTemplate.headerFields.map(hf => {
                          const key = hf.label.toLowerCase().replace(/[^a-z0-9_]/g, '_');
                          let value = headerData[key] ?? ' '; // Usar espaço se nulo para manter layout
                          if (hf.itemType === FormItemType.SIGNATURE) return ''; // Assinaturas do header vão para o footer
                          if (hf.itemType === FormItemType.DATETIME && value) {
                              try { value = new Date(value).toLocaleString('pt-BR'); } catch { /* ignora erro */ }
                          }
                          return `<div><strong>${hf.label}:</strong> ${value}</div>`;
                      }).join('')}
                  </div>
              </div>

              ${formTemplate.sections.map((section: { name: any; items: { id: any; itemType: any; label: any; isRequired: any; }[]; }) => `
                  <div class="section">
                      <div class="section-title">${section.name}</div>
                      <table>
                          <thead>
                              <tr>
                                  <th class="item-label">Item</th>
                                  <th class="item-response">Resp.</th>
                                  <th class="item-obs">Observação</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${section.items.map((item: { id: any; itemType: any; label: any; isRequired: any; }) => {
                                  const response = filledForm ? filledForm.responses.find(r => r.formTemplateItemId === item.id) : undefined;
                                  let respValueDisplay = response?.responseValue ?? '-';
                                  let obsDisplay = response?.observationText ?? '';
                                  let signatureBase64 = response?.signatureValueBase64;

                                  // Ajustar exibição para tipos específicos
                                  if (item.itemType === FormItemType.OK_NC_OBS || item.itemType === FormItemType.OK_NC) {
                                      respValueDisplay = response?.responseValue === 'OK' ? 'OK' : (response?.responseValue === 'NC' ? 'NC' : '-');
                                  } else if (item.itemType === FormItemType.YES_NO) {
                                      respValueDisplay = response?.responseValue === 'YES' ? 'Sim' : (response?.responseValue === 'NO' ? 'Não' : '-');
                                  } else if (item.itemType === FormItemType.DATETIME || item.itemType === FormItemType.SECTION_DATETIME) {
                                      respValueDisplay = response?.responseValue ? new Date(response.responseValue).toLocaleString('pt-BR') : '-';
                                  } else if (item.itemType === FormItemType.SECTION_OBSERVATIONS) {
                                      // Observação da seção vai para a coluna de observação
                                      obsDisplay = response?.responseValue ?? '';
                                      respValueDisplay = '-'; // Não há valor de resposta principal
                                  } else if (item.itemType === FormItemType.SIGNATURE) {
                                      // Assinatura dentro da seção
                                      respValueDisplay = signatureBase64 ? '[Assinado]' : '-'; // Placeholder
                                      // Poderia tentar incluir a imagem, mas pode ser complexo no HTML para PDF
                                      obsDisplay = signatureBase64 ? `<img src="data:image/png;base64,${signatureBase64}" class="signature-img" alt="Assinatura"/>` : '';
                                  }

                                  // Não renderiza linhas para tipos puramente informativos se não tiverem valor
                                  if ((item.itemType === FormItemType.SECTION_DATETIME || item.itemType === FormItemType.SECTION_OBSERVATIONS) && !response?.responseValue) {
                                      // return ''; // Ou renderiza o label sem valor
                                  }

                                  return `
                                      <tr>
                                          <td class="item-label">${item.label} ${item.isRequired ? '*' : ''}</td>
                                          <td class="item-response">${respValueDisplay}</td>
                                          <td class="item-obs">${obsDisplay}</td>
                                      </tr>
                                  `;
                              }).join('')}
                          </tbody>
                      </table>
                  </div>
              `).join('')}

              <div class="footer">
                   <div class="section-title">Observações Gerais</div>
                   <p>${filledForm.generalObservations ?? 'Nenhuma.'}</p>
                   <div class="footer-signatures">
                        ${formTemplate.headerFields.filter(hf => hf.itemType === FormItemType.SIGNATURE).map(hf => {
                            const key = hf.label.toLowerCase().replace(/[^a-z0-9_]/g, '_');
                            const sigBase64 = headerData[key]; // Assumindo que a assinatura do header está no headerData
                            return `
                                <div>
                                    <strong>${hf.label}:</strong>
                                    <div class="signature-box">
                                        ${sigBase64 ? `<img src="data:image/png;base64,${sigBase64}" class="signature-img" alt="Assinatura"/>` : ' '}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                   </div>
              </div>

          </body>
          </html>
      `;

      try {
          // 2. Gerar o PDF a partir do HTML
          const { uri } = await Print.printToFileAsync({ html: htmlContent });
          console.log('[PDF] Ficheiro PDF gerado em:', uri);

          // 3. Partilhar o PDF
          await shareAsync(uri, { dialogTitle: 'Partilhar ou Salvar PDF do Formulário', mimeType: 'application/pdf', UTI: '.pdf' });
          console.log('[PDF] Partilha iniciada.');

      } catch (error) {
          console.error('[PDF] Erro ao gerar ou partilhar PDF:', error);
          Alert.alert('Erro PDF', 'Não foi possível gerar ou partilhar o ficheiro PDF.');
      } finally {
          setIsSaving(false);
      }
  };

  // --- Renderização ---
  if (isLoading) { /* ... loading ... */ }
  if (!formTemplate || !filledForm) { /* ... error ... */ }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoiding} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
          {/* Adiciona botão de PDF no header */}
          <Stack.Screen
            options={{
              title: formTitle,
              headerRight: () => (
                <Button onPress={generateAndSharePdf} title="PDF" color={colors.tint} disabled={isSaving} />
              ),
            }}
          />
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <SectionCard title="Cabeçalho">
              {formTemplate.headerFields.map((item: any) => {
                 // Renderiza campos do cabeçalho (sem lógica isDisabled aqui)
                 const headerKey = item.label.toLowerCase().replace(/[^a-z0-9_]/g, '_');
                 const handleHeaderItemChange = (itemId: number, field: keyof Omit<IFilledItemResponse, 'id' | 'filledFormInstanceId' | 'formTemplateItemId'>, value: string | null) => {
                     if(field === 'responseValue' || field === 'signatureValueBase64') { handleHeaderChange(itemId, value); } // Atualiza para signature também
                 };
                 const simulatedResponse: IFilledItemResponse = {
                     id: `header_${item.id}`,
                     filledFormInstanceId: filledForm?.id ?? '',
                     formTemplateItemId: item.id,
                     responseValue: headerData[headerKey] ?? null,
                     signatureValueBase64: item.itemType === FormItemType.SIGNATURE ? (headerData[headerKey] ?? null) : null // Passa assinatura para o renderer
                 };
                 // Garante que order e isRequired existem (fallback para 0 e false se não definidos)
                 const itemWithRequiredProps = {
                   ...item,
                   order:  item.order === 'number' ? item.order : 0,
                   isRequired:  item.isRequired === 'boolean' ? item.isRequired : false,
                 };
                 return (<FormItemRenderer key={`header-${item.id}`} itemDefinition={itemWithRequiredProps} currentResponse={simulatedResponse} onResponseChange={handleHeaderItemChange} isDisabled={false} />);
              })}
            </SectionCard>

            {formTemplate && formTemplate.sections.map((section: { id: any; name: any; items: any[]; }) => (
              <SectionCard key={section.id} title={section.name}>
                {section.items.map((item, index) => { // Adiciona index aqui
                  const response = filledForm ? filledForm.responses.find(r => r.formTemplateItemId === item.id) : undefined;
                  // Lógica isDisabled removida conforme a mudança de ideia
                  // let isDisabled = false;
                  // if (index > 0) { ... }
                  if (!response) { /* ... erro ... */ }
                  return (<FormItemRenderer key={item.id} itemDefinition={item} currentResponse={response} onResponseChange={handleResponseChange} isDisabled={false} />); // Passa isDisabled={false}
                })}
              </SectionCard>
            ))}
          </ScrollView>

          {/* Footer: Remover botão de submit, adicionar botão de exportar PDF? Ou manter ambos? */}
          {/* Por agora, manteremos Salvar Rascunho e adicionamos Exportar PDF no header */}
          <ActionFooter
            onSaveDraft={saveDraft}
            onSubmit={submitForm} // Renomear para algo como "Marcar como Concluído" ou remover
            isSaving={isSaving}
            submitText="Concluir Edição" // Mudar texto
            // draftText="Salvar Alterações"
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