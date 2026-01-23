import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { solicitacaoService } from '../api/solicitacao.service';
import { CreateSolicitacaoPayload, ConcluirSolicitacaoPayload, ISolicitacaoServico } from '../types';

/**
 * Hook customizado para gerenciar solicitações de serviço com React Query
 */
export function useSolicitacoes() {
    const queryClient = useQueryClient();

    // Query para buscar todas as solicitações
    const {
        data: solicitacoes,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['solicitacoes'],
        queryFn: solicitacaoService.getAll,
        staleTime: 30 * 1000, // Considera dados válidos por 30 segundos
        refetchOnWindowFocus: true,
    });

    // Mutation para criar solicitação
    const createMutation = useMutation({
        mutationFn: (payload: CreateSolicitacaoPayload) => solicitacaoService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
        },
    });

    // Mutation para aceitar solicitação
    const aceitarMutation = useMutation({
        mutationFn: (id: number) => solicitacaoService.aceitar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
            queryClient.invalidateQueries({ queryKey: ['solicitacao'] }); // Invalida todas as queries de solicitação individual
        },
    });

    // Mutation para concluir solicitação
    const concluirMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: ConcluirSolicitacaoPayload }) =>
            solicitacaoService.concluir(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
            queryClient.invalidateQueries({ queryKey: ['solicitacao'] }); // Invalida todas as queries de solicitação individual
        },
    });

    // Mutation para atualizar solicitação
    const updateMutation = useMutation({
        // Atualiza apenas campos parciais da solicitação
        mutationFn: ({ id, data }: { id: number; data: Partial<ISolicitacaoServico> }) =>
            solicitacaoService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
            queryClient.invalidateQueries({ queryKey: ['solicitacao'] });
        },
    });

    // Mutation para deletar solicitação
    const deleteMutation = useMutation({
        mutationFn: (id: number) => solicitacaoService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
        },
    });

    return {
        solicitacoes: solicitacoes || [],
        isLoading,
        error,
        refetch,
        createSolicitacao: createMutation.mutateAsync,
        aceitarSolicitacao: aceitarMutation.mutateAsync,
        concluirSolicitacao: concluirMutation.mutateAsync,
        // Envolve a mutation para aceitar (id, data) como parâmetros
        // Wrapper para manter assinatura (id, data) no app
        updateSolicitacao: (id: number, data: Partial<ISolicitacaoServico>) =>
            updateMutation.mutateAsync({ id, data }),
        deleteSolicitacao: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isActing: aceitarMutation.isPending || concluirMutation.isPending || updateMutation.isPending,
    };
}

/**
 * Hook para buscar uma solicitação específica por ID
 */
export function useSolicitacao(id: number) {
    return useQuery({
        queryKey: ['solicitacao', id],
        queryFn: () => solicitacaoService.getById(id),
        enabled: !!id,
    });
}
