// src/app/(os-management)/editing-os/[osId]/hooks/useOsDetails.ts

// 🎓 ARQUITETURA EXPLICADA: Este hook gerencia UMA ÚNICA Ordem de Serviço.
// Suas responsabilidades são: buscar os detalhes da OS, buscar seus itens,
// e permitir mutações (update, add/delete item) relacionadas a ELA.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';

// --- Serviços e Interfaces ---
import { getOsById, updateOsDetails, getMateriaisOs, createItemOs, deleteItemOs } from '@/app/services/OrdemSeparacao.Service';
import { searchByDescription } from '@/app/services/Material.Services';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/app/hooks/useDebounce';
import type { IOrdemSeparacao } from '@/app/interfaces/IOrdemSeparacao';
import type { IItem } from '@/app/interfaces/IItem';
import type { IInventario } from '@/app/interfaces/IInventarios';

// --- O Hook Principal ---
// 📝 MUDANÇA: Renomeado de `useOsManagement` para `useOsDetails` para maior clareza.
export function useOsDetails(osId: number) {
  const queryClient = useQueryClient();
  const { user: authUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- Callbacks Genéricos ---
  const handleMutationSuccess = (message: string, queryKeyToInvalidate: string) => {
    toast.success(message);
    // 🎓 CONCEITO: Invalidação de Múltiplas Queries
    // 🤔 PORQUÊ: Ações nesta página podem afetar tanto os detalhes da OS quanto a lista de itens.
    // Invalidar ambas as queries garante que a UI esteja sempre 100% sincronizada.
    queryClient.invalidateQueries({ queryKey: [queryKeyToInvalidate, osId] });
  };

  const handleMutationError = (error: any, action: string) => {
    toast.error(`Falha ao ${action}`, {
      description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado',
    });
  };

  // --- QUERIES ---
  const { data: os, isLoading: isLoadingOs, isError: isOsError } = useQuery<IOrdemSeparacao, Error>({
    queryKey: ['osDetails', osId], // Chave única para os detalhes desta OS
    queryFn: () => getOsById(osId),
    enabled: !isNaN(osId),
  });

  const { data: materiaisOs = [], isLoading: isLoadingMateriais } = useQuery<IItem[], Error>({
    queryKey: ['materiaisOs', osId], // Chave única para os itens desta OS
    queryFn: () => getMateriaisOs(osId),
    enabled: !isNaN(osId),
  });

  const { data: searchResults = [], isLoading: isSearching } = useQuery<IInventario[], Error>({
    queryKey: ['materialSearch', debouncedSearchTerm],
    queryFn: () => searchByDescription(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 2,
  });
  
  // --- MUTATIONS ---
  const updateDetailsMutation = useMutation({
    mutationFn: (data: Partial<IOrdemSeparacao>) => updateOsDetails(osId, data),
    onSuccess: () => handleMutationSuccess("Detalhes da OS atualizados!", 'osDetails'),
    onError: (error) => handleMutationError(error, "atualizar detalhes"),
  });

  const createItemMutation = useMutation({
    mutationFn: createItemOs,
    onSuccess: () => handleMutationSuccess("Item adicionado à OS!", 'materiaisOs'),
    onError: (error) => handleMutationError(error, "adicionar item"),
  });

  const deleteItemMutation = useMutation({
    mutationFn: deleteItemOs,
    onSuccess: () => handleMutationSuccess("Item removido da OS!", 'materiaisOs'),
    onError: (error) => handleMutationError(error, "remover item"),
  });

  // --- Funções de Ação ---
  const addItemToOs = (itemData: { materialId?: number; descricaoNaoCadastrado?: string; quantidade: number }) => {
    if (!authUser?.userName) {
        toast.error("Usuário não autenticado.");
        return;
    }
    createItemMutation.mutate({
      ...itemData,
      ordemSeparacaoId: osId,
      responsavel: authUser.userName,
    });
  };

  const deleteItemFromOs = (itemId: number) => {
    deleteItemMutation.mutate(itemId);
  };

  // --- Estado Derivado ---
  const { registeredItems, nonRegisteredItems } = useMemo(() => {
    const registered = materiaisOs.filter(item => item.materialId != null);
    const nonRegistered = materiaisOs.filter(item => item.materialId == null);
    return { registeredItems: registered, nonRegisteredItems: nonRegistered };
  }, [materiaisOs]);

  // --- API do Hook ---
  return {
    os,
    isLoadingOs,
    isOsError,
    registeredItems,
    nonRegisteredItems,
    isLoadingMateriais,
    searchTerm,
    searchResults,
    isSearching,
    setSearchTerm,
    updateDetails: updateDetailsMutation.mutate,
    isUpdatingDetails: updateDetailsMutation.isPending,
    addItemToOs,
    isAddingItem: createItemMutation.isPending,
    deleteItemFromOs,
    isDeletingItem: deleteItemMutation.isPending,
  };
}