import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orcamentoService } from '../api/orcamento.service';
import { IOrcamento } from '../types';

/**
 * Hook para gerenciamento de orçamentos com React Query
 */
export function useOrcamentos() {
    const queryClient = useQueryClient();

    const {
        data: orcamentos,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['orcamentos'],
        queryFn: orcamentoService.getAll,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true,
    });

    const createMutation = useMutation({
        mutationFn: (payload: IOrcamento) => orcamentoService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (payload: IOrcamento) => orcamentoService.update(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
            queryClient.invalidateQueries({ queryKey: ['orcamento'] });
        },
    });

    const authorizeMutation = useMutation({
        mutationFn: (payload: IOrcamento) => orcamentoService.authorize(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
            queryClient.invalidateQueries({ queryKey: ['orcamento'] });
        },
    });

    return {
        orcamentos: orcamentos || [],
        isLoading,
        error,
        refetch,
        createOrcamento: createMutation.mutateAsync,
        updateOrcamento: updateMutation.mutateAsync,
        authorizeOrcamento: authorizeMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isAuthorizing: authorizeMutation.isPending,
    };
}

/**
 * Hook para buscar um orçamento específico por ID
 */
export function useOrcamento(id: number) {
    return useQuery({
        queryKey: ['orcamento', id],
        queryFn: () => orcamentoService.getById(id),
        enabled: !!id,
    });
}
