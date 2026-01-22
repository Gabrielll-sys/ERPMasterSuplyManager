// Interface para Solicitação de Serviço

export interface ISolicitacaoServico {
    id: number;
    descricao: string;
    nomeCliente: string;
    dataSolicitacao: string;
    usuarioAceite?: string;
    dataAceite?: string;
    dataConclusao?: string;
    usuariosConclusao?: string; // JSON string que será parseado
    status: number; // 0 = Pendente, 1 = Aceita, 2 = Concluída
}

// Enum para os status (para uso no frontend)
export enum StatusSolicitacao {
    Pendente = 0,
    Aceita = 1,
    Concluida = 2
}

// Função auxiliar para obter o label do status
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

// Função auxiliar para obter a cor do status (Tailwind/CSS classes)
export const getStatusColor = (status: number): string => {
    switch (status) {
        case StatusSolicitacao.Pendente:
            return 'warning'; // amarelo
        case StatusSolicitacao.Aceita:
            return 'primary'; // azul
        case StatusSolicitacao.Concluida:
            return 'success'; // verde
        default:
            return 'default';
    }
};

// Tipo para criação de nova solicitação
export type CreateSolicitacaoPayload = Pick<ISolicitacaoServico, 'descricao' | 'nomeCliente'>;

// Tipo para conclusão de solicitação
export interface ConcluirSolicitacaoPayload {
    usuarios: string[];
}
