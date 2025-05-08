// Localização: app/services/syncService.ts (Crie a pasta app/services se não existir)
import NetInfo from '@react-native-community/netinfo'; // Para verificar conectividade
import { Alert } from 'react-native';
import {
    getPendingSyncForms,
    updateFormStatus,

} from '@/app/data/filledFormRepository'; // Ajuste o caminho
import { syncFilledForms as syncFormsApi } from '@/app/api/formService'; // Importa a função da API
import { IFilledFormSyncDto, FilledFormStatus } from '@/app/models/FormTypes'; // Ajuste o caminho

// Estado para evitar múltiplas sincronizações simultâneas
let isSyncing = false;

/**
 * Tenta sincronizar todos os formulários com status PENDING_SYNC.
 * Verifica a conectividade antes de tentar.
 * @param showFeedback Define se alertas devem ser mostrados ao utilizador (útil para sync manual).
 * @returns Promise que resolve para true se a sincronização foi tentada (online), false se offline.
 */
export const attemptSyncPendingForms = async (showFeedback: boolean = false): Promise<boolean> => {
    if (isSyncing) {
        console.log('[syncService] Sincronização já está em andamento.');
        if (showFeedback) Alert.alert("Sincronização", "Processo já em andamento.");
        return false; // Já está a sincronizar
    }

    console.log('[syncService] A verificar conectividade...');
    const netState = await NetInfo.fetch();

    if (!netState.isConnected || !netState.isInternetReachable) {
        console.log('[syncService] Sem conexão com a internet. Sincronização adiada.');
        if (showFeedback) Alert.alert("Sem Conexão", "Não há conexão com a internet para sincronizar os formulários.");
        return false; // Offline
    }

    console.log('[syncService] Conectado. A iniciar processo de sincronização...');
    isSyncing = true;
    let formsSyncedCount = 0;
    let formsWithErrorCount = 0;

    try {
        const pendingForms = await getPendingSyncForms();
        if (pendingForms.length === 0) {
            console.log('[syncService] Nenhum formulário pendente para sincronizar.');
            if (showFeedback) Alert.alert("Sincronização", "Nenhum formulário pendente para sincronizar.");
            isSyncing = false;
            return true; // Online, mas nada a fazer
        }

        console.log(`[syncService] Encontrados ${pendingForms.length} formulários pendentes. A preparar para envio...`);

        // Mapeia as instâncias completas para o DTO esperado pela API
        const formsToSyncDto: IFilledFormSyncDto[] = pendingForms.map(form => ({
            id: form.id,
            formTemplateId: form.formTemplateId,
            formTemplateVersion: form.formTemplateVersion,
            // filledByUserId é obtido pelo backend a partir do token
            status: form.status, // Envia o status atual (PENDING_SYNC)
            deviceCreatedAt: form.deviceCreatedAt,
            deviceSubmittedAt: form.deviceSubmittedAt,
            headerDataJson: form.headerDataJson,
            generalObservations: form.generalObservations,
            signatureBase64: form.signatureBase64,
            // Mapeia as respostas, omitindo filledFormInstanceId
            responses: form.responses.map(({ filledFormInstanceId, ...rest }) => rest),
        }));

        // Chama a API
        const syncResult = await syncFormsApi(formsToSyncDto);

        // Processa a resposta do lote
        console.log('[syncService] Processando resposta da sincronização...');
        await Promise.all(syncResult.results.map(async (itemResult) => {
            if (itemResult.success) {
                formsSyncedCount++;
                // Atualiza status local para SYNCED e guarda data de recebimento do servidor (se houver)
                // A API backend não retorna serverReceivedAt, então usamos a data atual ou null.
                // Idealmente, a API poderia retornar a data que salvou.
                await updateFormStatus(itemResult.clientId, FilledFormStatus.SYNCED, new Date().toISOString());
            } else {
                formsWithErrorCount++;
                console.error(`[syncService] Erro ao sincronizar formulário ${itemResult.clientId}: ${itemResult.message}`);
                // Atualiza status local para ERROR e guarda a mensagem de erro
                await updateFormStatus(itemResult.clientId, FilledFormStatus.ERROR, null, itemResult.message);
            }
        }));

        console.log(`[syncService] Sincronização concluída. Sucesso: ${formsSyncedCount}, Erros: ${formsWithErrorCount}`);
        if (showFeedback) {
            let feedbackMessage = `${formsSyncedCount} formulário(s) sincronizado(s) com sucesso.`;
            if (formsWithErrorCount > 0) {
                feedbackMessage += `\n${formsWithErrorCount} formulário(s) falharam ao sincronizar. Verifique a lista para detalhes.`;
                Alert.alert("Sincronização Concluída com Erros", feedbackMessage);
            } else {
                Alert.alert("Sincronização Concluída", feedbackMessage);
            }
        }

    } catch (error) {
        console.error('[syncService] Erro inesperado durante o processo de sincronização:', error);
        if (showFeedback) Alert.alert("Erro de Sincronização", "Ocorreu um erro inesperado durante a sincronização.");
        // Não atualiza o status dos formulários locais se a chamada geral falhar,
        // eles permanecerão como PENDING_SYNC para a próxima tentativa.
    } finally {
        isSyncing = false; // Libera o bloqueio de sincronização
    }
    return true; // Indica que a tentativa de sincronização ocorreu (estava online)
};

/**
 * Configura um listener para tentar sincronizar automaticamente quando a conexão voltar.
 * (Esta função deve ser chamada uma vez na inicialização do app)
 */
export const setupAutomaticSyncOnConnection = () => {
    console.log("[syncService] A configurar listener de conexão de rede...");
    // Remove listener anterior, se houver, para evitar duplicação
    const unsubscribe = NetInfo.addEventListener(state => {
        console.log("[syncService] Estado da conexão mudou:", state.isConnected, state.isInternetReachable);
        if (state.isConnected && state.isInternetReachable) {
            console.log("[syncService] Conexão detectada. A tentar sincronização automática...");
            // Adiciona um pequeno delay para garantir que a rede esteja estável
            setTimeout(() => {
                attemptSyncPendingForms(false); // Tenta sincronizar sem mostrar feedback ao utilizador
            }, 5000); // Delay de 5 segundos
        }
    });
    console.log("[syncService] Listener de conexão configurado.");
    // Retornar a função de unsubscribe pode ser útil se precisar desativar o listener
    return unsubscribe;
};
