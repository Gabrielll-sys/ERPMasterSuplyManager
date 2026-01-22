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
}

export interface ConcluirSolicitacaoPayload {
    usuarios: string[];
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
