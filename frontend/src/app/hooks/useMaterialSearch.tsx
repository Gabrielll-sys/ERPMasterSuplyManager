import { useQuery } from "@tanstack/react-query";
import { searchByDescription, searchByFabricanteCode } from "../services/Material.Services";
import type { IInventario } from "../interfaces/IInventarios";
import { useState } from "react";
import { useDebounce } from "./useDebounce";

export function useMaterialSearch() {
  // 🎓 useState: Gerencia os valores brutos dos inputs de busca.
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');

  // 🎓 useDebounce: Evita chamadas de API a cada tecla. A busca só é disparada 500ms após o usuário parar de digitar.
  const debouncedDescription = useDebounce(description, 500);
  const debouncedCode = useDebounce(code, 500);

  // 🎓 Lógica de busca simplificada: Mais legível e fácil de manter.
  const canSearchDescription = debouncedDescription.length >= 4;
  const canSearchCode = !canSearchDescription && debouncedCode.length >= 4;
  
  const searchTerm = canSearchDescription ? debouncedDescription : (canSearchCode ? debouncedCode : '');
  const searchType = canSearchDescription ? 'descricao' : (canSearchCode ? 'codigo' : 'none');
  
  // 🎓 useQuery: Hook do TanStack Query para buscar, cachear e gerenciar o estado dos dados.
  const { data: materials = [], isLoading, isFetching } = useQuery<IInventario[]>({
    queryKey: ['materiaisSearch', searchType, searchTerm],
    queryFn: async () => {
      // 🎓 Early return: Código mais limpo, evita aninhamento.
      if (searchType === 'none') return [];
      if (searchType === 'descricao') return (await searchByDescription(searchTerm)) ?? [];
      return (await searchByFabricanteCode(searchTerm)) ?? [];
    },
    // 🎓 enabled: A query só será executada se houver um termo de busca válido.
    // 🤔 PORQUÊ: Evita chamadas de API desnecessárias na montagem inicial do componente.
    enabled: searchType !== 'none',
    // 🎓 staleTime: Os dados são considerados "frescos" por 5 minutos, evitando refetches desnecessários.
    staleTime: 1000 * 60 * 5,
    // 🎓 placeholderData: Dados iniciais enquanto a query carrega, não afeta o cache.
    placeholderData: [],
  });

  // 🎓 RETORNO DO HOOK: Expõe uma API clara para o componente consumidor.
  // O componente não precisa saber sobre debounce ou a lógica interna do useQuery.
  return {
    searchDescription: description,
    setSearchDescription: setDescription,
    searchCode: code,
    setSearchCode: setCode,
    materials: materials as IInventario[],
    isLoading: isLoading || isFetching, // Combina os dois estados para um spinner mais consistente.
    hasNoResults: materials.length === 0 && searchType !== 'none' && !(isLoading || isFetching),
    isInitialState: searchType === 'none'
  };
}
