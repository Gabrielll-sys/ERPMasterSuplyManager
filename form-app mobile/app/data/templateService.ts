// Localização: app/data/templateService.ts
import {
    ALL_FORM_TEMPLATES,
    getFormTemplateById as getHardcodedTemplateById,
  } from './formTemplates'; // Importa os templates hardcoded
  import { IFormTemplate } from '@/app/models/FormTypes'; // Ajuste o caminho se necessário
  
  /**
   * Obtém todos os modelos de formulário disponíveis (hardcoded).
   * @returns Um array de IFormTemplate.
   */
  export const getAvailableFormTemplates = (): IFormTemplate[] => {
    // Simplesmente retorna o array de templates hardcoded.
    // No futuro, se os templates fossem parcialmente do servidor e parcialmente locais,
    // esta função poderia combinar as fontes.
    return ALL_FORM_TEMPLATES;
  };
  
  /**
   * Obtém a estrutura de um modelo de formulário específico pelo seu ID local.
   * @param id O ID local do modelo de formulário (ex: CHECKLIST_MONTAGEM_PAINEL_ID).
   * @returns O IFormTemplate correspondente ou undefined se não encontrado.
   */
  export const getFormTemplateStructureById = (id: number): IFormTemplate | undefined => {
    return getHardcodedTemplateById(id);
  };
  
  // Poderia adicionar mais funções aqui se necessário, por exemplo,
  // para buscar um template pelo nome, etc.
  