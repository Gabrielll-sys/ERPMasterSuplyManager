"use client";

import { useQuery } from "@tanstack/react-query";
import type { IInventario } from "../interfaces/IInventarios";
import { useState, useEffect } from "react";
import { getPagedInventario } from "../services/Inventario.Services";
import { PagedResult } from "../interfaces/IPagination";

// ========================================
// HOOK: useMaterialSearch
// ========================================
// Hook customizado para buscar materiais com paginação server-side.
// Usa o endpoint /Inventarios/paged que suporta:
// - Paginação (pageNumber, pageSize)
// - Busca por texto (searchTerm)

export function useMaterialSearch() {
  // ========================================
  // ESTADOS
  // ========================================
  
  // Termo de busca (descrição ou código)
  const [searchTerm, setSearchTerm] = useState('');
  
  // Termo com debounce (aguarda usuário parar de digitar)
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // Itens por página

  // ========================================
  // DEBOUNCE
  // ========================================
  // Aguarda 500ms após o usuário parar de digitar para buscar
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Volta para página 1 em nova busca
    }, 400);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Só busca se tiver pelo menos 3 caracteres
  const canSearch = debouncedSearch.length >= 3;

  // ========================================
  // BUSCA COM REACT QUERY
  // ========================================
  const { 
    data: pagedResult, 
    isLoading, 
    isFetching 
  } = useQuery<PagedResult<IInventario>>({
    // Chave única: inclui termo de busca e página
    queryKey: ['materiaisSearch', debouncedSearch, currentPage],
    
    queryFn: async () => {
      // Se não pode buscar, retorna vazio
      if (!canSearch) {
        return {
          items: [],
          totalCount: 0,
          currentPage: 1,
          pageSize: pageSize,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false
        };
      }
      
      // Chama o endpoint paginado do backend
      return getPagedInventario({
        pageNumber: currentPage,
        pageSize: pageSize,
        searchTerm: debouncedSearch
      });
    },
    
    // Só executa se pode buscar
    enabled: canSearch,
    
    // Cache válido por 15 minutos
    staleTime: 1000 * 60 * 15,
  });

  // ========================================
  // RETORNO DO HOOK
  // ========================================
  // API simples e clara para o componente consumidor
  return {
    // Controle de busca
    searchTerm,
    setSearchTerm,
    
    // Controle de paginação
    currentPage,
    setCurrentPage,
    totalPages: pagedResult?.totalPages || 0,
    totalCount: pagedResult?.totalCount || 0,
    
    // Dados e estados
    materials: pagedResult?.items || [],
    isLoading: isLoading || isFetching,
    hasNoResults: (pagedResult?.items?.length === 0) && canSearch && !isLoading && !isFetching,
    isInitialState: !canSearch
  };
}
