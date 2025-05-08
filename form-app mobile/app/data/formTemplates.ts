// Localização: app/data/formTemplates.ts
import { IFormTemplate, FormItemType } from '@/app/models/FormTypes'; // Ajuste o caminho se necessário

// Modelo para "Checklist de Montagem de Painel"
export const CHECKLIST_MONTAGEM_PAINEL_ID = 1; // Defina um ID único para este template
export const checklistMontagemPainelTemplate: IFormTemplate = {
  id: CHECKLIST_MONTAGEM_PAINEL_ID, // Usado para identificar o template
  name: "Checklist de Montagem de Painel",
  version: 1, // Versão inicial do template no app
  description: "Checklist para verificar etapas da montagem de painéis elétricos (7H)",
  headerFields: [
    { id: 1001, label: "EQUIPAMENTO", itemType: FormItemType.TEXT_SHORT, order: 1, isRequired: true, placeholder: "Ex: Moinho de Barras" },
    { id: 1002, label: "ORDEM DE SERVIÇO", itemType: FormItemType.TEXT_SHORT, order: 2, isRequired: true, placeholder: "Ex: 5023" },
    { id: 1003, label: "TENSÃO", itemType: FormItemType.TEXT_SHORT, order: 3, isRequired: false, placeholder: "Ex: 380V" },
    { id: 1004, label: "INÍCIO DE MONTAGEM (Data/Hora)", itemType: FormItemType.DATETIME, order: 4, isRequired: false },
    { id: 1005, label: "FIM DA MONTAGEM (Data/Hora)", itemType: FormItemType.DATETIME, order: 5, isRequired: false },
    { id: 1006, label: "ASS. RESPONSÁVEL PELA MONTAGEM", itemType: FormItemType.SIGNATURE, order: 6, isRequired: false },
    { id: 1007, label: "ASS. INSPETOR DA MONTAGEM", itemType: FormItemType.SIGNATURE, order: 7, isRequired: false }
  ],
  sections: [
    {
      id: 2001,
      name: "PREPARAÇÃO",
      order: 1,
      items: [
        { id: 3001, label: "REVISAR MEDIDAS DE LAYOUT", itemType: FormItemType.OK_NC_OBS, order: 1, isRequired: true },
        { id: 3002, label: "CONFERIR LEGENDAS DO PROJETO", itemType: FormItemType.OK_NC_OBS, order: 2, isRequired: false },
        { id: 3003, label: "CONFRONTAR TENSÃO E COMPONENTES DO DIAGRAMA COM O LAYOUT", itemType: FormItemType.OK_NC_OBS, order: 3, isRequired: false },
        { id: 3004, label: "CONFIRMAR SUFICIÊNCIA DE ANILHAS", itemType: FormItemType.OK_NC_OBS, order: 4, isRequired: false },
        { id: 3005, label: "CONFRONTAR LISTA DE MATERIAIS COM O DIAGRAMA", itemType: FormItemType.OK_NC_OBS, order: 5, isRequired: false },
        { id: 3006, label: "INÍCIO DE FASE (DATA/HORA)", itemType: FormItemType.SECTION_DATETIME, order: 101, isRequired: false }, // Usando IDs únicos para itens
        { id: 3007, label: "FIM DE FASE (DATA/HORA)", itemType: FormItemType.SECTION_DATETIME, order: 102, isRequired: false },
        { id: 3008, label: "Observações (Preparação)", itemType: FormItemType.SECTION_OBSERVATIONS, order: 103, isRequired: false, placeholder:"Prazo máximo de 30min" },
        { id: 3009, label: "ASSINATURA DO RESPONSÁVEL (Preparação)", itemType: FormItemType.SIGNATURE, order: 104, isRequired: false }
      ]
    },
    {
      id: 2002,
      name: "MONTAGEM MECÂNICA",
      order: 2,
      items: [
        { id: 3010, label: "IDENTIFICAR CAIXA (OS / nome do equipamento / tensão)", itemType: FormItemType.OK_NC_OBS, order: 1, isRequired: false },
        { id: 3011, label: "CONFIRMAR POSIÇÃO DA PORTA ANTES DE CORTAR", itemType: FormItemType.OK_NC_OBS, order: 2, isRequired: false },
        { id: 3012, label: "CONFIRMAR A SUFICIÊNCIA DO ESPAÇO DOS COMPONENTES NO ESPELHO", itemType: FormItemType.OK_NC_OBS, order: 3, isRequired: false },
        { id: 3013, label: "CONFERIR INTEGRIDADE DAS FERRAMENTAS", itemType: FormItemType.OK_NC_OBS, order: 4, isRequired: false },
        { id: 3014, label: "IDENTIFICAR COMPONENTES (D1, Q1, RS, etc)", itemType: FormItemType.OK_NC_OBS, order: 5, isRequired: false },
        { id: 3015, label: "TEMOS TODOS OS MATERIAIS?", itemType: FormItemType.OK_NC_OBS, order: 6, isRequired: false },
        { id: 3016, label: "CONFERIR SE TODOS OS COMPONENTES SÃO 24VCA", itemType: FormItemType.OK_NC_OBS, order: 7, isRequired: false },
        { id: 3017, label: "CONFIRMAR QUE OS COMPONENTES NÃO ESTEJAM DANIFICADOS", itemType: FormItemType.OK_NC_OBS, order: 8, isRequired: false },
        { id: 3018, label: "INSTALAR CANALETAS NA PORTA", itemType: FormItemType.OK_NC_OBS, order: 9, isRequired: false },
        { id: 3019, label: "IDENTIFICAR CABOS", itemType: FormItemType.OK_NC_OBS, order: 10, isRequired: false },
        { id: 3020, label: "CONFIRMAR APERTO NOS CABOS", itemType: FormItemType.OK_NC_OBS, order: 11, isRequired: false },
        { id: 3021, label: "ATERRAR PORTA", itemType: FormItemType.OK_NC_OBS, order: 12, isRequired: false },
        { id: 3022, label: "ATERRAR ESPELHO", itemType: FormItemType.OK_NC_OBS, order: 13, isRequired: false },
        { id: 3023, label: "VERIFICAR O FECHAMENTO DO TRANSFORMADOR", itemType: FormItemType.OK_NC_OBS, order: 14, isRequired: false },
        { id: 3024, label: "INÍCIO DE FASE (DATA/HORA)", itemType: FormItemType.SECTION_DATETIME, order: 201, isRequired: false },
        { id: 3025, label: "FIM DE FASE (DATA/HORA)", itemType: FormItemType.SECTION_DATETIME, order: 202, isRequired: false },
        { id: 3026, label: "Observações (Montagem Mecânica)", itemType: FormItemType.SECTION_OBSERVATIONS, order: 203, isRequired: false, placeholder:"Prazo máximo de 2:30h (simples) a 4h (complexos)" },
        { id: 3027, label: "ASSINATURA DO RESPONSÁVEL (Montagem Mecânica)", itemType: FormItemType.SIGNATURE, order: 204, isRequired: false }
      ]
    },
    {
      id: 2003,
      name: "MONTAGEM ELÉTRICA",
      order: 3,
      items: [
        { id: 3028, label: "PLACAS DE IDENTIFICAÇÃO INSTALADAS CONFORME LAYOUT?", itemType: FormItemType.OK_NC_OBS, order: 1, isRequired: false },
        { id: 3029, label: "FOI FEITO TESTE DE CONTINUIDADE? NÃO PULE! TESTAR ANTES DE ENERGIZAR!", itemType: FormItemType.OK_NC_OBS, order: 2, isRequired: true },
        { id: 3030, label: "FOI FEITA A LIMPEZA INTERNA E EXTERNA?", itemType: FormItemType.OK_NC_OBS, order: 3, isRequired: false },
        { id: 3031, label: "MANUAIS DISPONÍVEIS (relé de segurança, temporizador, inversor, etc)?", itemType: FormItemType.OK_NC_OBS, order: 4, isRequired: false },
        { id: 3032, label: "DIAGRAMA ESTÁ ATUALIZADO?", itemType: FormItemType.OK_NC_OBS, order: 5, isRequired: false },
        { id: 3033, label: "CHECKLIST PARA TESTE DE BANCADA DISPONÍVEL?", itemType: FormItemType.OK_NC_OBS, order: 6, isRequired: false },
        { id: 3034, label: "INÍCIO DE FASE (DATA/HORA)", itemType: FormItemType.SECTION_DATETIME, order: 301, isRequired: false },
        { id: 3035, label: "FIM DE FASE (DATA/HORA)", itemType: FormItemType.SECTION_DATETIME, order: 302, isRequired: false },
        { id: 3036, label: "Observações (Montagem Elétrica)", itemType: FormItemType.SECTION_OBSERVATIONS, order: 303, isRequired: false, placeholder:"Prazo máximo de 3h (simples) a 5h (complexos)" },
        { id: 3037, label: "ASSINATURA DO RESPONSÁVEL (Montagem Elétrica)", itemType: FormItemType.SIGNATURE, order: 304, isRequired: false }
      ]
    },
    {
      id: 2004,
      name: "TESTE DE VALIDAÇÃO",
      order: 4,
      items: [
        { id: 3038, label: "Observações (Teste de Validação)", itemType: FormItemType.SECTION_OBSERVATIONS, order: 1, isRequired: false, placeholder:"Prazo máximo de 1h" }
      ]
    }
  ]
};

// Modelo para "Checklist de Teste de Bancada"
export const CHECKLIST_TESTE_BANCADA_ID = 2; // Defina um ID único para este template
export const checklistTesteBancadaTemplate: IFormTemplate = {
  id: CHECKLIST_TESTE_BANCADA_ID,
  name: "Checklist de Teste de Bancada",
  version: 1,
  description: "Checklist para realizar testes de bancada em painéis elétricos.",
  headerFields: [
    { id: 4001, label: "EQUIPAMENTO / ORDEM DE SERVIÇO", itemType: FormItemType.TEXT_SHORT, order: 1, isRequired: true, placeholder: "Preencher Equipamento e OS" },
    { id: 4002, label: "DATA DA LIBERAÇÃO", itemType: FormItemType.DATETIME, order: 2, isRequired: false },
    { id: 4003, label: "ASSINATURA DO RESPONSÁVEL PELO TESTE", itemType: FormItemType.SIGNATURE, order: 3, isRequired: false }
  ],
  sections: [
    {
      id: 5001,
      name: "Itens de Teste",
      order: 1,
      items: [ // Os IDs dos itens devem ser únicos em todo o sistema de templates, ou pelo menos dentro de um template
        { id: 6001, label: "CHECKLIST DE MONTAGEM ACOMPANHA O PAINEL?", itemType: FormItemType.YES_NO, order: 1, isRequired: false },
        { id: 6002, label: "OS COMPONENTES ESTÃO IDENTIFICADOS? (PORTA, COMPONENTES, ETC)", itemType: FormItemType.YES_NO, order: 2, isRequired: false },
        { id: 6003, label: "FECHAMENTO DO TRANSFORMADOR ESTÁ CONFORME A ORDEM DE SERVIÇO?", itemType: FormItemType.YES_NO, order: 3, isRequired: false },
        { id: 6004, label: "TEMPORIZADOR/CHAVE DE ILUMINAÇÃO ESTÃO LIGADOS NA SAÍDA 220V DO TRANSFORMADOR?", itemType: FormItemType.YES_NO, order: 4, isRequired: false },
        { id: 6005, label: "CABOS ESTÃO TODOS IDENTIFICADOS?", itemType: FormItemType.YES_NO, order: 5, isRequired: false },
        { id: 6006, label: "CABOS ESTÃO TODOS COM APERTO ADEQUADO? (efetivar aperto com ch.fenda)", itemType: FormItemType.YES_NO, order: 6, isRequired: false },
        { id: 6007, label: "FOI REALIZADO TESTE DE CONTINUIDADE NO PAINEL?", itemType: FormItemType.YES_NO, order: 7, isRequired: true },
        { id: 6008, label: "QUADRO POSSUI ATERRAMENTO ADEQUADO?", itemType: FormItemType.YES_NO, order: 8, isRequired: false },
        { id: 6009, label: "A TENSÃO DO INVERSOR CORRESPONDE A TENSÃO DA OS?", itemType: FormItemType.YES_NO, order: 9, isRequired: false },
        { id: 6010, label: "CHAVE GERAL E DISJUNTORES ESTÃO DESLIGADOS PARA A LIGAÇÃO DO PLUG DE ALIMENTAÇÃO?", itemType: FormItemType.YES_NO, order: 10, isRequired: false },
        { id: 6011, label: "DISJUNTORES MOTOR ESTÃO ARMANDO (botão preto está acionado)?", itemType: FormItemType.YES_NO, order: 11, isRequired: false },
        { id: 6012, label: "BOTÃO DE RESET FUNCIONA CORRETAMENTE?", itemType: FormItemType.YES_NO, order: 12, isRequired: false },
        { id: 6013, label: "BOTÃO LIGA-DESLIGA FUNCIONA CORRETAMENTE?", itemType: FormItemType.YES_NO, order: 13, isRequired: false },
        { id: 6014, label: "BOTÃO DE EMERGÊNCIA FUNCIONA CORRETAMENTE?", itemType: FormItemType.YES_NO, order: 14, isRequired: false },
        { id: 6015, label: "SINALEIROS ESTÃO FUNCIONANDO CORRETAMENTE?", itemType: FormItemType.YES_NO, order: 15, isRequired: false },
        { id: 6016, label: "QUADRO POSSUI INVERSOR?", itemType: FormItemType.YES_NO, order: 16, isRequired: false },
        { id: 6017, label: "INVERSORES FORAM PRÉ-PARAMETRIZADOS?", itemType: FormItemType.YES_NO, order: 17, isRequired:false },
        { id: 6018, label: "QUADRO POSSUI PRESSOSTATO?", itemType: FormItemType.YES_NO, order: 18, isRequired: false },
        { id: 6019, label: "PRESSOSTATO FUNCIONANDO CORRETAMENTE?", itemType: FormItemType.YES_NO, order: 19, isRequired: false },
        { id: 6020, label: "QUADRO POSSUI TEMPORIZADOR OU CONTADOR DIGITAL?", itemType: FormItemType.YES_NO, order: 20, isRequired: false },
        { id: 6021, label: "TEMPORIZADOR/CONTADOR FOI PARAMETRIZADO CONFORME ESCALA DE TESTE?", itemType: FormItemType.YES_NO, order: 21, isRequired: false },
        { id: 6022, label: "QUADRO ESTÁ DEVIDAMENTE ASPIRADO E LIMPO?", itemType: FormItemType.YES_NO, order: 22, isRequired: false },
        { id: 6023, label: "ETIQUETA DE CONTROLE DE QUALIDADE ACOMPANHA O PAINEL?", itemType: FormItemType.YES_NO, order: 23, isRequired: false },
        { id: 6024, label: "PLACAS DE OPERAÇÃO ESTÃO DEVIDAMENTE INSTALADAS?", itemType: FormItemType.YES_NO, order: 24, isRequired: false },
        { id: 6025, label: "TESTE FOI DOCUMENTADO EM FOTOS E VÍDEOS?", itemType: FormItemType.YES_NO, order: 25, isRequired: false },
        { id: 6026, label: "HOUVE TRINCO PORTA CADEADO?", itemType: FormItemType.YES_NO, order: 26, isRequired: false },
        { id: 6027, label: "DIAGRAMA ELÉTRICO ACOMPANHA O PAINEL?", itemType: FormItemType.YES_NO, order: 27, isRequired: false },
        { id: 6028, label: "HOUVE ALTERAÇÃO NO DIAGRAMA ELÉTRICO?", itemType: FormItemType.YES_NO, order: 28, isRequired: false },
        { id: 6029, label: "ATUALIZAÇÃO DO DIAGRAMA FOI REGISTRADA E IMPRESSO NOVO DIAGRAMA?", itemType: FormItemType.YES_NO, order: 29, isRequired: false },
        { id: 6030, label: "MANUAIS DE COMPONENTES ACOMPANHAM O PAINEL? (inversor, temporizador, controlador temperatura, relé de segurança)", itemType: FormItemType.YES_NO, order: 30, isRequired: false },
        { id: 6031, label: "DETALHAMENTOS IMPORTANTES:", itemType: FormItemType.TEXT_LONG, order: 31, isRequired: false, placeholder:"Detalhes adicionais sobre o teste"},
        { id: 6032, label: "OBSERVAÇÕES GERAIS:", itemType: FormItemType.TEXT_LONG, order: 32, isRequired: false, placeholder:"Observações finais" }
      ]
    }
  ]
};

// Array com todos os templates disponíveis no app
export const ALL_FORM_TEMPLATES: IFormTemplate[] = [
  checklistMontagemPainelTemplate,
  checklistTesteBancadaTemplate,
];

// Função para obter um template específico pelo seu ID (local)
export const getFormTemplateById = (id: number): IFormTemplate | undefined => {
  return ALL_FORM_TEMPLATES.find(template => template.id === id);
};
