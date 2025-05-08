// Localização: app/models/FormTypes.ts

// Enum para os tipos de item do formulário (deve espelhar o enum do backend)
export enum FormItemType {
    TEXT_SHORT = 'TEXT_SHORT',
    TEXT_LONG = 'TEXT_LONG',
    NUMBER = 'NUMBER',
    DATETIME = 'DATETIME',
    OK_NC = 'OK_NC', // OK, Não Conforme
    OK_NC_OBS = 'OK_NC_OBS', // OK, Não Conforme + Observação
    YES_NO = 'YES_NO',
    SIGNATURE = 'SIGNATURE',
    SECTION_DATETIME = 'SECTION_DATETIME', // Apenas para renderização de um campo de data numa seção
    SECTION_OBSERVATIONS = 'SECTION_OBSERVATIONS', // Apenas para renderização de um campo de observação numa seção
    // Adicionar outros tipos conforme o seu backend, ex: DROPDOWN, CHECKBOX_GROUP
  }
  
  // Interface para um item (campo/pergunta) dentro de um modelo de formulário
  export interface IFormTemplateItem {
    id: number; // ID do backend
    label: string;
    itemType: FormItemType;
    order: number;
    isRequired: boolean;
    placeholder?: string;
    optionsJson?: string; // Para tipos como dropdown, radio (JSON stringificado)
    defaultValue?: string;
  }
  
  // Interface para uma seção dentro de um modelo de formulário
  export interface IFormTemplateSection {
    id: number; // ID do backend
    name: string;
    order: number;
    items: IFormTemplateItem[];
  }
  
  // Interface para o modelo de formulário completo (baixado do servidor)
  export interface IFormTemplate {
    id: number; // ID do backend (da primeira versão ou ID raiz que agrupa versões)
    name: string;
    version: number;
    description?: string;
    headerFields: IFormTemplateItem[];
    sections: IFormTemplateSection[];
    // Adicionar quaisquer outros campos que vêm do FormTemplateDetailDto do backend
  }
  
  // Interface para uma resposta de um item preenchido (armazenado localmente e enviado para sync)
  export interface IFilledItemResponse {
    id: string; // GUID gerado no cliente
    filledFormInstanceId: string; // FK para a instância local
    formTemplateItemId: number; // ID do item do modelo original
    responseValue?: string | null; // Valor da resposta (OK, NC, texto, número, data ISO, base64 da assinatura se curta)
    observationText?: string | null;
    signatureValueBase64?: string | null; // Para o caso de um FormTemplateItem ser do tipo SIGNATURE
  }
  
  // Enum para o status de um formulário preenchido (deve espelhar o enum do backend)
  export enum FilledFormStatus {
    DRAFT = 'DRAFT', // Rascunho no dispositivo
    PENDING_SYNC = 'PENDING_SYNC', // Finalizado, aguardando envio
    SYNCED = 'SYNCED', // Sincronizado com o servidor
    ERROR = 'ERROR', // Erro durante a sincronização
  }
  
  // Interface para uma instância de formulário preenchido (armazenado localmente e enviado para sync)
  export interface IFilledFormInstance {
    id: string; // GUID gerado no cliente (PK local e para sync)
    formTemplateId: number; // ID do FormTemplate do backend
    formTemplateVersion: number;
    filledByUserId: number; // ID do usuário logado (do seu sistema de autenticação no app)
    status: FilledFormStatus;
    deviceCreatedAt: string; // ISO Date string
    deviceSubmittedAt?: string | null; // ISO Date string
    serverReceivedAt?: string | null; // ISO Date string (preenchido pelo backend)
    headerDataJson: string; // JSON stringificado dos campos do cabeçalho preenchidos
    generalObservations?: string | null;
    signatureBase64?: string | null; // Assinatura principal do formulário
    syncErrorMessage?: string | null;
    responses: IFilledItemResponse[]; // Respostas aninhadas
  }
  
  // DTO para sincronização (espelha o FilledFormSyncDto do backend)
  export interface IFilledFormSyncDto {
    id: string;
    formTemplateId: number;
    formTemplateVersion: number;
    status: FilledFormStatus; // O app enviará PENDING_SYNC
    deviceCreatedAt: string;
    deviceSubmittedAt?: string | null;
    headerDataJson: string;
    generalObservations?: string | null;
    signatureBase64?: string | null;
    responses: Array<Omit<IFilledItemResponse, 'filledFormInstanceId'>>; // Respostas sem o ID da instância pai, já que está no objeto pai
  }
  
  // DTO para o resultado da sincronização de um item (espelha o SyncResponseItemDto do backend)
  export interface ISyncResponseItemDto {
      clientId: string;
      success: boolean;
      message?: string;
      serverId?: string; // O ID do servidor (que será o mesmo GUID do cliente)
  }
  
  // DTO para o resultado do lote de sincronização (espelha o BatchSyncResponseDto do backend)
  export interface IBatchSyncResponseDto {
      results: ISyncResponseItemDto[];
      overallSuccess: boolean;
  }
  