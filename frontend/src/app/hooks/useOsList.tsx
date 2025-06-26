// src/app/(os-management)/hooks/useOsList.ts

// 🎓 ARQUITETURA EXPLICADA: Este hook gerencia a coleção de Ordens de Serviço.
// Sua responsabilidade é buscar a lista completa e permitir a criação de novas OSs.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { url } from '@/app/api/webApiUrl'; // Ajuste o caminho se necessário
import { IOrdemSeparacao } from '@/app/interfaces/IOrdemSeparacao'; // Ajuste o caminho

// --- Funções de API Isoladas ---
const fetchOrdensSeparacoes = async (): Promise<IOrdemSeparacao[]> => {
  const { data } = await axios.get<IOrdemSeparacao[]>(`${url}/OrdemSeparacao`);
  return data.sort((a, b) => dayjs(b.dataAbertura).unix() - dayjs(a.dataAbertura).unix());
};

const createOrdemSeparacao = async (newOS: { descricao: string; responsavel: string }): Promise<IOrdemSeparacao> => {
  // Fetch all existing orders to check for open ones by the same user
  const existingOrdens = await fetchOrdensSeparacoes();
  console.log(existingOrdens)
  console.log(newOS.responsavel)
  const openOsForUser = existingOrdens.find(
    (os) =>
      os.responsavel === newOS.responsavel &&
      !os.baixaSolicitada 
  );
console.log(openOsForUser)
  if (openOsForUser?.baixaSolicitada) {
    throw new AxiosError(
      "Você já possui uma Ordem de Separação em aberto. Por favor, solicite a baixa da OS anterior antes de criar uma nova.",
      "409",
      undefined,
      undefined,
      {
        status: 409,
        data: {
          message: "Você já possui uma Ordem de Separação em aberto. Por favor, solicite a baixa da OS anterior antes de criar uma nova.",
          pendingOsId: openOsForUser.id,
        },
        headers: {},
        config: { headers: {} as any },
        statusText: "Conflict",
      }
    );
  }

  const payload = {
    ...newOS,
    descricao: newOS.descricao?.trim().replace(/\s\s+/g, " "),
    dataAbertura: dayjs().toISOString(),
    isAuthorized: false,
  };
  const { data } = await axios.post(`${url}/OrdemSeparacao`, payload);
  console.log(data)
  return data;
};

// --- O Hook Principal ---
export function useOsList() {
  const queryClient = useQueryClient();

  const { data: ordens = [], isLoading, isError, error } = useQuery<IOrdemSeparacao[], Error>({
    queryKey: ['ordensSeparacoes'], // Chave de query para a lista
    queryFn: fetchOrdensSeparacoes,
  });

  const { mutate: createOs, isPending: isCreating } = useMutation({
    mutationFn: createOrdemSeparacao,
    onSuccess: (newOs) => {
      toast.success(`OS Nº ${newOs.id} criada com sucesso!`);
      // 🎓 CONCEITO: Invalidação vs. Atualização Otimista
      // 🤔 PORQUÊ: InvalidateQueries é a forma mais simples e segura de atualizar a lista.
      // Ele garante que os dados sejam consistentes com o servidor.
      queryClient.invalidateQueries({ queryKey: ['ordensSeparacoes'] });
    },
    onError: (err: AxiosError<{ message: string; pendingOsId?: number }>) => {
      if (err.response && err.response.status === 409) {
        const { message, pendingOsId } = err.response.data;
        toast.error("Ação bloqueada", {
          description: (
            <>
              {message}
              {pendingOsId && (
                <a href={`/os-management/editing-os/${pendingOsId}`} className="text-blue-400 underline ml-1">
                  Ir para OS {pendingOsId}
                </a>
              )}
            </>
          ),
          duration: 8000,
        });
      } else {
        toast.error("Erro ao criar OS", { description: err.message || 'Erro desconhecido' });
      }
    }
  });

  return { ordens, isLoading, isError, error, createOs, isCreating };
}