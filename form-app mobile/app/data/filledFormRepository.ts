// Localização: app/data/filledFormRepository.ts
import * as Random from 'expo-random';
// *** IMPORTANTE: Importar getDatabase em vez de db diretamente ***
import { getDatabase } from './database';
import {
  IFilledFormInstance,
  IFilledItemResponse,
  FilledFormStatus,
  IFormTemplate,
} from '@/app/models/FormTypes'; // Verifique se o caminho para models está correto

/**
 * Gera um GUID (UUID v4).
 */
const generateGuid = (): string => {
  const byteArray = Random.getRandomBytes(16);
  byteArray[6] = (byteArray[6] & 0x0f) | 0x40; // version 4
  byteArray[8] = (byteArray[8] & 0x3f) | 0x80; // variant RFC 4122
  return Array.from(byteArray, byte => byte.toString(16).padStart(2, '0')).join('')
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
};

/**
 * Salva ou atualiza uma instância de formulário preenchido.
 */
export const saveOrUpdateFilledForm = async (form: IFilledFormInstance): Promise<void> => {
  // *** ADICIONADO: Obter a instância do DB inicializada ***
  const db = await getDatabase();
  console.log('[Repo] A tentar salvar/atualizar formulário local ID:', form.id);
  try {
    await db.withTransactionAsync(async () => {
      const existingForm = await db.getFirstAsync<IFilledFormInstance>(
        `SELECT id FROM FilledFormInstances WHERE id = ?;`, // Query mais leve para verificar existência
        [form.id]
      );

      if (existingForm) {
        console.log('[Repo] Formulário existente encontrado, a atualizar:', form.id);
        await db.runAsync(
          `UPDATE FilledFormInstances SET
            formTemplateId = ?, formTemplateVersion = ?, filledByUserId = ?, status = ?,
            deviceCreatedAt = ?, deviceSubmittedAt = ?, serverReceivedAt = ?,
            headerDataJson = ?, generalObservations = ?, signatureBase64 = ?,
            syncErrorMessage = ?
          WHERE id = ?;`,
          [
            form.formTemplateId, form.formTemplateVersion, form.filledByUserId ?? null, form.status,
            form.deviceCreatedAt, form.deviceSubmittedAt ?? null, form.serverReceivedAt ?? null,
            form.headerDataJson, form.generalObservations ?? null, form.signatureBase64 ?? null,
            form.syncErrorMessage ?? null, form.id,
          ]
        );
        await db.runAsync(`DELETE FROM FilledItemResponses WHERE filledFormInstanceId = ?;`, [form.id]);
      } else {
        console.log('[Repo] Formulário novo, a inserir:', form.id);
        await db.runAsync(
          `INSERT INTO FilledFormInstances (
            id, formTemplateId, formTemplateVersion, filledByUserId, status,
            deviceCreatedAt, deviceSubmittedAt, serverReceivedAt, headerDataJson,
            generalObservations, signatureBase64, syncErrorMessage
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            form.id, form.formTemplateId, form.formTemplateVersion, form.filledByUserId ?? null, form.status,
            form.deviceCreatedAt, form.deviceSubmittedAt ?? null, form.serverReceivedAt ?? null,
            form.headerDataJson, form.generalObservations ?? null, form.signatureBase64 ?? null,
            form.syncErrorMessage ?? null,
          ]
        );
      }

      // Inserir/Re-inserir todas as respostas
      if (form.responses && form.responses.length > 0) {
          const insertResponseStatement = await db.prepareAsync(
              `INSERT INTO FilledItemResponses (
                id, filledFormInstanceId, formTemplateItemId, responseValue, observationText, signatureValueBase64
              ) VALUES (?, ?, ?, ?, ?, ?);`
          );
          try {
              for (const response of form.responses) {
                  await insertResponseStatement.executeAsync([
                      response.id,
                      form.id,
                      response.formTemplateItemId,
                      response.responseValue ?? null,
                      response.observationText ?? null,
                      response.signatureValueBase64 ?? null,
                  ]);
              }
          } finally {
              await insertResponseStatement.finalizeAsync();
          }
      }
    });
    console.log('[Repo] Formulário local ID:', form.id, 'salvo/atualizado com sucesso.');
  } catch (error) {
    console.error('[Repo] Erro ao salvar/atualizar formulário local:', form.id, error);
    throw error;
  }
};

/**
 * Cria uma nova instância de formulário vazia (rascunho) em memória.
 */
export const createNewDraftForm = (template: IFormTemplate, userId: number): IFilledFormInstance => {
  // Esta função não acede ao DB, mantida como estava.
  const newInstanceId = generateGuid();
  const now = new Date().toISOString();
  const headerData: Record<string, any> = {};
  template.headerFields.forEach(field => {
    const key = field.label.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    headerData[key] = field.defaultValue ?? null;
  });
  const draftForm: IFilledFormInstance = {
    id: newInstanceId,
    formTemplateId: template.id,
    formTemplateVersion: template.version,
    filledByUserId: userId,
    status: FilledFormStatus.DRAFT,
    deviceCreatedAt: now,
    headerDataJson: JSON.stringify(headerData),
    responses: [],
  };
  template.sections.forEach((section: { items: any[]; }) => {
    section.items.forEach(item => {
      draftForm.responses.push({
        id: generateGuid(),
        filledFormInstanceId: newInstanceId,
        formTemplateItemId: item.id,
        responseValue: item.defaultValue ?? null,
        observationText: null,
        signatureValueBase64: null,
      });
    });
  });
  return draftForm;
};

/**
 * Busca uma instância de formulário preenchido pelo seu ID local.
 */
export const getFilledFormById = async (instanceId: string): Promise<IFilledFormInstance | null> => {
  // *** ADICIONADO: Obter a instância do DB inicializada ***
  const db = await getDatabase();
  console.log('[Repo] Buscando formulário por ID:', instanceId);
  try {
    const formInstanceRaw = await db.getFirstAsync<Omit<IFilledFormInstance, 'responses'>>(
      `SELECT * FROM FilledFormInstances WHERE id = ?;`,
      [instanceId]
    );

    if (!formInstanceRaw) {
      console.log('[Repo] Formulário não encontrado:', instanceId);
      return null;
    }

    const responses = await db.getAllAsync<IFilledItemResponse>(
      `SELECT * FROM FilledItemResponses WHERE filledFormInstanceId = ?;`,
      [instanceId]
    );
    console.log(`[Repo] Encontradas ${responses.length} respostas para o formulário ${instanceId}`);

    return {
      ...formInstanceRaw,
      status: formInstanceRaw.status as FilledFormStatus,
      responses: responses ?? [],
    };
  } catch (error) {
    console.error('[Repo] Erro ao buscar formulário preenchido por ID:', instanceId, error);
    throw error;
  }
};

/**
 * Busca um resumo de todos os formulários preenchidos.
 */
export const getAllFilledFormsSummary = async (): Promise<Array<Omit<IFilledFormInstance, 'responses'>>> => {
  // *** ADICIONADO: Obter a instância do DB inicializada ***
  const db = await getDatabase();
  console.log('[Repo] Buscando resumo de todos os formulários...');
  try {
    const results = await db.getAllAsync<Omit<IFilledFormInstance, 'responses'>>(
      `SELECT id, formTemplateId, formTemplateVersion, filledByUserId, status, deviceCreatedAt, deviceSubmittedAt, headerDataJson, generalObservations, signatureBase64, syncErrorMessage
       FROM FilledFormInstances
       ORDER BY deviceCreatedAt DESC;`
    );
    console.log(`[Repo] Encontrados ${results.length} resumos de formulários.`);
    return results.map(form => ({
        ...form,
        status: form.status as FilledFormStatus
    }));
  } catch (error) {
    // O erro "no such table" ou "cannot read property 'getAllAsync'" acontecerá aqui se a inicialização falhar
    console.error('[Repo] Erro ao buscar resumo de todos os formulários preenchidos:', error);
    throw error;
  }
};

/**
 * Busca todos os formulários pendentes de sincronização.
 */
export const getPendingSyncForms = async (): Promise<IFilledFormInstance[]> => {
  // *** ADICIONADO: Obter a instância do DB inicializada ***
  const db = await getDatabase();
  console.log('[Repo] Buscando formulários pendentes de sincronização...');
  try {
    const results = await db.getAllAsync<{ id: string }>(
      `SELECT id FROM FilledFormInstances WHERE status = ?;`,
      [FilledFormStatus.PENDING_SYNC]
    );
    console.log(`[Repo] Encontrados ${results.length} formulários pendentes.`);

    const forms: IFilledFormInstance[] = [];
    await Promise.all(results.map(async (row) => {
        const fullForm = await getFilledFormById(row.id); // Reutiliza a busca detalhada (que já chama getDatabase)
        if (fullForm) {
            forms.push(fullForm);
        }
    }));
    return forms;
  } catch (error) {
    console.error('[Repo] Erro ao buscar formulários pendentes de sincronização:', error);
    throw error;
  }
};

/**
 * Atualiza o status de uma instância de formulário preenchido.
 */
export const updateFormStatus = async (
  instanceId: string,
  status: FilledFormStatus,
  serverReceivedAt?: string | null,
  errorMessage?: string | null
): Promise<void> => {
  // *** ADICIONADO: Obter a instância do DB inicializada ***
  const db = await getDatabase();
  console.log(`[Repo] Atualizando status do formulário ID: ${instanceId} para ${status}`);
  try {
    await db.runAsync(
      `UPDATE FilledFormInstances SET status = ?, serverReceivedAt = ?, syncErrorMessage = ? WHERE id = ?;`,
      [
        status,
        serverReceivedAt ?? null,
        errorMessage ?? null,
        instanceId
      ]
    );
  } catch (error) {
    console.error(`[Repo] Erro ao atualizar status do formulário ID: ${instanceId}`, error);
    throw error;
  }
};

/**
 * Deleta uma instância de formulário preenchido localmente.
 */
export const deleteFilledFormLocal = async (instanceId: string): Promise<void> => {
   // *** ADICIONADO: Obter a instância do DB inicializada ***
   const db = await getDatabase();
   console.log(`[Repo] Deletando formulário local ID: ${instanceId}`);
   try {
     await db.withTransactionAsync(async () => {
        await db.runAsync(`DELETE FROM FilledItemResponses WHERE filledFormInstanceId = ?;`, [instanceId]);
        await db.runAsync(`DELETE FROM FilledFormInstances WHERE id = ?;`, [instanceId]);
     });
    console.log(`[Repo] Formulário local ID: ${instanceId} deletado com sucesso.`);
  } catch (error) {
    console.error(`[Repo] Erro ao deletar formulário local ID: ${instanceId}`, error);
    throw error;
  }
};
