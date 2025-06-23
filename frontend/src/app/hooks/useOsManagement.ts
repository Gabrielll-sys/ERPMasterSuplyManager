// 🎓 ARQUITETURA EXPLICADA: Este hook agora usa react-query para gerenciar
// o estado do servidor. Ele centraliza as definições de query e mutation
// para que a UI não precise conhecer os detalhes da API.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { url } from '../api/webApiUrl';
import { IOrdemSeparacao } from '@/app/interfaces/IOrdemSeparacao';

// 🎓 FUNÇÕES DE API ISOLADAS: É uma boa prática separar as funções que
// efetivamente falam com a API. Elas são puras, fáceis de testar e podem
// ser reutilizadas em qualquer lugar, não apenas dentro de hooks.
const fetchOrdensServico = async (): Promise<IOrdemSeparacao[]> => {
  const { data } = await axios.get<IOrdemSeparacao[]>(`${url}/OrdemSeparacao`);
  // A ordenação pode ser feita aqui ou no `select` do useQuery.
  return data.sort((a, b) => dayjs(b.dataAbertura).unix() - dayjs(a.dataAbertura).unix());
};

const createOrdemServico = async (newOS: Omit<IOrdemSeparacao, 'dataAbertura' | 'isAuthorized'> & { responsavel: string }): Promise<IOrdemSeparacao> => {
  const payload = {
    ...newOS,
    descricao: newOS.descricao?.trim().replace(/\s\s+/g, " "),
    dataAbertura: dayjs().toISOString(),
    isAuthorized: false,
  };
  const { data } = await axios.post(`${url}/OrdemSeparacao`, payload);
  return data;
};

// 🎓 O HOOK PRINCIPAL
export function useOsManagement() {
  // 🎓 useQueryClient: Hook para acessar o cliente do react-query,
  // usado para interagir com o cache, como invalidar queries.
  const queryClient = useQueryClient();

  // 🎓 useQuery: Hook para buscar e cachear dados.
  // 📝 O QUE FAZ: Busca as ordens de serviço.
  // 🤔 PORQUÊ: Ele gerencia automaticamente loading, error, caching e re-fetching.
  const {
    data: ordens, // `data` é renomeado para `ordens` para mais clareza
    isLoading,
    isError,
    error,
  } = useQuery<IOrdemSeparacao[], Error>({
    // 🎓 queryKey: Uma chave única para esta query. O React Query usa isso para caching.
    // Se outra parte do app usar a mesma chave, receberá os dados do cache.
    queryKey: ['ordemSeparações'],
    // 🎓 queryFn: A função que retorna uma promessa com os dados.
    queryFn: fetchOrdensServico,
  });

  // 🎓 useMutation: Hook para criar, atualizar ou deletar dados.
  // 📝 O QUE FAZ: Configura a lógica para criar uma nova OS.
  // 🤔 PORQUÊ: Gerencia os estados da mutação (pending, success, error) e
  // nos dá callbacks para executar ações após a mutação, como invalidar o cache.
  const {
    mutate: createOs, // `mutate` é a função que dispara a mutação. Renomeamos para `createOs`.
    isPending: isCreating, // `isPending` é o novo `isLoading` para a mutação.
  } = useMutation({
    mutationFn: createOrdemServico,
    // 🎓 onSuccess: Callback executado quando a mutação é bem-sucedida.
    // 📝 O QUE FAZ: Invalida a query 'ordemServicos'.
    // 🤔 PORQUÊ: Isso diz ao react-query: "os dados de 'ordemServicos' estão desatualizados".
    // Ele então automaticamente fará um refetch dos dados, atualizando a UI. Mágico!
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordemSeparações'] });
      // Aqui você pode adicionar um toast de sucesso!
    },
    // 🎓 onError: Callback para tratar erros.
    onError: (err) => {
      console.error("Erro ao criar OS:", err);
      // Aqui você pode adicionar um toast de erro!
    }
  });

  // 🎓 RETURN VALUE: Expomos o que a UI precisa, vindo diretamente do react-query.
  return {
    ordens,
    isLoading,
    isError,
    error,
    createOs,
    isCreating,
  };
}