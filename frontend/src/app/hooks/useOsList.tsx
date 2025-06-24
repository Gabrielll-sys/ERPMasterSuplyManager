// src/app/(os-management)/hooks/useOsList.ts

// 🎓 ARQUITETURA EXPLICADA: Este hook gerencia a coleção de Ordens de Serviço.
// Sua responsabilidade é buscar a lista completa e permitir a criação de novas OSs.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { url } from '@/app/api/webApiUrl'; // Ajuste o caminho se necessário
import { IOrdemSeparacao } from '@/app/interfaces/IOrdemSeparacao'; // Ajuste o caminho

// --- Funções de API Isoladas ---
const fetchOrdensServico = async (): Promise<IOrdemSeparacao[]> => {
  const { data } = await axios.get<IOrdemSeparacao[]>(`${url}/OrdemSeparacao`);
  return data.sort((a, b) => dayjs(b.dataAbertura).unix() - dayjs(a.dataAbertura).unix());
};

const createOrdemServico = async (newOS: { descricao: string; responsavel: string }): Promise<IOrdemSeparacao> => {
  const payload = {
    ...newOS,
    descricao: newOS.descricao?.trim().replace(/\s\s+/g, " "),
    dataAbertura: dayjs().toISOString(),
    isAuthorized: false,
  };
  const { data } = await axios.post(`${url}/OrdemSeparacao`, payload);
  return data;
};

// --- O Hook Principal ---
export function useOsList() {
  const queryClient = useQueryClient();

  const { data: ordens = [], isLoading, isError, error } = useQuery<IOrdemSeparacao[], Error>({
    queryKey: ['ordensServico'], // Chave de query para a lista
    queryFn: fetchOrdensServico,
  });

  const { mutate: createOs, isPending: isCreating } = useMutation({
    mutationFn: createOrdemServico,
    onSuccess: (newOs) => {
      toast.success(`OS Nº ${newOs.id} criada com sucesso!`);
      // 🎓 CONCEITO: Invalidação vs. Atualização Otimista
      // 🤔 PORQUÊ: InvalidateQueries é a forma mais simples e segura de atualizar a lista.
      // Ele garante que os dados sejam consistentes com o servidor.
      queryClient.invalidateQueries({ queryKey: ['ordensServico'] });
    },
    onError: (err) => {
      toast.error("Erro ao criar OS", { description: err instanceof Error ? err.message : 'Erro desconhecido' });
    }
  });

  return { ordens, isLoading, isError, error, createOs, isCreating };
}