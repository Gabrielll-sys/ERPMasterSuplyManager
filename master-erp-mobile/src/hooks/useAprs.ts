import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aprService } from '../api/apr.service';
import { IApr } from '../types';

// Hook para listar e mutar APRs com React Query
export function useAprs() {
  const queryClient = useQueryClient();

  // Query principal para APRs
  const {
    data: aprs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['aprs'],
    queryFn: aprService.getAll,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  // Mutation para criar APR
  const createMutation = useMutation({
    mutationFn: (payload: IApr) => aprService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aprs'] });
    },
  });

  // Mutation para atualizar APR
  const updateMutation = useMutation({
    mutationFn: (payload: IApr) => aprService.update(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['aprs'] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['apr', data.id] });
      }
    },
  });

  // Mutation para excluir APR
  const deleteMutation = useMutation({
    mutationFn: (id: number) => aprService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aprs'] });
    },
  });

  return {
    aprs: aprs || [],
    isLoading,
    error,
    refetch,
    createApr: createMutation.mutateAsync,
    updateApr: updateMutation.mutateAsync,
    deleteApr: deleteMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}

// Hook para buscar APR por ID
export function useApr(id: number) {
  return useQuery({
    queryKey: ['apr', id],
    queryFn: () => aprService.getById(id),
    enabled: !!id,
  });
}
