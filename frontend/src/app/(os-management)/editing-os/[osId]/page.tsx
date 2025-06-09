"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from 'sonner';
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

// UI e Ícones
import { Card, Flex, Heading, Text, Button, Table, TextField, TextArea, Callout, Separator, Box, IconButton } from '@radix-ui/themes';
import { Autocomplete, AutocompleteItem, Spinner, Chip, Tooltip } from "@nextui-org/react";
import { ArrowLeft, Edit3, Trash2, Save, Search, Package, Plus, Lock, Info, ServerCrash, FileQuestion, User } from 'lucide-react';

// Serviços e Interfaces
import { getOsById, updateOsDetails, authorizeOs, getMateriaisOs, createItemOs, updateItemOs, deleteItemOs } from '@/app/services/OrdemServico.Service'
import { searchByDescription } from '@/app/services/Material.Services';
import { IOrdemServico } from '@/app/interfaces/IOrdemServico';
import { IItem } from '@/app/interfaces/IItem';
import { IInventario } from '@/app/interfaces/IInventarios';
import { useAuth } from '@/contexts/AuthContext';


dayjs.locale('pt-br');

// --- Zod Schema para Validação ---
const osDetailsSchema = z.object({
  numeroOs: z.string().min(1, "Número da OS é obrigatório"),
  descricao: z.string().min(3, "Descrição precisa de ao menos 3 caracteres"),
  responsaveisExecucao: z.string().optional(),
  observacoes: z.string().optional(),
});
type OsDetailsFormData = z.infer<typeof osDetailsSchema>;

// --- Componente Principal ---
export default function EditingOsPage({ params }: { params: { osId: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: authUser } = useAuth();
  const osId = parseInt(params.osId, 10);

  // --- Estados de UI e Busca ---
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- React Hook Form para o formulário de detalhes ---
  const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<OsDetailsFormData>({
    resolver: zodResolver(osDetailsSchema),
    defaultValues: {
      numeroOs: '',
      descricao: '',
      responsaveisExecucao: '',
      observacoes: '',
    }
  });

  // --- Queries ---
  const { data: os, isLoading: isLoadingOs, isError: isOsError } = useQuery<IOrdemServico, Error>({
    queryKey: ['osDetails', osId],
    queryFn: () => getOsById(osId),
    enabled: !!osId,
    onSuccess: (data) => {
      // Popula o formulário quando os dados chegam
      reset({
        numeroOs: data.numeroOs || '',
        descricao: data.descricao || '',
        responsaveisExecucao: data.responsaveisExecucao || '',
        observacoes: data.observacoes || '',
      });
    },
  });

  const { data: materiaisOs = [], isLoading: isLoadingMateriais } = useQuery<IItem[], Error>({
    queryKey: ['materiaisOs', osId],
    queryFn: () => getMateriaisOs(osId),
    enabled: !!osId,
  });

  const { data: searchResults = [] } = useQuery<IInventario[], Error>({
    queryKey: ['materialSearch', debouncedSearchTerm],
    queryFn: () => searchByDescription(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 2,
  });
  
  // --- Mutações ---
  const handleMutationSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ['osDetails', osId] });
    queryClient.invalidateQueries({ queryKey: ['materiaisOs', osId] });
  };
  
  const handleMutationError = (error: any, action: string) => {
    toast.error(`Falha ao ${action}`, { description: error.message });
  };

  const updateDetailsMutation = useMutation({
    mutationFn: (data: OsDetailsFormData) => updateOsDetails(osId, data),
    onSuccess: () => {
      handleMutationSuccess("Detalhes da OS atualizados!");
      reset({}, { keepValues: true }); // Reseta o estado 'isDirty' mantendo os valores
    },
    onError: (error) => handleMutationError(error, "atualizar detalhes"),
  });

  const addItemMutation = useMutation({
    mutationFn: (payload: { materialId: number; quantidade: number }) => 
      createItemOs({ ...payload, ordemServicoId: osId, responsavelAdicao: authUser?.userName || "Sistema" }),
    onSuccess: () => handleMutationSuccess("Material adicionado!"),
    onError: (error) => handleMutationError(error, "adicionar material"),
  });

  const deleteItemMutation = useMutation({
    mutationFn: (itemId: number) => deleteItemOs(itemId),
    onSuccess: () => handleMutationSuccess("Material removido!"),
    onError: (error) => handleMutationError(error, "remover material"),
  });

  // --- Handlers ---
  const onFormSubmit = (data: OsDetailsFormData) => {
    updateDetailsMutation.mutate(data);
  };
  
  const handleAddMaterial = (materialId: number) => {
    const quantidade = prompt("Qual a quantidade a ser adicionada?", "1");
    if (quantidade && !isNaN(Number(quantidade)) && Number(quantidade) > 0) {
      addItemMutation.mutate({ materialId, quantidade: Number(quantidade) });
    }
  };

  // --- Renderização ---
  if (isLoadingOs) {
    return <Flex justify="center" align="center" className="h-screen"><Spinner label="Carregando Ordem de Serviço..." size="lg" /></Flex>;
  }

  if (isOsError) {
    return (
      <Flex justify="center" align="center" className="h-screen p-8">
        <Callout.Root color="red" size="2">
            <Callout.Icon><ServerCrash /></Callout.Icon>
            <Callout.Text>Erro ao carregar os dados da OS. Tente recarregar a página.</Callout.Text>
        </Callout.Root>
      </Flex>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <Toaster richColors position="top-right" />
      <Box className="max-w-7xl mx-auto">
        
        {/* Cabeçalho da Página */}
        <Flex align="center" justify="between" mb="6">
          <Button variant="soft" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <Flex direction="column" align="center" gap="1">
            <Heading size={{initial: "6", md: "8"}} className="text-gray-800">Ordem de Serviço</Heading>
            <Chip 
              color={os?.isAuthorized ? "success" : "warning"} 
              variant="flat"
              startContent={os?.isAuthorized ? <Lock className="w-4 h-4"/> : <Edit3 className="w-4 h-4"/>}
            >
              Nº {os?.numeroOs} - {os?.isAuthorized ? 'Finalizada' : 'Em Edição'}
            </Chip>
          </Flex>
          <Box className="w-24" />
        </Flex>

        {/* Layout Principal (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Coluna Esquerda: Detalhes da OS */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-5">
            <Card>
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <Flex direction="column" gap="5" p="4">
                  <Heading size="5">Detalhes da OS</Heading>
                  <Controller
                    name="numeroOs"
                    control={control}
                    render={({ field }) => (
                      <TextField.Root>
                        <TextField.Slot><Text size="2" color="gray">Nº OS</Text></TextField.Slot>
                        <TextField.Input {...field} size="3" placeholder="Ex: OS2024-001" disabled={updateDetailsMutation.isPending} />
                      </TextField.Root>
                    )}
                  />
                  <Controller
                    name="descricao"
                    control={control}
                    render={({ field }) => (
                      <TextArea {...field} size="3" placeholder="Descrição detalhada do serviço..." disabled={updateDetailsMutation.isPending} />
                    )}
                  />
                  <Controller
                    name="responsaveisExecucao"
                    control={control}
                    render={({ field }) => (
                      <TextField.Root>
                          <TextField.Slot><User className="w-4 h-4 text-gray-500" /></TextField.Slot>
                          <TextField.Input {...field} size="3" placeholder="Nomes dos responsáveis" disabled={updateDetailsMutation.isPending} />
                      </TextField.Root>
                    )}
                  />
                  <Controller
                    name="observacoes"
                    control={control}
                    render={({ field }) => (
                      <TextArea {...field} size="2" placeholder="Observações adicionais..." disabled={updateDetailsMutation.isPending} />
                    )}
                  />
                  {isDirty && (
                    <Button type="submit" size="3" disabled={updateDetailsMutation.isPending}>
                      <Save className="w-4 h-4 mr-2" />
                      {updateDetailsMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  )}
                </Flex>
              </form>
            </Card>
          </motion.div>

          {/* Coluna Direita: Materiais */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-7 space-y-6">
            <Card>
              <Flex direction="column" p="4" gap="4">
                <Heading size="5">Materiais Aplicados</Heading>
                {!os?.isAuthorized && (
                  <Autocomplete
                      label="Adicionar Material à OS"
                      placeholder="Busque por descrição..."
                      startContent={<Search size={18} />}
                      onInputChange={setSearchTerm}
                      items={searchResults}
                      size="lg"
                  >
                      {(item) => (
                          <AutocompleteItem key={item.material.id} onPress={() => handleAddMaterial(item.material.id)}>
                              <Flex justify="between">
                                <Text>{item.material.descricao}</Text>
                                <Chip size="sm" color="secondary" variant="flat">Estoque: {item.saldoFinal || 0}</Chip>
                              </Flex>
                          </AutocompleteItem>
                      )}
                  </Autocomplete>
                )}
                
                <Separator size="4" my="2" />

                {isLoadingMateriais ? (
                  <Flex justify="center" p="6"><Spinner label="Carregando materiais..." /></Flex>
                ) : materiaisOs.length > 0 ? (
                  <Table.Root variant="surface">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>Descrição</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell align="center">Qtd</Table.ColumnHeaderCell>
                        {!os?.isAuthorized && <Table.ColumnHeaderCell />}
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {materiaisOs.map((item) => (
                        <Table.Row key={item.id}>
                          <Table.Cell>{item.material.descricao}</Table.Cell>
                          <Table.Cell align="center">
                            <Text weight="bold">{item.quantidade} {item.material.unidade}</Text>
                          </Table.Cell>
                          {!os?.isAuthorized && (
                            <Table.Cell>
                              <Tooltip content="Remover Material">
                                <IconButton size="1" color="red" variant="ghost" onClick={() => deleteItemMutation.mutate(item.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </IconButton>
                              </Tooltip>
                            </Table.Cell>
                          )}
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                ) : (
                  <Flex direction="column" align="center" gap="3" p="8" className="border-2 border-dashed border-gray-200 rounded-lg">
                      <FileQuestion className="w-12 h-12 text-gray-300"/>
                      <Text color="gray">Nenhum material adicionado a esta OS.</Text>
                  </Flex>
                )}
              </Flex>
            </Card>
          </motion.div>

        </div>
      </Box>
    </motion.div>
  );
}


