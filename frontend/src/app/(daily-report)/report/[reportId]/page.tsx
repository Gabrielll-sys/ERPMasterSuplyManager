"use client";

import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button, Flex, TextField, Text } from '@radix-ui/themes'; // Usando Radix Themes
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Dialog } from '@radix-ui/themes';
import * as DialogPrimitive from '@radix-ui/react-dialog';
// Imports de Serviços e Interfaces (sem alterações)
import IconFileEarmarkPdf from '@/app/assets/icons/IconFileEarmarkPdf';
import IconPlusSquare from '@/app/assets/icons/IconPlus';
import Atividade from '@/app/componentes/Atividade';
import RelatorioDiarioPDF from '@/app/componentes/RelatorioDiarioPDF';
import { IAtividadeRd } from "@/app/interfaces/IAtividadeRd";
import { IImagemAtividadeRd } from '@/app/interfaces/IImagemAtividadeRd';
import { IRelatorioDiario } from "@/app/interfaces/IRelatorioDiario";
import { createAtividadeRd, deleteAtividadeRd, getAllAtivdadesInRd, updateAtividadeRd } from "@/app/services/AtvidadeRd.Service";
import { deleteImagemAtividadeRd, getAllImagensInAtividade } from '@/app/services/ImagensAtividadeRd.Service';
import { deleteAllImagesFromAtividadeFromAzure } from '@/app/services/Images.Services';
import { getEmpresaRelatorioDiario, getRelatorioDiarioById, updateFinishRelatorioDiario, updateRelatorioDiario } from "@/app/services/RelatorioDiario.Services";
import { Spinner } from '@nextui-org/react';

// Interfaces locais
interface IUser {
    role: string;
    // Adicione outras propriedades do usuário conforme necessário
}

interface ReportParams {
    reportId: string;
}

// Constantes
const CONFIRM_AUTHORIZE_TEXT = "AUTORIZAR";
const STALE_TIME_DEFAULT = 1000 * 60 * 5; // 5 minutos

// Mensagens de Alerta
const MSG_SUCCESS_PREFIX = "Sucesso: ";
const MSG_ERROR_PREFIX = "Erro: ";
const MSG_ACTIVITY_ADDED = "Atividade adicionada ao relatório.";
const MSG_ACTIVITY_REMOVED = "Atividade removida.";
const MSG_ACTIVITY_UPDATED = "Atividade atualizada.";
const MSG_REPORT_UPDATED = "Relatório diário atualizado.";
const MSG_REPORT_FINISHED = "Relatório diário finalizado.";
const MSG_GENERIC_ERROR = "Ocorreu um erro. Tente novamente.";
const MSG_FINISH_REPORT_ERROR = "Falha ao finalizar o relatório.";
const MSG_UPDATE_REPORT_ERROR = "Falha ao atualizar o relatório.";
const MSG_CREATE_ACTIVITY_ERROR = "Falha ao adicionar atividade.";
const MSG_DELETE_ACTIVITY_ERROR = "Falha ao remover atividade.";
const MSG_UPDATE_ACTIVITY_ERROR = "Falha ao atualizar atividade.";


export default function Report({ params }: { params: ReportParams }) {
    const route = useRouter();
    const queryClient = useQueryClient(); // Para invalidação de queries

    // --- State ---
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [formData, setFormData] = useState<Partial<IRelatorioDiario>>({});
    const [descricaoAtividade, setDescricaoAtividade] = useState<string>("");

    // Snackbar State
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>('info');

    // Dialog States
    const [isFinalizeDialogOpen, setIsFinalizeDialogOpen] = useState(false);
    const [confirmAuthorizeMessage, setConfirmAuthorizeMessage] = useState<string>("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [activityToDeleteId, setActivityToDeleteId] = useState<number | null>(null);

    // --- Effects ---
    useEffect(() => {
        const userString = localStorage.getItem("currentUser");
        if (userString) {
            try {
                setCurrentUser(JSON.parse(userString) as IUser);
            } catch (error) {
                console.error("Erro ao parsear currentUser do localStorage:", error);
                // Lidar com erro, talvez redirecionar para login
            }
        } else {
            // Redirecionar para login se não houver usuário?
            // route.push('/login');
        }
    }, [route]);

    // --- Calculated Values ---
    const conditionsRoles = currentUser?.role === "Administrador" || currentUser?.role === "Diretor" || currentUser?.role === "SuporteTecnico";
    const reportId = params.reportId;

    // --- React Query ---
    const reportQueryKey = ["relatorio-diario", reportId];
    const activitiesQueryKey = ["atividades", `atividades-rd-${reportId}`];

    // Query para buscar o Relatório Diário
    const { data: relatorioDiario, isLoading: isLoadingRelatorio, error: errorRelatorio, refetch: refetchRelatorioDiario } = useQuery(
        reportQueryKey,
        () => getRelatorioDiarioById(reportId),
        {
            staleTime: STALE_TIME_DEFAULT,
            cacheTime: STALE_TIME_DEFAULT * 2,
            onSuccess: (data) => {
                // Inicializa/Atualiza o formData quando os dados do relatório chegam
                setFormData({
                    empresa: data.empresa || '',
                    contato: data.contato || '',
                    cnpj: data.cnpj || '',
                    telefone: data.telefone || '',
                    endereco: data.endereco || '',
                    // NÃO inclua id, responsavelAbertura, isFinished aqui, eles não são editáveis diretamente no form
                });
            },
            onError: (err) => {
                console.error(MSG_ERROR_PREFIX + "buscar relatório:", err);
                showSnackbar(MSG_GENERIC_ERROR, "error");
            }
        }
    );

    // Query para buscar as Atividades do Relatório
    const { data: atividades, isLoading: isLoadingAtividades, error: errorAtividades, refetch: refetchAtividades } = useQuery<IAtividadeRd[]>(
        activitiesQueryKey,
        () => getAllAtivdadesInRd(reportId),
        {
            staleTime: STALE_TIME_DEFAULT,
            cacheTime: STALE_TIME_DEFAULT * 2,
            enabled: !!relatorioDiario, // Só busca atividades se o relatório foi carregado
            onError: (err) => {
                console.error(MSG_ERROR_PREFIX + "buscar atividades:", err);
                showSnackbar(MSG_GENERIC_ERROR, "error");
            }
        }
    );

    // --- Mutations ---

    // Mutação para atualizar detalhes do Relatório Diário
    const updateReportMutation = useMutation(
        (updatedRd: Partial<IRelatorioDiario>) => updateRelatorioDiario({ ...updatedRd, id: relatorioDiario!.id }), // Garante que o ID está presente
        {
            onSuccess: () => {
                showSnackbar(MSG_REPORT_UPDATED, "success");
                queryClient.invalidateQueries(reportQueryKey); // Revalida a query do relatório
            },
            onError: (err) => {
                console.error(MSG_ERROR_PREFIX + "atualizar relatório:", err);
                showSnackbar(MSG_UPDATE_REPORT_ERROR, "error");
            },
        }
    );

    // Mutação para criar Atividade
    const createActivityMutation = useMutation(
        (newActivity: Omit<IAtividadeRd, 'id' | 'relatorioDiario'>) => createAtividadeRd(newActivity),
        {
            onSuccess: () => {
                showSnackbar(MSG_ACTIVITY_ADDED, "success");
                setDescricaoAtividade(""); // Limpa input
                queryClient.invalidateQueries(activitiesQueryKey); // Revalida a query de atividades
            },
            onError: (err) => {
                console.error(MSG_ERROR_PREFIX + "criar atividade:", err);
                showSnackbar(MSG_CREATE_ACTIVITY_ERROR, "error");
            },
        }
    );

        // Mutação para atualizar Atividade (passada para o componente Atividade)
        const updateActivityMutation = useMutation(
            (task: IAtividadeRd) => updateAtividadeRd(task),
            {
                onSuccess: () => {
                    showSnackbar(MSG_ACTIVITY_UPDATED, "success");
                    queryClient.invalidateQueries(activitiesQueryKey);
                },
                onError: (err) => {
                    console.error(MSG_ERROR_PREFIX + "atualizar atividade:", err);
                    showSnackbar(MSG_UPDATE_ACTIVITY_ERROR, "error");
                }
            }
        );

    // Mutação para deletar Atividade
    const deleteActivityMutation = useMutation(
        async (id: number) => {
            const imagens: IImagemAtividadeRd[] = await getAllImagensInAtividade(id);
            if (imagens.length > 0) {
                 // Idealmente, mostrar um indicador enquanto deleta do Azure
                await deleteAllImagesFromAtividadeFromAzure(imagens);
                // Não precisamos deletar explicitamente do DB aqui se o deleteAtividadeRd cuida disso em cascata no backend
                // Se não for em cascata, você precisaria iterar e chamar deleteImagemAtividadeRd aqui também.
            }
             // Deleta a atividade principal
            await deleteAtividadeRd(id);
            return id; // Retorna o ID para usar no onSuccess se necessário
        },
        {
            onSuccess: () => {
                showSnackbar(MSG_ACTIVITY_REMOVED, "success");
                queryClient.invalidateQueries(activitiesQueryKey);
                setIsDeleteDialogOpen(false); // Fecha o dialog de confirmação
                setActivityToDeleteId(null);
            },
            onError: (err) => {
                console.error(MSG_ERROR_PREFIX + "deletar atividade:", err);
                showSnackbar(MSG_DELETE_ACTIVITY_ERROR, "error");
                setIsDeleteDialogOpen(false); // Fecha o dialog mesmo em erro
                setActivityToDeleteId(null);
            },
        }
    );


    // Mutação para finalizar o Relatório Diário
    const finalizeReportMutation = useMutation(
        () => updateFinishRelatorioDiario(reportId),
        {
            onSuccess: () => {
                showSnackbar(MSG_REPORT_FINISHED, "success");
                queryClient.invalidateQueries(reportQueryKey); // Revalida o relatório para pegar isFinished=true
                setIsFinalizeDialogOpen(false); // Fecha o dialog
                setConfirmAuthorizeMessage(""); // Limpa input de confirmação
            },
            onError: (err) => {
                console.error(MSG_ERROR_PREFIX + "finalizar relatório:", err);
                showSnackbar(MSG_FINISH_REPORT_ERROR, "error");
            },
        }
    );

    // --- Handlers ---

    const showSnackbar = (message: string, severity: AlertColor) => {
        setMessageAlert(message);
        setSeveridadeAlert(severity);
        setOpenSnackBar(true);
    };

    const handleInputChange = useCallback((field: keyof typeof formData, value: string) => {
        // Aplica toUpperCase() seletivamente se necessário
        const processedValue = (field === 'empresa' || field === 'contato') ? value.toUpperCase() : value;
        setFormData(prev => ({ ...prev, [field]: processedValue }));
    }, []);

    // Salva as alterações do formulário principal (chamado no onBlur)
    const handleUpdateReportDetails = useCallback(async () => {
        if (!relatorioDiario || updateReportMutation.isLoading) return; // Evita salvar se não houver dados ou já estiver salvando

        // Verifica se houve mudança real antes de chamar a API
        const changed = Object.keys(formData).some(key =>
            formData[key as keyof typeof formData] !== relatorioDiario[key as keyof IRelatorioDiario]
        );

        if (changed) {
             // Prepara o payload apenas com os campos do formData e o ID obrigatório
             const payload: IRelatorioDiario = {
                ...relatorioDiario, // Pega a base do relatório atual (inclui ID, responsavel, etc.)
                ...formData, // Sobrescreve com os dados do formulário
             };
            updateReportMutation.mutate(payload);
        }
    }, [formData, relatorioDiario, updateReportMutation]);


    // Busca dados da empresa (exemplo, pode precisar de debounce)
    const getInformacoesEmpresaRd = useCallback(async (empresaNome: string) => {
        if (empresaNome.length > 2 && !relatorioDiario?.isFinished) { // Exemplo: busca após 3 caracteres
            try {
                const res = await getEmpresaRelatorioDiario(empresaNome);
                // Atualiza formData E dispara o save
                setFormData(prev => ({
                    ...prev,
                    cnpj: res.cnpj || prev.cnpj, // Mantem o anterior se a resposta for vazia
                    contato: res.contato?.toUpperCase() || prev.contato,
                    endereco: res.endereco || prev.endereco,
                    telefone: res.telefone || prev.telefone,
                }));
                 // Chama o update após atualizar o estado local com os dados da empresa
                 // Usar um useEffect dependente de formData ou chamar diretamente aqui pode causar chamadas duplicadas.
                 // Idealmente, um botão "Salvar" ou debounce no handleUpdateReportDetails seria melhor.
                 // Por ora, vamos confiar no onBlur do campo empresa para salvar.
            } catch (error) {
                console.error("Erro ao buscar dados da empresa:", error);
                // Opcional: Mostrar erro no snackbar
            }
        }
    }, [relatorioDiario?.isFinished]); // Depende apenas do status finished

     // Cria nova atividade
     const handleCreateActivity = useCallback(async () => {
        if (!descricaoAtividade.trim() || !relatorioDiario || createActivityMutation.isLoading || relatorioDiario.isFinished) return;

        const atividadeRd: Omit<IAtividadeRd, 'id' | 'relatorioDiario'> = { // Tipagem correta para create
            descricao: descricaoAtividade.trim(),
            relatorioRdId: relatorioDiario.id,
            // status e observacoes podem ter valores padrão no backend ou serem undefined
        };
        createActivityMutation.mutate(atividadeRd);
    }, [descricaoAtividade, relatorioDiario, createActivityMutation]);


    // Abre o dialog de confirmação para deletar
    const handleOpenDeleteDialog = (id: number) => {
        if(relatorioDiario?.isFinished) return; // Não deletar se finalizado
        setActivityToDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    // Confirma a deleção da atividade
    const handleConfirmDeleteActivity = () => {
        if (activityToDeleteId !== null && !deleteActivityMutation.isLoading) {
            deleteActivityMutation.mutate(activityToDeleteId);
        }
    };

    // Atualiza uma atividade existente (chamado pelo componente Atividade)
    const handleUpdateActivity = useCallback((atividade: IAtividadeRd, status: string | undefined, observacoes: string | undefined, descricao: string | undefined) => {
        if (updateActivityMutation.isLoading || relatorioDiario?.isFinished) return;

        const updatedActivity: IAtividadeRd = {
            ...atividade, // Pega a base da atividade
            status: status,
            observacoes: observacoes,
            descricao: descricao,
        };
        updateActivityMutation.mutate(updatedActivity);

    }, [updateActivityMutation, relatorioDiario?.isFinished]);


    // Finaliza o relatório
    const handleFinalizeReport = () => {
        if (confirmAuthorizeMessage === CONFIRM_AUTHORIZE_TEXT && !finalizeReportMutation.isLoading && !relatorioDiario?.isFinished) {
            finalizeReportMutation.mutate();
        }
    };

    // --- Renderização ---

    if (isLoadingRelatorio || !currentUser) {
        return <Flex justify="center" align="center" className="h-[50vh]"><Spinner size="lg" /> <Text ml="2">Carregando...</Text></Flex>;
    }

    if (errorRelatorio) {
        return <Flex justify="center" align="center" className="h-[50vh]" direction="column">
                <Text color="red">Erro ao carregar o relatório.</Text>
                <Button onClick={() => refetchRelatorioDiario()} mt="2">Tentar Novamente</Button>
               </Flex>;
    }

    if (!relatorioDiario) {
         // Pode acontecer se a busca falhar silenciosamente ou ID for inválido
        return <Flex justify="center" align="center" className="h-[50vh]"><Text color="orange">Relatório não encontrado.</Text></Flex>;
    }

    const isFinished = !!relatorioDiario.isFinished;

    return (
        <>
            <Flex direction="column" gap="6" align="center" p="4">

                {/* Cabeçalho */}
                <Flex direction="column" align="center" gap="1">
                    <Text size="6" weight="bold" align="center">
                        Relatório Diário Nº {relatorioDiario.id}
                    </Text>
                    <Text size="3" weight="medium" align="center">
                        Responsável: {relatorioDiario.responsavelAbertura}
                    </Text>
                    <Text size="4" weight="bold" align="center" color={isFinished ? "gray" : "green"} className={isFinished ? "italic" : ""}>
                        Status: {isFinished ? "Relatório Concluído" : "Relatório Em Análise"}
                    </Text>
                </Flex>

                {/* Formulário de Detalhes do Relatório */}
                <Flex direction="column" gap="4" className="w-[90%] sm:w-[70%] md:w-[600px]">
                    <Flex gap="4" wrap={{ initial: 'wrap', sm: 'nowrap' }}>
                        <TextField.Root className="flex-grow">
                            <TextField.Input
                                placeholder='Cliente'
                                value={formData.empresa || ''}
                                onChange={(e) => handleInputChange('empresa', e.target.value)}
                                onBlur={() => {
                                    getInformacoesEmpresaRd(formData.empresa || ''); // Tenta buscar dados da empresa
                                    handleUpdateReportDetails(); // Salva ao sair do campo
                                }}
                                disabled={isFinished || updateReportMutation.isLoading}
                                maxLength={100} // Adicionar limites se aplicável
                            />
                        </TextField.Root>
                        <TextField.Root className="flex-grow">
                            <TextField.Input
                                placeholder='Endereço'
                                value={formData.endereco || ''}
                                onChange={(e) => handleInputChange('endereco', e.target.value)}
                                onBlur={handleUpdateReportDetails}
                                disabled={isFinished || updateReportMutation.isLoading}
                                maxLength={200}
                            />
                        </TextField.Root>
                    </Flex>
                    <Flex gap="4" wrap={{ initial: 'wrap', sm: 'nowrap' }}>
                        <TextField.Root className="flex-grow">
                            <TextField.Input
                                placeholder='CNPJ'
                                value={formData.cnpj || ''}
                                onChange={(e) => handleInputChange('cnpj', e.target.value)}
                                onBlur={handleUpdateReportDetails}
                                disabled={isFinished || updateReportMutation.isLoading}
                                maxLength={18} // Ex: 00.000.000/0000-00
                            />
                        </TextField.Root>
                        <TextField.Root className="flex-grow">
                            <TextField.Input
                                placeholder='Telefone'
                                value={formData.telefone || ''}
                                onChange={(e) => handleInputChange('telefone', e.target.value)}
                                onBlur={handleUpdateReportDetails}
                                disabled={isFinished || updateReportMutation.isLoading}
                                maxLength={15} // Ex: (00) 90000-0000
                            />
                        </TextField.Root>
                          <TextField.Root className="flex-grow">
                            <TextField.Input
                                placeholder='Contato'
                                value={formData.contato || ''}
                                onChange={(e) => handleInputChange('contato', e.target.value)}
                                onBlur={handleUpdateReportDetails}
                                disabled={isFinished || updateReportMutation.isLoading}
                                maxLength={100}
                            />
                        </TextField.Root>
                    </Flex>
                     {/* Indicador de salvamento (opcional) */}
                     {updateReportMutation.isLoading && <Text size="1" color="gray">Salvando alterações...</Text>}
                </Flex>

                {/* Botão Finalizar e PDF */}
                <Flex gap="4" justify="center" align="center" mt="2">
                     {/* Botão Finalizar - Só para roles autorizadas e se não estiver finalizado */}
                    {conditionsRoles && !isFinished && (
                        <Button
                            color="ruby"
                            variant='solid'
                            onClick={() => setIsFinalizeDialogOpen(true)}
                            disabled={finalizeReportMutation.isLoading} // Desabilitado enquanto finaliza
                        >
                            {finalizeReportMutation.isLoading ? <Spinner /> : "Finalizar Relatório"}
                        </Button>
                    )}

                     {/* Botão Gerar PDF - Sempre visível se tiver dados */}
                     {atividades && ( // Verifica se 'atividades' (dados da query) existe
                            <Button
                                color='gray'
                                variant='outline'
                                highContrast
                                disabled={!atividades} // Desabilitado se não houver atividades carregadas
                            >
                                <PDFDownloadLink
                                    document={
                                        <RelatorioDiarioPDF
                                            relatorioDiario={relatorioDiario} // Passa o objeto completo
                                            atividadesRd={atividades || []} // Passa as atividades da query
                                        />
                                    }
                                    fileName={`Relatorio_Diario_${relatorioDiario.id}.pdf`}
                                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }} // Estilos para o link parecer um botão
                                >
                                    {({ blob, url, loading, error }) => (
                                        loading ? 'Gerando PDF...' : (
                                            <>
                                                <IconFileEarmarkPdf height="1.3em" width="1.3em" />
                                                Baixar PDF
                                            </>
                                        )
                                    )}
                                </PDFDownloadLink>
                            </Button>
                     )}
                </Flex>


                {/* Seção de Atividades */}
                <Flex direction="column" gap="5" className="w-[95%] sm:w-[80%] md:w-[700px] border-1 border-gray-300 p-4 rounded-md shadow">

                    {/* Adicionar Nova Atividade */}
                    {!isFinished && (
                        <Flex gap="3" align="center" justify="center" className='max-sm:flex-wrap'>
                            <TextField.Root className="flex-grow">
                                <TextField.Input
                                    placeholder='Nova Atividade...'
                                    value={descricaoAtividade}
                                    onChange={(e) => setDescricaoAtividade(e.target.value)}
                                    disabled={createActivityMutation.isLoading || isFinished}
                                    maxLength={255}
                                    // Considerar adicionar onKeyDown={e => { if (e.key === 'Enter') handleCreateActivity(); }} se desejado
                                />
                            </TextField.Root>
                            <Button
                                onClick={handleCreateActivity}
                                disabled={!descricaoAtividade.trim() || createActivityMutation.isLoading || isFinished}
                                variant='soft'
                                size="2"
                                aria-label="Adicionar Atividade"
                                style={{cursor: (!descricaoAtividade.trim() || createActivityMutation.isLoading || isFinished) ? 'not-allowed': 'pointer'}}
                                >
                                {createActivityMutation.isLoading ? <Spinner /> : <IconPlusSquare height={"1.5em"} width={"1.5em"} />}
                                <Text ml="1" className='max-sm:hidden'>Adicionar</Text> {/* Texto opcional para telas maiores */}
                            </Button>
                        </Flex>
                    )}

                    {/* Lista de Atividades */}
                    {isLoadingAtividades ? (
                         <Flex justify="center" align="center" p="5"><Spinner  /> <Text ml="2">Carregando atividades...</Text></Flex>
                    ) : errorAtividades ? (
                         <Flex justify="center" align="center" p="5" direction="column">
                            <Text color="red">Erro ao carregar atividades.</Text>
                            <Button onClick={() => refetchAtividades()} mt="2" size="1" variant='soft'>Tentar Novamente</Button>
                         </Flex>
                    ) : atividades && atividades.length > 0 ? (
                        <Flex direction="column" gap="4">
                           {atividades.map((atividade: IAtividadeRd) => (
                                <Atividade
                                    key={atividade.id}
                                    relatorioDiario={relatorioDiario} // Passa o objeto RD
                                    atividade={atividade}
                                    onUpdate={handleUpdateActivity} // Passa a função de update
                                    onDelete={() => handleOpenDeleteDialog(atividade.id!)} // Abre dialog de confirmação
                                    isFinished={isFinished} // Passa o status de finalizado
                                    // Passar isLoading das mutações se Atividade precisar desabilitar algo durante update/delete específico dela
                                    //isUpdating={updateActivityMutation.isLoading && updateActivityMutation.variables?.id === atividade.id}
                                    //isDeleting={deleteActivityMutation.isLoading && activityToDeleteId === atividade.id}
                                />
                            ))}
                        </Flex>
                    ) : (
                        <Text align="center" color="gray" p="5">Nenhuma atividade adicionada ainda.</Text>
                    )}
                </Flex>

            </Flex> {/* Main Flex Container */}

             {/* --- Dialogs --- */}

            {/* Dialog Finalizar Relatório */}
            <Dialog.Root open={isFinalizeDialogOpen} onOpenChange={setIsFinalizeDialogOpen}>
                <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent" style={{ maxWidth: 450 }}>
                        <Dialog.Title className="DialogTitle text-red-700">ATENÇÃO</Dialog.Title>
                        <Dialog.Description className="DialogDescription text-center">
                            Finalize o relatório somente quando tiver certeza absoluta. Esta ação não pode ser desfeita facilmente.
                            <br />Digite <strong className='text-red-600'>{CONFIRM_AUTHORIZE_TEXT}</strong> para confirmar.
                        </Dialog.Description>
                        <Flex direction="column" gap="3" mt="4">
                            <TextField.Root>
                                <TextField.Input
                                    placeholder={`Digite ${CONFIRM_AUTHORIZE_TEXT}`}
                                    value={confirmAuthorizeMessage}
                                    onChange={(e) => setConfirmAuthorizeMessage(e.target.value)}
                                    disabled={finalizeReportMutation.isLoading}
                                    autoCapitalize='characters'
                                />
                            </TextField.Root>
                        </Flex>
                        <Flex gap="3" mt="5" justify="end">
                             <DialogPrimitive.Close asChild>
                                <Button variant="soft" color="gray" disabled={finalizeReportMutation.isLoading}>
                                    Cancelar
                                </Button>
                             </DialogPrimitive.Close>
                            <Button
                                color="blue"
                                onClick={handleFinalizeReport}
                                disabled={confirmAuthorizeMessage !== CONFIRM_AUTHORIZE_TEXT || finalizeReportMutation.isLoading || isFinished}
                            >
                                {finalizeReportMutation.isLoading ? <Spinner size="1" /> : "Autorizar Finalização"}
                            </Button>
                        </Flex>
                        <DialogPrimitive.Close asChild>
                           <button className="IconButton" aria-label="Close"> {/* Botão de fechar X */}
                                {/* <Cross2Icon /> */} X
                           </button>
                        </DialogPrimitive.Close>
                    </Dialog.Content>
                </DialogPrimitive.Portal>
            </Dialog.Root>

             {/* Dialog Confirmar Deleção Atividade */}
             <Dialog.Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent" style={{ maxWidth: 450 }}>
                        <Dialog.Title className="DialogTitle">Confirmar Remoção</Dialog.Title>
                        <Dialog.Description className="DialogDescription">
                            Tem certeza que deseja remover esta atividade? Todas as imagens associadas também serão excluídas permanentemente.
                        </Dialog.Description>
                        <Flex gap="3" mt="5" justify="end">
                            <DialogPrimitive.Close asChild>
                                <Button variant="soft" color="gray" disabled={deleteActivityMutation.isLoading}>
                                    Cancelar
                                </Button>
                            </DialogPrimitive.Close>
                            <Button
                                color="red" // Cor vermelha para ação destrutiva
                                onClick={handleConfirmDeleteActivity}
                                disabled={deleteActivityMutation.isLoading}
                            >
                                {deleteActivityMutation.isLoading ? <Spinner /> : "Sim, Remover Atividade"}
                            </Button>
                        </Flex>
                         <DialogPrimitive.Close asChild>
                           <button className="IconButton" aria-label="Close"> X </button>
                        </DialogPrimitive.Close>
                    </Dialog.Content>
                </DialogPrimitive.Portal>
            </Dialog.Root>


            {/* Snackbar para feedback */}
            <Snackbar
                open={openSnackBar}
                autoHideDuration={3000} // Duração um pouco maior
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={() => setOpenSnackBar(false)}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={() => setOpenSnackBar(false)}
                    severity={severidadeAlert}
                    sx={{ width: "100%" }}
                >
                    {messageAlert}
                </MuiAlert>
            </Snackbar>
        </>
    );
}

// Adicione alguns estilos CSS globais ou em um arquivo CSS separado para os Dialogs do Radix
/* Exemplo no seu global.css ou similar:
.DialogOverlay {
  background-color: rgba(0, 0, 0, 0.44);
  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.DialogContent {
  background-color: white;
  border-radius: 6px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 500px; // Ajuste conforme necessário
  max-height: 85vh;
  padding: 25px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 100; // Garante que fique acima de outros elementos
}
.DialogContent:focus {
  outline: none;
}

.DialogTitle {
  margin: 0;
  font-weight: 500;
  color: var(--mauve-12);
  font-size: 17px;
}

.DialogDescription {
  margin: 10px 0 20px;
  color: var(--mauve-11);
  font-size: 15px;
  line-height: 1.5;
}

.IconButton {
  font-family: inherit;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--violet-11);
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
}
.IconButton:hover { background-color: var(--violet-4); }
.IconButton:focus { box-shadow: 0 0 0 2px var(--violet-7); }


@keyframes overlayShow {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes contentShow {
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

*/