// TypeScript interfaces para o app
export interface ISolicitacaoServico {
    id: number;
    descricao: string;
    nomeCliente: string;
    dataSolicitacao: string;
    usuarioAceite?: string | null;
    dataAceite?: string | null;
    dataConclusao?: string | null;
    usuariosConclusao?: string | null;
    usuariosDesignados?: string | null; // Usuários escolhidos na criação
    status: number; // 0=Pendente, 1=Aceita, 2=Concluída
}

export enum StatusSolicitacao {
    Pendente = 0,
    Aceita = 1,
    Concluida = 2,
}

export interface AuthUser {
    token: string;
    userId: number;
    userName: string;
    role: string;
}

export interface LoginCredentials {
    email: string;
    senha: string;
}

export interface CreateSolicitacaoPayload {
    nomeCliente: string;
    descricao: string;
    usuariosDesignados?: string;
}

export interface ConcluirSolicitacaoPayload {
    usuarios: string[];
}

// Tipos para Orçamentos
export interface IOrcamento {
    id?: number;
    responsavelOrcamento?: string | null;
    nomeCliente?: string;
    empresa?: string;
    emailCliente?: string;
    responsavelVenda?: string;
    dataOrcamento?: string | Date;
    nomeOrcamento?: string;
    observacoes?: string;
    desconto?: number;
    acrescimo?: number;
    precoVendaTotal?: number;
    precoVendaComDesconto?: number;
    dataVenda?: string | Date;
    isPayed?: boolean;
    telefone?: string;
    endereco?: string;
    cpfOrCnpj?: string;
    tipoPagamento?: string;
}

// Tipo para APR com conteÃºdo em JSON
export interface IApr {
    id?: number;
    titulo?: string;
    data?: string | Date;
    conteudoJson: string;
    criadoEm?: string | Date;
    atualizadoEm?: string | Date | null;
}

export interface IMaterial {
    id?: number;
    categoria: string;
    codigoFabricante: string;
    corrente: string;
    dataEntradaNF?: string | Date;
    descricao: string;
    localizacao: string;
    marca: string;
    markup?: string | number | null;
    precoCusto?: number | string;
    precoVenda?: number | string;
    tensao: string;
    unidade: string;
    urlImage?: string | null;
}

export interface IInventario {
    id: number;
    dataAlteracao?: string | Date;
    materialId?: number;
    material?: IMaterial;
    razao?: string | null;
    estoque?: number | null;
    movimentacao?: number | null;
    saldoFinal?: number | null;
    responsavel?: string | null;
}

export interface IItemOrcamento {
    id: number;
    quantidadeMaterial: number;
    dataAdicaoItem?: string | Date;
    precoItemOrcamento?: number;
    materialId: number;
    material?: IMaterial;
    orcamentoId: number;
    orcamento?: IOrcamento;
    precoVenda?: number;
}

export const getStatusLabel = (status: number): string => {
    switch (status) {
        case StatusSolicitacao.Pendente:
            return 'Pendente';
        case StatusSolicitacao.Aceita:
            return 'Aceita';
        case StatusSolicitacao.Concluida:
            return 'Concluída';
        default:
            return 'Desconhecido';
    }
};

export const getStatusColor = (status: number): string => {
    switch (status) {
        case StatusSolicitacao.Pendente:
            return '#FFA726'; // Orange
        case StatusSolicitacao.Aceita:
            return '#42A5F5'; // Blue
        case StatusSolicitacao.Concluida:
            return '#66BB6A'; // Green
        default:
            return '#9E9E9E'; // Gray
    }
};
