// src/app/(os-management)/editing-os/[osId]/page.tsx

"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from 'sonner';
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

// --- UI Components & Icons ---
import { 
  Card, Flex, Heading, Text, Button, Table, TextField, TextArea, 
  Callout, Separator, Box, IconButton 
} from '@radix-ui/themes';
import { Autocomplete, AutocompleteItem, Spinner, Chip, Tooltip } from "@nextui-org/react";
import { 
  ArrowLeft, Edit3, Trash2, Save, Search, Package, Plus, Lock, Info, 
  ServerCrash, FileQuestion, User, MessageSquarePlus, Send 
} from 'lucide-react';

// --- Services, Hooks & Interfaces ---
import { 
  getOsById, updateOsDetails, getMateriaisOs, createItemOs, deleteItemOs 
} from '@/app/services/OrdemSeparacao.Service';
import { searchByDescription } from '@/app/services/Material.Services';
import { IOrdemSeparacao } from '@/app/interfaces/IOrdemSeparacao';
import { IItem } from '@/app/interfaces/IItem';
import { IInventario } from '@/app/interfaces/IInventarios';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/app/hooks/useDebounce';

dayjs.locale('pt-br');

// --- Zod Schema for Form Validation ---
const osDetailsSchema = z.object({
  numeroOs: z.string().min(1, "Número da OS é obrigatório"),
  descricao: z.string().min(3, "Descrição precisa de ao menos 3 caracteres"),
  responsaveisExecucao: z.string().optional(),
  observacoes: z.string().optional(),
});
type OsDetailsFormData = z.infer<typeof osDetailsSchema>;

// --- Animation Variants ---
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }
};

// --- Main Component ---
export default function EditingOsPage({ params }: { params: { osId: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: authUser } = useAuth();
  const osId = parseInt(params.osId, 10);

  // --- UI & Form State ---
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemQty, setNewItemQty] = useState<number | "">(1);

  // --- React Hook Form ---
  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<OsDetailsFormData>({
    resolver: zodResolver(osDetailsSchema),
    defaultValues: { numeroOs: '', descricao: '', responsaveisExecucao: '', observacoes: '' }
  });

  // --- TanStack Queries ---
  const { data: os, isLoading: isLoadingOs, isError: isOsError, } = useQuery<IOrdemSeparacao, Error>({
    queryKey: ['osDetails', osId],
    queryFn: () => getOsById(osId) as Promise<IOrdemSeparacao>,
    enabled: !!osId,
    // onSuccess: (data) => {
    //   reset({
    //     numeroOs: data.numeroOs || '',
    //     descricao: data.descricao || '',
    //     responsaveisExecucao: data.responsaveisExecucao || '',
    //     observacoes: data.observacoes || '',
    //   });
    // },
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

  // 🎓 CONCEITO: Estado Derivado com `useMemo`.
  // 🤔 PORQUÊ: Evita recálculos a cada render e garante que as listas
  //    sejam sempre um reflexo fiel dos dados do servidor, nossa fonte única de verdade.
  const { registeredItems, nonRegisteredItems } = useMemo(() => {
    const registered = materiaisOs.filter(item => item.materialId != null);
    const nonRegistered = materiaisOs.filter(item => item.materialId == null);
    return { registeredItems: registered, nonRegisteredItems: nonRegistered };
  }, [materiaisOs]);
  // --- Mutation Callbacks ---
  const handleMutationSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ['materiaisOs', osId] });
  };
  const handleMutationError = (error: any, action: string) => {
    toast.error(`Falha ao ${action}`, { description: error.message });
  };

  // --- TanStack Mutations ---
  const updateDetailsMutation = useMutation({
    mutationFn: (data: OsDetailsFormData) => updateOsDetails(osId, data),
    onSuccess: () => {
      handleMutationSuccess("Detalhes da OS atualizados!");
      reset({}, { keepValues: true });
    },
    onError: (error) => handleMutationError(error, "atualizar detalhes"),
  });

  const createItemMutation = useMutation({
    mutationFn: createItemOs,
    onSuccess: () => {
      handleMutationSuccess("Item adicionado à OS!");
      setNewItemDesc("");
      setNewItemQty(1);
    },
    onError: (error) => handleMutationError(error, "adicionar item"),
  });

  const deleteItemMutation = useMutation({
    mutationFn: deleteItemOs,
    onSuccess: () => handleMutationSuccess("Item removido!"),
    onError: (error) => handleMutationError(error, "remover item"),
  });

  // --- Action Handlers ---
  const onFormSubmit = (data: OsDetailsFormData) => updateDetailsMutation.mutate(data);
  
  const handleAddMaterial = (materialId: number) => {
    console.log(authUser.userName);
    const quantidade = prompt("Qual a quantidade a ser adicionada?", "1");
    if (quantidade && !isNaN(Number(quantidade)) && Number(quantidade) > 0) {
      createItemMutation.mutate({
        materialId,
        quantidade: Number(quantidade),
        ordemSeparacaoId: osId,
        responsavel: authUser?.userName || "Sistema"
      });
    }
  };

  const handleAddNonRegisteredItem = () => {
    console.log(authUser.userName);
    if (!newItemDesc.trim() || !newItemQty || newItemQty <= 0) {
      toast.warning("Preencha a descrição e a quantidade.");
      return;
    }
    createItemMutation.mutate({
      descricaoNaoCadastrado: newItemDesc.trim(),
      quantidade: Number(newItemQty),
      ordemSeparacaoId: osId,
      responsavel: authUser?.userName 
    });
  };

  const handleGenerateWhatsAppMessage = useCallback(() => {
    const registeredItemsText = registeredItems.map(item => `- ${item.quantidade} ${item.material.unidade || 'UN'} de ${item.material.descricao}`).join('\n');
    const nonRegisteredItemsText = nonRegisteredItems.map(item => `- ${item.quantidade} UN de ${item.descricaoNaoCadastrado}`).join('\n');
    
    let message = `*Lista de Materiais para OS: ${(os as IOrdemSeparacao)?.id}*\n\n`;
    if (registeredItemsText) message += "*Itens Cadastrados:*\n" + registeredItemsText + '\n\n';
    if (nonRegisteredItemsText) message += "*Itens Não Cadastrados:*\n" + nonRegisteredItemsText;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  }, [registeredItems, nonRegisteredItems, os]);

  // --- Render Logic ---
  if (isLoadingOs) return <Flex justify="center" align="center" className="h-screen"><Spinner label="Carregando..." size="lg" /></Flex>;
  if (isOsError) return <Flex justify="center" align="center" className="h-screen p-8"><Callout.Root color="red" size="2"><Callout.Icon><ServerCrash /></Callout.Icon><Callout.Text>Erro ao carregar dados.</Callout.Text></Callout.Root></Flex>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <Toaster richColors position="top-right" />
      <Box className="max-w-7xl mx-auto">
        
        <Flex align="center" justify="between" mb="6">
          <Button variant="soft" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
          <Flex direction="column" align="center" gap="1">
            <Heading size={{initial: "6", md: "8"}} className="text-gray-800">Ordem de Separação Nº {(os as IOrdemSeparacao).id} </Heading>
            <Chip color={(os as IOrdemSeparacao)?.isAuthorized ? "success" : "warning"} variant="flat" startContent={(os as IOrdemSeparacao)?.isAuthorized ? <Lock className="w-4 h-4"/> : <Edit3 className="w-4 h-4"/>}>
              Nº {(os as IOrdemSeparacao)?.id} - {(os as IOrdemSeparacao)?.isAuthorized ? 'Finalizada' : 'Em Edição'}
            </Chip>
          </Flex>
          <Box className="w-24" />
        </Flex>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-5">
            <Card>
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <Flex direction="column" gap="5" p="4">
                  <Heading size="5">Detalhes da Ordem De Separação</Heading>
                
                  <Controller name="descricao" control={control} render={({ field }) => <TextArea {...field} size="3" placeholder="Descrição detalhada do serviço..." disabled={updateDetailsMutation.isPending} />} />
                  <Controller name="responsaveisExecucao" control={control} render={({ field }) => <TextField.Root><TextField.Slot><User className="w-4 h-4 text-gray-500" /></TextField.Slot><TextField.Input {...field} size="3" placeholder="Nomes dos responsáveis" disabled={updateDetailsMutation.isPending} /></TextField.Root>} />
                  <Controller name="observacoes" control={control} render={({ field }) => <TextArea {...field} size="2" placeholder="Observações adicionais..." disabled={updateDetailsMutation.isPending} />} />
                  {isDirty && <Button type="submit" size="3" disabled={updateDetailsMutation.isPending}><Save className="w-4 h-4 mr-2" />{updateDetailsMutation.isPending ? 'Salvando...' : 'Salvar Detalhes'}</Button>}
                </Flex>
              </form>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-7 space-y-6">
            <Card>
              <Flex direction="column" p="4" gap="4">
                <Heading size="5">Materiais Cadastrados</Heading>
                {!(os as IOrdemSeparacao)?.isAuthorized && <Autocomplete label="Adicionar Material" placeholder="Busque por descrição..." startContent={<Search size={18} />} onInputChange={setSearchTerm} items={searchResults} size="lg">
                    {(item) => (<AutocompleteItem key={item.material.id} onPress={() => handleAddMaterial(Number(item.material.id))}><Flex justify="between"><Text>{item.material.descricao}</Text><Chip size="sm" color="secondary" variant="flat">Estoque: {item.saldoFinal || 0}</Chip></Flex></AutocompleteItem>)}
                </Autocomplete>}
                <Separator size="4" my="2" />
                {isLoadingMateriais ? <Spinner /> : registeredItems.length > 0 ? (
                  <Table.Root variant="surface">
                    <Table.Header><Table.Row><Table.ColumnHeaderCell>Descrição</Table.ColumnHeaderCell><Table.ColumnHeaderCell align="center">Qtd</Table.ColumnHeaderCell><Table.ColumnHeaderCell /></Table.Row></Table.Header>
                    <Table.Body>
                      {registeredItems.map((item) => <Table.Row key={item.id}><Table.Cell>{item.material.descricao}</Table.Cell><Table.Cell align="center"><Text weight="bold">{item.quantidade} {item.material.unidade}</Text></Table.Cell><Table.Cell>{!(os as IOrdemSeparacao)?.isAuthorized && <Tooltip content="Remover"><IconButton size="1" color="red" variant="ghost" onClick={() => deleteItemMutation.mutate(item.id)}><Trash2 className="w-4 h-4" /></IconButton></Tooltip>}</Table.Cell></Table.Row>)}
                    </Table.Body>
                  </Table.Root>
                ) : <Flex direction="column" align="center" gap="2" p="6" className="border-2 border-dashed rounded-lg"><Package className="w-10 h-10 text-gray-300" /><Text color="gray">Nenhum material cadastrado.</Text></Flex>}
              </Flex>
            </Card>
            
            {!(os as IOrdemSeparacao)?.isAuthorized && <Card>
              <Flex direction="column" p="4" gap="4">
                  <Heading size="5">Materiais Não Cadastrados</Heading>
                  <Flex direction={{ initial: 'column', sm: 'row' }} gap="3" align="end">
                      <TextField.Root className="flex-grow"><TextField.Slot><MessageSquarePlus className="text-slate-400" /></TextField.Slot><TextField.Input placeholder="Descrição do novo item" value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} /></TextField.Root>
                      <TextField.Root className="w-full sm:w-24"><TextField.Input type="number" placeholder="Qtd." value={newItemQty} onChange={(e) => setNewItemQty(Number(e.target.value))} min="1" /></TextField.Root>
                      <Button onClick={handleAddNonRegisteredItem} disabled={!newItemDesc.trim() || createItemMutation.isPending}><Plus className="w-4 h-4 mr-1" /> Adicionar</Button>
                  </Flex>
                  {nonRegisteredItems.length > 0 && <>
                      <Separator size="4" my="2" />
                      <Table.Root variant="surface">
                          <Table.Header><Table.Row><Table.ColumnHeaderCell>Descrição</Table.ColumnHeaderCell><Table.ColumnHeaderCell align="center">Qtd</Table.ColumnHeaderCell><Table.ColumnHeaderCell /></Table.Row></Table.Header>
                          <Table.Body>
                              {nonRegisteredItems.map(item => <Table.Row key={item.id}><Table.Cell>{item.descricaoNaoCadastrado}</Table.Cell><Table.Cell align="center"><Text weight="bold">{item.quantidade} UN</Text></Table.Cell><Table.Cell><Tooltip content="Remover"><IconButton size="1" color="red" variant="ghost" onClick={() => deleteItemMutation.mutate(item.id)}><Trash2 className="w-4 h-4" /></IconButton></Tooltip></Table.Cell></Table.Row>)}
                          </Table.Body>
                      </Table.Root>
                  </>}
              </Flex>
            </Card>}
          </motion.div>
        </div>
        
        <AnimatePresence>
            {(registeredItems.length > 0 || nonRegisteredItems.length > 0) && (
                <motion.div initial={{ scale: 0, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0, y: 50 }} className="fixed bottom-8 right-8 z-20">
                    <Button size="3" color="green" radius="full" className="shadow-lg" onClick={handleGenerateWhatsAppMessage}>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Lista via WhatsApp
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
}