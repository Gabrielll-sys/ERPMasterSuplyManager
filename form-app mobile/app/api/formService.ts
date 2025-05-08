import apiClient from './apiClient'; // Importa a instância configurada do Axios
import {
    IFilledFormSyncDto,
    IBatchSyncResponseDto,
    // Importar outros DTOs se precisar de funções para buscar templates/detalhes do backend
    // IFormTemplateBasicDto,
    // IFormTemplateDetailDto
} from '@/app/models/FormTypes'; // Ajuste o caminho se necessário

/**
 * Envia um lote de formulários preenchidos para sincronização com o backend.
 * @param formsToSync Array de objetos IFilledFormSyncDto.
 * @returns Promise que resolve com IBatchSyncResponseDto do backend.
 */
export const syncFilledForms = async (formsToSync: IFilledFormSyncDto[]): Promise<IBatchSyncResponseDto> => {
    console.log(`[formService] A enviar ${formsToSync.length} formulários para sincronização...`);
    try {
        // Faz a requisição POST para o endpoint de sincronização
        const response = await apiClient.post<IBatchSyncResponseDto>('/filledforms/sync', formsToSync);
        console.log('[formService] Resposta da sincronização recebida:', response.status);
        // Retorna os dados da resposta (o objeto BatchSyncResponseDto)
        return response.data;
    } catch (error: any) {
        console.error('[formService] Erro durante a sincronização:', error);
        // Em caso de erro na chamada API (tratado pelo interceptor ou não),
        // podemos retornar um objeto de resposta de erro padrão ou relançar.
        // Retornar um objeto padrão pode facilitar o tratamento na camada de serviço de sincronização.
        const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido na sincronização';
        // Cria uma resposta de erro para todos os formulários enviados no lote
        const errorResponse: IBatchSyncResponseDto = {
            overallSuccess: false,
            results: formsToSync.map(form => ({
                clientId: form.id,
                success: false,
                message: `Falha na comunicação com a API: ${errorMessage}`,
                serverId: form.id // Mantém o ID do cliente
            }))
        };
        return errorResponse;
        // Ou: throw error; // Relança o erro para ser tratado mais acima
    }
};