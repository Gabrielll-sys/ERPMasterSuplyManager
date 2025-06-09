"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import dayjs from 'dayjs';
import "dayjs/locale/pt-br";

// Radix UI Themes e Icons
import { Flex, Box, Heading, Text, TextField, Card, Button, Grid, Callout, Separator } from "@radix-ui/themes";
import { MagnifyingGlassIcon, ExclamationTriangleIcon, Pencil1Icon } from '@radix-ui/react-icons';

// React Query
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Import do TanStack

// Serviços e Interfaces
import { IOrcamento } from '@/app/interfaces/IOrcamento'; // Ajuste o caminho
import { getAllOrcamentos,  getOrcamentoById } from '@/app/services/Orcamentos.Service'; // Ajuste o caminho
import { Spinner } from '@nextui-org/react';

dayjs.locale("pt-br");

// Hook customizado simples para Debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

export default function ManageBudgesPage() { // Renomeado para clareza
  const route = useRouter();
  const queryClient = useQueryClient(); // Para possíveis invalidações futuras

  // Estados para os inputs de filtro
  const [inputNumeroOrcamento, setInputNumeroOrcamento] = useState<string>("");
  const [inputCliente, setInputCliente] = useState<string>("");

  // Valores debounced para usar nas queries
  const debouncedNumeroOrcamento = useDebounce(inputNumeroOrcamento, 500);
  const debouncedCliente = useDebounce(inputCliente, 500);

  // --- React Query ---
  const {
    data: orcamentosData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<IOrcamento[], Error>({
    queryKey: ['orcamentos', { cliente: debouncedCliente, numero: debouncedNumeroOrcamento }],
    queryFn: async () => {
      if (debouncedNumeroOrcamento && debouncedNumeroOrcamento.length > 0) {
        const id = parseInt(debouncedNumeroOrcamento);
        if (!isNaN(id)) {
          const orc = await getOrcamentoById(id);
          return orc ? [orc] : []; // Retorna array para consistência
        }
        return []; // Retorna vazio se número não for válido
      }
      // if (debouncedCliente && debouncedCliente.length > 0) {
      //   return getOrcamentosByClient(debouncedCliente);
      // }
      return getAllOrcamentos(); // Busca todos se nenhum filtro específico
    },
    keepPreviousData: true, // Mantém dados anteriores visíveis enquanto carrega novos
    staleTime: 1000 * 60 * 1, // 1 minuto de staleTime
    // onSuccess: (data) => console.log("Orcamentos carregados:", data),
    // onError: (err) => console.error("Erro ao buscar orçamentos:", err),
  });

  // Os dados da query já são um array, não precisa de estados separados `orcamento` e `orcamentos`
  const orcamentosExibidos: IOrcamento[] = orcamentosData || [];

  return (
    <>
      <Flex direction="column" gap="6" className="container mx-auto px-4 md:px-6 py-8">
        <Heading align="center" size={{initial: "6", md: "8"}} mb="4">Gerenciamento de Orçamentos</Heading>

        {/* Seção de Filtros */}
        <Card variant="surface" size="3"> {/* Usando Card Radix para agrupar filtros */}
          <Flex direction={{ initial: 'column', sm: 'row' }} gap="4" align={{initial: "stretch", sm: "end"}}>
            <Box className="flex-1 min-w-[150px]">
              <Text as="label" size="2" mb="1" className="block font-medium">Número do Orçamento</Text>
              <TextField.Root>
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
                <TextField.Input
                  size="3"
                  value={inputNumeroOrcamento}
                  type='number'
                  onChange={(e) => setInputNumeroOrcamento(e.target.value)}
                  placeholder='Digite o número...'
                />
              </TextField.Root>
            </Box>
            <Box className="flex-1 min-w-[200px]">
              <Text as="label" size="2" mb="1" className="block font-medium">Nome do Cliente</Text>
              <TextField.Root>
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
                <TextField.Input
                  size="3"
                  value={inputCliente}
                  onChange={(e) => setInputCliente(e.target.value)}
                  placeholder='Digite o nome do cliente...'
                />
              </TextField.Root>
            </Box>
            {/* Você pode adicionar um botão "Limpar Filtros" aqui se desejar */}
          </Flex>
        </Card>

        {/* Seção de Resultados */}
        {isFetching && ( // Mostra spinner se estiver buscando, mesmo com keepPreviousData
          <Flex justify="center" my="6">
            <Spinner size="lg" /> <Text ml="2">Buscando orçamentos...</Text>
          </Flex>
        )}

        {!isFetching && isError && (
          <Callout.Root color="red" role="alert" my="6">
            <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
            <Callout.Text>
              Erro ao carregar orçamentos: {error instanceof Error ? error.message : "Erro desconhecido"}
            </Callout.Text>
          </Callout.Root>
        )}

        {!isFetching && !isError && orcamentosExibidos.length === 0 && (
          (debouncedCliente || debouncedNumeroOrcamento) ? ( // Se filtros aplicados mas sem resultado
             <Callout.Root color="amber" my="6">
                <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
                <Callout.Text>Nenhum orçamento encontrado para os filtros aplicados.</Callout.Text>
            </Callout.Root>
          ) : ( // Sem filtros e sem orçamentos
            <Text align="center" color="gray" my="6">Nenhum orçamento cadastrado ainda.</Text>
          )
        )}

        {!isError && orcamentosExibidos.length > 0 && (
          <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="5" mt="6">
            {orcamentosExibidos.map((orc) => (
              <Card key={orc.id} variant="ghost" size="2" className="hover:shadow-lg transition-shadow duration-200">
                <Flex direction="column" gap="2" p="1"> {/* Adicionado padding interno */}
                  <Heading size="4" as="h3" trim="start">Orçamento Nº {orc.id}</Heading>
                  <Text size="2" color="gray">{orc.nomeCliente || "Cliente não informado"}</Text>
                  <Separator my="1" size="4" />
                  <Text size="2">
                    Data: {dayjs(orc.dataOrcamento).format("DD/MM/YYYY HH:mm")}
                  </Text>
                  <Text size="2" weight={orc.isPayed ? "regular" : "medium"} color={orc.isPayed ? "green" : "orange"}>
                    Status: {orc.isPayed ? "Concluído/Vendido" : "Em Aberto"}
                  </Text>
                   {orc.isPayed && orc.dataVenda && (
                        <Text size="1" color="gray">
                            Venda: {dayjs(orc.dataVenda).format("DD/MM/YYYY HH:mm")}
                        </Text>
                    )}
                  <Flex justify="end" mt="3">
                    <Button size="2" variant="soft" color="blue" asChild>
                      <Link href={`/edit-budge/${orc.id}`}>
                        <Pencil1Icon height="14" width="14" /> Editar
                      </Link>
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Grid>
        )}
      </Flex>
    </>
  );
}