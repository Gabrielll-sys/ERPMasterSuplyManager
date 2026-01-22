// src/app/hooks/useSolicitacaoServico.tsx

// 🎓 ARQUITETURA: Hook para gerenciar Solicitações de Serviço com React Query.
// Implementa cache, invalidação automática e atualização otimista de UI.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAllSolicitacoes,
  createSolicitacao,
  aceitarSolicitacao,
  concluirSolicitacao,
  deleteSolicitacao
} from '@/app/services/SolicitacaoServico.Service';
import { 
  ISolicitacaoServico, 
  CreateSolicitacaoPayload 
} from '@/app/interfaces/ISolicitacaoServico';

// Chave de query para cache
const QUERY_KEY = ['solicitacoesServico'];

/**
 * Hook para gerenciamento de Solicitações de Serviço
 * Implementa padrões de React Query para cache, invalidação e mutations
 */
export function useSolicitacaoServico() {
  const queryClient = useQueryClient();

  // ============================================
  // 🔍 QUERY: Buscar todas as solicitações
  // ============================================
  const { 
    data: solicitacoes = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery<ISolicitacaoServico[], Error>({
    queryKey: QUERY_KEY,
    queryFn: getAllSolicitacoes,
    staleTime: 30 * 1000, // Cache válido por 30 segundos
    refetchOnWindowFocus: true, // Recarrega ao voltar para a janela
  });

  // ============================================
  // ➕ MUTATION: Criar nova solicitação
  // ============================================
  const createMutation = useMutation({
    mutationFn: createSolicitacao,
    onSuccess: (newSolicitacao) => {
      toast.success(`Solicitação #${newSolicitacao.id} criada com sucesso!`);
      // Invalidar cache para recarregar lista atualizada
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar solicitação", { 
        description: error.message || 'Tente novamente' 
      });
    }
  });

  // ============================================
  // ✅ MUTATION: Aceitar solicitação
  // ============================================
  const aceitarMutation = useMutation({
    mutationFn: aceitarSolicitacao,
    // 🎓 ATUALIZAÇÃO OTIMISTA: Atualiza UI antes da resposta do servidor
    onMutate: async (id: number) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      
      // Snapshot do estado anterior
      const previousSolicitacoes = queryClient.getQueryData<ISolicitacaoServico[]>(QUERY_KEY);
      
      // Atualização otimista
      queryClient.setQueryData<ISolicitacaoServico[]>(QUERY_KEY, (old) => 
        old?.map(s => s.id === id ? { ...s, status: 1 } : s)
      );
      
      return { previousSolicitacoes };
    },
    onSuccess: (updatedSolicitacao) => {
      toast.success("Solicitação aceita!", {
        description: `Você aceitou a solicitação #${updatedSolicitacao.id}`
      });
      // Atualizar com dados reais do servidor
      queryClient.setQueryData<ISolicitacaoServico[]>(QUERY_KEY, (old) => 
        old?.map(s => s.id === updatedSolicitacao.id ? updatedSolicitacao : s)
      );
    },
    onError: (error: Error, _id, context) => {
      // Reverter para estado anterior em caso de erro
      if (context?.previousSolicitacoes) {
        queryClient.setQueryData(QUERY_KEY, context.previousSolicitacoes);
      }
      toast.error("Erro ao aceitar solicitação", { 
        description: error.message 
      });
    }
  });

  // ============================================
  // 🏁 MUTATION: Concluir solicitação
  // ============================================
  const concluirMutation = useMutation({
    mutationFn: ({ id, usuarios }: { id: number; usuarios: string[] }) => 
      concluirSolicitacao(id, usuarios),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      
      const previousSolicitacoes = queryClient.getQueryData<ISolicitacaoServico[]>(QUERY_KEY);
      
      // Atualização otimista
      queryClient.setQueryData<ISolicitacaoServico[]>(QUERY_KEY, (old) => 
        old?.map(s => s.id === id ? { ...s, status: 2 } : s)
      );
      
      return { previousSolicitacoes };
    },
    onSuccess: (updatedSolicitacao) => {
      toast.success("Serviço concluído!", {
        description: `Solicitação #${updatedSolicitacao.id} finalizada com sucesso`
      });
      queryClient.setQueryData<ISolicitacaoServico[]>(QUERY_KEY, (old) => 
        old?.map(s => s.id === updatedSolicitacao.id ? updatedSolicitacao : s)
      );
    },
    onError: (error: Error, _vars, context) => {
      if (context?.previousSolicitacoes) {
        queryClient.setQueryData(QUERY_KEY, context.previousSolicitacoes);
      }
      toast.error("Erro ao concluir solicitação", { 
        description: error.message 
      });
    }
  });

  // ============================================
  // 🗑️ MUTATION: Deletar solicitação
  // ============================================
  const deleteMutation = useMutation({
    mutationFn: deleteSolicitacao,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      
      const previousSolicitacoes = queryClient.getQueryData<ISolicitacaoServico[]>(QUERY_KEY);
      
      // Remover otimisticamente
      queryClient.setQueryData<ISolicitacaoServico[]>(QUERY_KEY, (old) => 
        old?.filter(s => s.id !== id)
      );
      
      return { previousSolicitacoes };
    },
    onSuccess: () => {
      toast.success("Solicitação removida");
    },
    onError: (error: Error, _id, context) => {
      if (context?.previousSolicitacoes) {
        queryClient.setQueryData(QUERY_KEY, context.previousSolicitacoes);
      }
      toast.error("Erro ao remover solicitação", { 
        description: error.message 
      });
    }
  });

  // ============================================
  // 📤 RETORNO DO HOOK
  // ============================================
  return {
    // Estado
    solicitacoes,
    isLoading,
    isError,
    error,
    
    // Ações
    refetch,
    createSolicitacao: createMutation.mutate,
    aceitarSolicitacao: aceitarMutation.mutate,
    concluirSolicitacao: (id: number, usuarios: string[]) => 
      concluirMutation.mutate({ id, usuarios }),
    deleteSolicitacao: deleteMutation.mutate,
    
    // Estados de loading das mutations
    isCreating: createMutation.isPending,
    isAceiting: aceitarMutation.isPending,
    isConcluding: concluirMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isActing: aceitarMutation.isPending || concluirMutation.isPending,
  };
}
