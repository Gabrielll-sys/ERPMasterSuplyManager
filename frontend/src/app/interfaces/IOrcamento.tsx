 export interface IOrcamento {
    id?: number;
    responsavelOrcamento?: string | null;
    nomeCliente?: string;
    empresa?: string;
    emailCliente?: string;
    responsavelVenda?: string;
    dataOrcamento?: Date;
    nomeOrcamento?: string;
    observacoes?: string;
    desconto?: number;
    acrescimo?: number;
    precoVendaTotal?: number;
    precoVendaComDesconto?: number;
    dataVenda?: Date;
    isPayed?: boolean;
    telefone?: string;
    endereco?: string;
    cpfOrCnpj?: string;
    tipoPagamento?: string;
  }