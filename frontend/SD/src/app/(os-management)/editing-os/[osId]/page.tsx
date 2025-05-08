"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  CircularProgress, // Usado para feedback de atualização de campo
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";

import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from "@mui/material/Alert";

import { url } from '@/app/api/webApiUrl';
import { IInventario } from '@/app/interfaces/IInventarios';
import { IItem } from '@/app/interfaces/IItem';
import { IOrderServico } from '@/app/interfaces/IOrderServico'; // Ajuste conforme sua definição
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from "axios";
import dayjs from 'dayjs';
import "dayjs/locale/pt-br";
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from "react";

dayjs.locale("pt-br");

// Tipos (ajuste conforme suas interfaces globais)
interface EditingOsOrderServico extends IOrderServico {
  // Se precisar de campos adicionais específicos para esta view
}
interface EditingOsItem extends IItem { }
interface EditingOsInventario extends IInventario { }

// --- Funções de API para React Query ---
const fetchOsDetailsAPI = async (osId: number): Promise<EditingOsOrderServico> => {
  const { data } = await axios.get(`${url}/OrdemServicos/${osId}`);
  return data;
};

const fetchMateriaisOsAPI = async (osId: number): Promise<EditingOsItem[]> => {
  const { data } = await axios.get(`${url}/Itens/GetAllMateriaisOs/${osId}`);
  return data;
};

const fetchAllMateriaisInventarioAPI = async (): Promise<EditingOsInventario[]> => {
  const { data } = await axios.get(`${url}/Inventarios`);
  return data;
};

// Tipos para payload de atualização da OS
type UpdateOsPayload = {
  id: number;
  numeroOs?: string;
  descricao?: string;
  responsaveisExecucao?: string;
  observacoes?: string;
};

const updateOsDetailsAPI = async (payload: UpdateOsPayload): Promise<EditingOsOrderServico> => {
  const { data } = await axios.put(`${url}/OrdemServicos/${payload.id}`, payload);
  return data;
};

const authorizeOsAPI = async (payload: { osId: number; responsavelAutorizacao: string; precoVendaTotalOs: string; precoCustoTotalOs: string; }): Promise<EditingOsOrderServico> => {
  const { osId, ...rest } = payload;
  const { data } = await axios.put(`${url}/OrdemServicos/updateAuthorize/${osId}`, rest);
  return data;
};

const createItemAPI = async (payload: { materialId: number; responsavelAdicao: string; ordemServicoId: number; quantidade: number; }): Promise<EditingOsItem> => {
  const { data } = await axios.post(`${url}/Itens/CreateItem`, payload);
  return data;
};

const updateItemAPI = async (payload: { itemId: number; materialId: number; responsavelAdicao?: string; responsavelMudanca: string; ordemServicoId: number; quantidade: number; }): Promise<EditingOsItem> => {
  const { itemId, ...rest } = payload;
  const { data } = await axios.put(`${url}/Itens/${itemId}`, rest);
  return data;
};

const deleteItemAPI = async (itemId: number): Promise<void> => {
  await axios.delete(`${url}/Itens/${itemId}`);
};


export default function EditingOs({ params }: { params: { osId: string } }) {
  const { data: session } = useSession();
  const osId = parseInt(params.osId);
  const queryClient = useQueryClient();

  // Estados dos Inputs (controlados localmente para edição)
  const [numeroOsInput, setNumeroOsInput] = useState<string>("");
  const [descricaoOsInput, setDescricaoOsInput] = useState<string>("");
  const [participantesOsInput, setParticipantesOsInput] = useState<string>("");
  const [observacaoInput, setObservacaoInput] = useState<string>("");

  // Estados dos Modais e Seleções
  const { isOpen: isAddItemModalOpen, onOpen: onAddItemModalOpen, onClose: onAddItemModalClose } = useDisclosure();
  const { isOpen: isEditItemModalOpen, onOpen: onEditItemModalOpen, onClose: onEditItemModalClose } = useDisclosure();
  const { isOpen: isAuthorizeModalOpen, onOpen: onAuthorizeModalOpen, onClose: onAuthorizeModalClose } = useDisclosure();

  const [selectedInventarioItem, setSelectedInventarioItem] = useState<EditingOsInventario | null>(null);
  const [selectedOsItemToEdit, setSelectedOsItemToEdit] = useState<EditingOsItem | null>(null);
  const [quantidadeModal, setQuantidadeModal] = useState<string>("");
  const [confirmAuthorizeMessage, setConfirmAuthorizeMessage] = useState<string>("");
  const [fieldUpdating, setFieldUpdating] = useState<string | null>(null); // Para feedback de atualização de campo

  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor | undefined }>({ open: false, message: "", severity: undefined });
  const openSnackbar = (message: string, severity: AlertColor) => setSnackbar({ open: true, message, severity });

  // --- React Query: Queries ---
  const { data: os, isLoading: isLoadingOs, error: osError } = useQuery<EditingOsOrderServico, AxiosError>(
    ['osDetails', osId],
    () => fetchOsDetailsAPI(osId),
    {
      enabled: !!osId, // Só executa se osId for válido
      onSuccess: (data) => {
        // Sincroniza inputs com dados carregados/atualizados
        setNumeroOsInput(data.numeroOs || "");
        const parts = data.descricao?.split('-') || [];
        setDescricaoOsInput(parts.length > 2 ? parts.slice(2).join('-').trim() : data.descricao || "");
        setParticipantesOsInput(data.responsaveisExecucao || "");
        setObservacaoInput(data.observacoes || "");
      },
      onError: () => openSnackbar("Falha ao carregar dados da OS.", "error")
    }
  );

  const { data: materiaisOs = [], error: materiaisOsError } = useQuery<EditingOsItem[], AxiosError>(
    ['materiaisOs', osId],
    () => fetchMateriaisOsAPI(osId),
    {
      enabled: !!osId,
      onError: () => openSnackbar("Falha ao carregar materiais da OS.", "error")
    }
  );

  const { data: todosOsMateriaisInventario = [], error: inventarioError } = useQuery<EditingOsInventario[], AxiosError>(
    ['allInventario'],
    fetchAllMateriaisInventarioAPI,
    {
        onError: () => openSnackbar("Falha ao carregar lista de materiais do inventário.", "error")
    }
  );

  // Cálculo de Preços
  const calcularPrecos = useCallback((itens: EditingOsItem[]): { custo: number; venda: number } => {
    let custoTotal = 0;
    let vendaTotal = 0;
    for (const item of itens) {
      if (item.material && typeof item.material.precoCusto === 'number' && typeof item.quantidade === 'number') {
        custoTotal += item.material.precoCusto * item.quantidade;
      }
      if (item.material && typeof item.material.precoVenda === 'number' && typeof item.quantidade === 'number') {
        vendaTotal += item.material.precoVenda * item.quantidade;
      }
    }
    return { custo: custoTotal, venda: vendaTotal };
  }, []);
  const { custo: precoCustoTotalOs, venda: precoVendaTotalOs } = calcularPrecos(materiaisOs);


  // --- React Query: Mutations ---
  const updateOsFieldMutation = useMutation<EditingOsOrderServico, AxiosError, { field: string, value: string }>(
    async ({ field, value }) => {
      if (!os) throw new Error("OS não carregada.");
      
      // Recria a descrição completa se o campo alterado for numeroOsInput ou descricaoOsInput
      let finalNumeroOs = field === 'numeroOs' ? value.trim().replace(/\s\s+/g, " ") : numeroOsInput;
      let finalDescricaoInput = field === 'descricaoOs' ? value.trim().replace(/\s\s+/g, " ") : descricaoOsInput;
      
      const descricaoCompleta = `${finalNumeroOs}-${finalDescricaoInput}`;

      const payload: UpdateOsPayload = {
        id: os.id,
        numeroOs: field === 'numeroOs' ? value : os.numeroOs,
        descricao: (field === 'numeroOs' || field === 'descricaoOs') ? descricaoCompleta : os.descricao,
        responsaveisExecucao: field === 'responsaveisExecucao' ? value : os.responsaveisExecucao,
        observacoes: field === 'observacoes' ? value : os.observacoes,
      };
      return updateOsDetailsAPI(payload);
    },
    {
      onMutate: ({ field }) => {
        setFieldUpdating(field);
      },
      onSuccess: (data) => {
        queryClient.setQueryData(['osDetails', osId], data); // Atualiza o cache localmente
        // openSnackbar("Campo atualizado com sucesso!", "success"); // Opcional: feedback mais discreto
      },
      onError: (error, variables) => {
        console.error(`Erro ao atualizar campo ${variables.field}:`, error);
        openSnackbar(`Falha ao atualizar campo ${variables.field}.`, "error");
        // Reverter para o valor original se a API falhar (opcional, mas bom UX)
        // Isso requer armazenar os valores originais ou refazer o fetch.
        // Por simplicidade, pode-se apenas invalidar e refazer o fetch:
        queryClient.invalidateQueries(['osDetails', osId]);
      },
      onSettled: () => {
        setFieldUpdating(null);
      }
    }
  );

  const authorizeOsMutation = useMutation<EditingOsOrderServico, AxiosError, { responsavelAutorizacao: string; precoVendaTotalOs: string; precoCustoTotalOs: string }>(
    (payload) => authorizeOsAPI({ ...payload, osId }),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['osDetails', osId], data);
        openSnackbar("OS autorizada com sucesso!", "success");
        onAuthorizeModalClose();
      },
      onError: (error) => {
        console.error("Erro ao autorizar OS:", error);
        openSnackbar("Falha ao autorizar OS.", "error");
      }
    }
  );

  const addItemMutation = useMutation<EditingOsItem, AxiosError, { materialId: number; quantidade: number; }>(
    (payload) => createItemAPI({ ...payload, ordemServicoId: osId, responsavelAdicao: session?.user?.name || "N/A" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['materiaisOs', osId]);
        openSnackbar("Material adicionado à OS!", "success");
        onAddItemModalClose();
      },
      onError: (error) => {
        console.error("Erro ao adicionar item:", error);
        openSnackbar("Falha ao adicionar material.", "error");
      }
    }
  );

  const updateItemMutation = useMutation<EditingOsItem, AxiosError, { itemId: number; materialId: number; quantidade: number; responsavelAdicao?: string; }>(
    (payload) => updateItemAPI({ ...payload, ordemServicoId: osId, responsavelMudanca: session?.user?.name || "N/A" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['materiaisOs', osId]);
        openSnackbar("Quantidade do material atualizada!", "success");
        onEditItemModalClose();
      },
      onError: (error) => {
        console.error("Erro ao atualizar item:", error);
        openSnackbar("Falha ao atualizar quantidade.", "error");
      }
    }
  );

  const deleteItemMutation = useMutation<void, AxiosError, number>(
    deleteItemAPI,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['materiaisOs', osId]);
        openSnackbar("Material removido da OS.", "success");
      },
      onError: (error) => {
        console.error("Erro ao remover item:", error);
        openSnackbar("Falha ao remover material.", "error");
      }
    }
  );

  // Handlers para atualização automática de campos
  const handleFieldUpdate = (fieldName: string, currentValue: string, originalValue: string | undefined) => {
    const trimmedCurrentValue = currentValue.trim();
    const trimmedOriginalValue = originalValue?.trim();

    if (trimmedCurrentValue !== trimmedOriginalValue && !updateOsFieldMutation.isLoading) {
        if (fieldName === 'numeroOs' && os) {
             updateOsFieldMutation.mutate({ field: fieldName, value: trimmedCurrentValue});
        } else if (fieldName === 'descricaoOs' && os) {
             updateOsFieldMutation.mutate({ field: fieldName, value: trimmedCurrentValue});
        } else if (fieldName === 'responsaveisExecucao' && os) {
             updateOsFieldMutation.mutate({ field: fieldName, value: trimmedCurrentValue });
        } else if (fieldName === 'observacoes' && os) {
             updateOsFieldMutation.mutate({ field: fieldName, value: trimmedCurrentValue });
        }
    }
  };


  // Handlers para Modais e Ações de Itens
  const handleOpenAddItemModal = (inventarioItem: EditingOsInventario) => {
    setSelectedInventarioItem(inventarioItem);
    setQuantidadeModal("1"); // Default para 1
    onAddItemModalOpen();
  };

  const handleOpenEditItemModal = (osItem: EditingOsItem) => {
    setSelectedOsItemToEdit(osItem);
    const invItem = todosOsMateriaisInventario.find(inv => inv.material.id === osItem.material.id);
    setSelectedInventarioItem(invItem || null);
    setQuantidadeModal(osItem.quantidade.toString());
    onEditItemModalOpen();
  };

  const handleConfirmAddItem = () => {
    if (!selectedInventarioItem || !os || !quantidadeModal || Number(quantidadeModal) <= 0) {
      openSnackbar("Quantidade inválida.", "warning");
      return;
    }
    if (selectedInventarioItem.saldoFinal !== null && Number(quantidadeModal) > selectedInventarioItem.saldoFinal) {
      openSnackbar("Quantidade solicitada excede o estoque.", "warning");
      return;
    }
    addItemMutation.mutate({ materialId: Number(selectedInventarioItem.material.id), quantidade: Number(quantidadeModal) });
  };

  const handleConfirmUpdateItem = () => {
    if (!selectedOsItemToEdit || !os || !quantidadeModal || Number(quantidadeModal) <= 0) {
      openSnackbar("Quantidade inválida.", "warning");
      return;
    }
    if (selectedInventarioItem && selectedInventarioItem.saldoFinal !== null && Number(quantidadeModal) > selectedInventarioItem.saldoFinal) {
        openSnackbar("Quantidade excede o estoque.", "warning");
        return;
    }
    updateItemMutation.mutate({
      itemId: selectedOsItemToEdit.id,
      materialId: selectedOsItemToEdit.material.id,
      quantidade: Number(quantidadeModal),
      responsavelAdicao: selectedOsItemToEdit.responsavelAdicao
    });
  };

  const handleRemoveMaterialFromOs = (itemId: number) => {
    if (!window.confirm("Tem certeza que deseja remover este material da OS?")) return;
    deleteItemMutation.mutate(itemId);
  };
  
  const handleOpenAuthorizeModalView = () => {
    setConfirmAuthorizeMessage("");
    onAuthorizeModalOpen();
  };

  const handleConfirmAuthorizeOsAction = () => {
    if (!os || confirmAuthorizeMessage !== "AUTORIZAR") return;
    const custoFinal = typeof precoCustoTotalOs === 'number' ? precoCustoTotalOs.toFixed(2) : "0.00";
    const vendaFinal = typeof precoVendaTotalOs === 'number' ? precoVendaTotalOs.toFixed(2) : "0.00";
    authorizeOsMutation.mutate({
      responsavelAutorizacao: session?.user?.name || "N/A",
      precoVendaTotalOs: vendaFinal,
      precoCustoTotalOs: custoFinal,
    });
  };


  if (isLoadingOs || !os) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Carregando Ordem de Serviço..." color="primary" size="lg" />
      </div>
    );
  }
  
  // --- JSX ---
  return (
    <>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <header className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Editando Ordem de Serviço: {os.numeroOs || `ID ${os.id}`}
          </h1>
          {os.isAuthorized && (
            <Chip color="success" startContent={<LockClosedIcon className="h-4 w-4" />} className="mt-2">
              OS FECHADA (Autorizada em {dayjs(os.dataAutorizacao).format("DD/MM/YYYY HH:mm")})
            </Chip>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <Card shadow="md">
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-700">Detalhes da OS</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Número da OS"
                  value={numeroOsInput}
                  onValueChange={setNumeroOsInput}
                  variant="bordered"
                  isReadOnly={os.isAuthorized || updateOsFieldMutation.isLoading}
                  onBlur={() => handleFieldUpdate('numeroOs', numeroOsInput, os.numeroOs)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFieldUpdate('numeroOs', numeroOsInput, os.numeroOs)}
                  endContent={fieldUpdating === 'numeroOs' ? <CircularProgress size="sm" aria-label="Salvando..." /> : null}
                />
                <Input
                  label="Título da OS (após o número)"
                  value={descricaoOsInput}
                  onValueChange={setDescricaoOsInput}
                  variant="bordered"
                  isReadOnly={os.isAuthorized || updateOsFieldMutation.isLoading}
                  description="Ex: MANUTENÇÃO PREVENTIVA TORNO CNC"
                  onBlur={() => {
                    const originalDescricaoInput = (os.descricao?.split('-').slice(2).join('-').trim()) || "";
                    handleFieldUpdate('descricaoOs', descricaoOsInput, originalDescricaoInput);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (() => {
                    const originalDescricaoInput = (os.descricao?.split('-').slice(2).join('-').trim()) || "";
                    handleFieldUpdate('descricaoOs', descricaoOsInput, originalDescricaoInput);
                  })()}
                  endContent={fieldUpdating === 'descricaoOs' ? <CircularProgress size="sm" aria-label="Salvando..." /> : null}
                />
                <Input
                  label="Responsáveis pela Execução"
                  value={participantesOsInput}
                  onValueChange={setParticipantesOsInput}
                  variant="bordered"
                  isReadOnly={os.isAuthorized || updateOsFieldMutation.isLoading}
                  placeholder="Nomes separados por vírgula"
                  onBlur={() => handleFieldUpdate('responsaveisExecucao', participantesOsInput, os.responsaveisExecucao)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFieldUpdate('responsaveisExecucao', participantesOsInput, os.responsaveisExecucao)}
                  endContent={fieldUpdating === 'responsaveisExecucao' ? <CircularProgress size="sm" aria-label="Salvando..." /> : null}
                />
                <Textarea
                  label="Observações sobre a OS"
                  value={observacaoInput}
                  onValueChange={setObservacaoInput}
                  variant="bordered"
                  minRows={5} maxRows={10}
                  placeholder="Detalhes sobre a execução, problemas encontrados, etc."
                  isReadOnly={os.isAuthorized || updateOsFieldMutation.isLoading}
                  onBlur={() => handleFieldUpdate('observacoes', observacaoInput, os.observacoes)}
                  // onKeyDown não é comum para Textarea para submeter, mas onBlur cobre o caso.
                  endContent={fieldUpdating === 'observacoes' ? <CircularProgress size="sm" aria-label="Salvando..." /> : null}
                />
              </CardBody>
              {!os.isAuthorized && (
                <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    color="warning"
                    variant="ghost"
                    startContent={<LockClosedIcon className="h-5 w-5" />}
                    onPress={handleOpenAuthorizeModalView} // Corrigido para não chamar diretamente onAuthorizeModalOpen
                    isLoading={authorizeOsMutation.isLoading}
                    isDisabled={updateOsFieldMutation.isLoading}
                  >
                    {authorizeOsMutation.isLoading ? "Autorizando..." : "Autorizar OS"}
                  </Button>
               
                </CardFooter>
              )}
            </Card>
          </div>

          {/* Coluna Direita: Materiais */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <Card shadow="md">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-700">Materiais da OS</h2>
                {!os.isAuthorized && (
                  <Autocomplete
                    label="Adicionar Material"
                    placeholder="Busque por ID, descrição ou marca"
                    variant="bordered" size="md"
                    className="w-full sm:max-w-xs"
                    items={todosOsMateriaisInventario.filter(inv => inv.saldoFinal === null || inv.saldoFinal === undefined || inv.saldoFinal > 0)}
                    isLoading={todosOsMateriaisInventario.length === 0 && inventarioError == null} // Só mostra loading se não houver erro
                    isDisabled={os.isAuthorized || updateOsFieldMutation.isLoading}
                    onSelectionChange={(key) => {
                      if (key) {
                        const selected = todosOsMateriaisInventario.find(m => m.id.toString() === key.toString());
                        if (selected) handleOpenAddItemModal(selected);
                      }
                    }}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.id} textValue={`${item.material.id} - ${item.material.descricao}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold">{item.material.descricao}</span>
                            <span className="text-xs text-gray-500 ml-2">(ID: {item.material.id})</span>
                          </div>
                          <Chip size="sm" color={item.saldoFinal && item.saldoFinal > 0 ? "success" : "default"} variant="flat">
                            Est: {item.saldoFinal ?? "N/D"} {item.material.unidade}
                          </Chip>
                        </div>
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              </CardHeader>
              <CardBody>
                {materiaisOs.length > 0 ? (
                  <Table aria-label="Lista de materiais na OS" removeWrapper>
                    <TableHeader>
                      <TableColumn>ID</TableColumn>
                      <TableColumn>DESCRIÇÃO</TableColumn>
                      <TableColumn className="text-right">QTD</TableColumn>
                      <TableColumn>UN</TableColumn>
                      <TableColumn>ADICIONADO POR</TableColumn>
                      <TableColumn>DATA ADIÇÃO</TableColumn>
                      {!os.isAuthorized?<></>:  <TableColumn className="text-center">AÇÕES</TableColumn>}
                    </TableHeader>
                    <TableBody items={materiaisOs} emptyContent="Nenhum material nesta OS." isLoading={deleteItemMutation.isLoading || updateItemMutation.isLoading}>
                      {(item) => (
                        
                        <TableRow key={item.id}>
                          <TableCell>{item.material.id}</TableCell>
                          <TableCell>{item.material.descricao}</TableCell>
                          <TableCell className="text-right">{item.quantidade}</TableCell>
                          <TableCell>{item.material.unidade}</TableCell>
                          <TableCell className="text-xs">{item.responsavelAdicao || "N/A"}</TableCell>
                          <TableCell className="text-xs">{dayjs(item.dataAdicaoItem).format("DD/MM/YY HH:mm")}</TableCell>
                          <TableCell className="flex justify-center gap-1">
                          {!os.isAuthorized && (
                            <>
                              <Tooltip content="Editar Quantidade">
                                <Button isIconOnly size="sm" variant="light" onPress={() => handleOpenEditItemModal(item)} isDisabled={deleteItemMutation.isLoading || updateOsFieldMutation.isLoading}>
                                  <PencilIcon className="h-5 w-5 text-primary" />
                                </Button>
                              </Tooltip>
                              <Tooltip content="Remover Material">
                                <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleRemoveMaterialFromOs(item.id)} isDisabled={updateItemMutation.isLoading || updateOsFieldMutation.isLoading}>
                                  <TrashIcon className="h-5 w-5" />
                                </Button>
                              </Tooltip>
                              </>
                          )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 py-4">Nenhum material adicionado a esta Ordem de Serviço.</p>
                )}
              </CardBody>
              <CardFooter className="flex flex-col items-end gap-1 pt-4 border-t dark:border-gray-700">
                <p className="text-sm font-semibold">Preço de Custo Total: R$ {precoCustoTotalOs.toFixed(2).replace('.', ',')}</p>
                <p className="text-sm font-semibold">Preço de Venda Total: R$ {precoVendaTotalOs.toFixed(2).replace('.', ',')}</p>
                <p className="text-xs text-gray-500">Tipos de materiais: {materiaisOs.length}</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Modais (Adicionar, Editar, Autorizar) - Estrutura similar à anterior, mas usando os handlers de mutação */}
        {/* Modal para Adicionar Item */}
        <Modal isOpen={isAddItemModalOpen} onClose={onAddItemModalClose} backdrop="blur">
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader>Adicionar Material: {selectedInventarioItem?.material.descricao}</ModalHeader>
                <ModalBody>
                    <p className="text-sm">
                    Estoque disponível: {selectedInventarioItem?.saldoFinal ?? "N/D"} {selectedInventarioItem?.material.unidade}
                    </p>
                    <Input
                    type="number"
                    label="Quantidade"
                    placeholder="0"
                    value={quantidadeModal}
                    onValueChange={setQuantidadeModal}
                    endContent={<span className="text-default-400 text-small">{selectedInventarioItem?.material.unidade}</span>}
                    autoFocus
                    min={1}
                    isInvalid={selectedInventarioItem?.saldoFinal !== null && selectedInventarioItem?.saldoFinal !== undefined && Number(quantidadeModal) > selectedInventarioItem.saldoFinal}
                    errorMessage={selectedInventarioItem?.saldoFinal !== null && selectedInventarioItem?.saldoFinal !== undefined && Number(quantidadeModal) > selectedInventarioItem.saldoFinal ? "Quantidade excede o estoque." : ""}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>Cancelar</Button>
                    <Button
                    color="primary"
                    onPress={handleConfirmAddItem}
                    isLoading={addItemMutation.isLoading}
                    isDisabled={!quantidadeModal || Number(quantidadeModal) <= 0 || (selectedInventarioItem?.saldoFinal !== null && selectedInventarioItem?.saldoFinal !== undefined && Number(quantidadeModal) > selectedInventarioItem.saldoFinal)}
                    >
                    Adicionar
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>

        {/* Modal para Editar Item */}
        <Modal isOpen={isEditItemModalOpen} onClose={onEditItemModalClose} backdrop="blur">
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader>Editar Quantidade: {selectedOsItemToEdit?.material.descricao}</ModalHeader>
                <ModalBody>
                    <p className="text-sm">
                        Estoque atual do material (se aplicável): {selectedInventarioItem?.saldoFinal ?? "N/D"} {selectedOsItemToEdit?.material.unidade}
                    </p>
                    <p className="text-sm">Quantidade atual na OS: {selectedOsItemToEdit?.quantidade} {selectedOsItemToEdit?.material.unidade}</p>
                    <Input
                    type="number"
                    label="Nova Quantidade"
                    placeholder="0"
                    value={quantidadeModal}
                    onValueChange={setQuantidadeModal}
                    endContent={<span className="text-default-400 text-small">{selectedOsItemToEdit?.material.unidade}</span>}
                    autoFocus
                    min={1}
                    isInvalid={selectedInventarioItem?.saldoFinal !== null && selectedInventarioItem?.saldoFinal !== undefined && Number(quantidadeModal) > selectedInventarioItem.saldoFinal}
                    errorMessage={selectedInventarioItem?.saldoFinal !== null && selectedInventarioItem?.saldoFinal !== undefined && Number(quantidadeModal) > selectedInventarioItem.saldoFinal ? "Quantidade excede o estoque." : ""}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>Cancelar</Button>
                    <Button
                    color="primary"
                    onPress={handleConfirmUpdateItem}
                    isLoading={updateItemMutation.isLoading}
                    isDisabled={!quantidadeModal || Number(quantidadeModal) <= 0 || (selectedInventarioItem?.saldoFinal !== null && selectedInventarioItem?.saldoFinal !== undefined && Number(quantidadeModal) > selectedInventarioItem.saldoFinal)}
                    >
                    Atualizar Quantidade
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>

        {/* Modal para Autorizar OS */}
        <Modal isOpen={isAuthorizeModalOpen} onClose={onAuthorizeModalClose} backdrop="blur" size="xl">
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-6 w-6 text-warning-500" />
                    Confirmação de Autorização da OS
                </ModalHeader>
                <ModalBody className="space-y-3">
                    <p className="font-semibold">
                    OS: {os.numeroOs} - {os.descricao}
                    </p>
                    <p className="text-sm text-danger-600 font-bold">
                    ATENÇÃO: Após autorizar, os materiais e suas quantidades serão efetivamente debitados do estoque (conforme sua regra de negócio) e não será mais possível incluir, remover ou editar materiais nesta OS.
                    </p>
                    {materiaisOs.length === 0 && (
                        <p className="text-sm text-warning-700 font-semibold">
                            AVISO: Esta OS não possui nenhum material listado.
                        </p>
                    )}
                    <p className="text-sm">Para confirmar, digite "AUTORIZAR" no campo abaixo.</p>
                    <Input
                    label='Digite "AUTORIZAR" para confirmar'
                    value={confirmAuthorizeMessage}
                    onValueChange={setConfirmAuthorizeMessage}
                    variant="bordered"
                    autoFocus
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="default" variant="light" onPress={onClose}>Cancelar</Button>
                    <Button
                    color="success"
                    className="text-white font-semibold"
                    onPress={handleConfirmAuthorizeOsAction} // Corrigido
                    isLoading={authorizeOsMutation.isLoading}
                    isDisabled={confirmAuthorizeMessage !== "AUTORIZAR"}
                    >
                    Autorizar OS
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
}