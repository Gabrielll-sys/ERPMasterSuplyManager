"use client"
import { Snackbar } from '@mui/material';
import { Input, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure, Tooltip } from '@nextui-org/react';
import { useRouter } from "next/navigation";
import "dayjs/locale/pt-br";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';

import IconFileEarmarkPdf from '@/app/assets/icons/IconFileEarmarkPdf';
import IconPlusSquare from '@/app/assets/icons/IconPlus';
import Atividade from '@/app/componentes/Atividade';
import RelatorioDiarioPDF from '@/app/componentes/RelatorioDiarioPDF';
import { IAtividadeRd } from "@/app/interfaces/IAtividadeRd";
import { IImagemAtividadeRd } from '@/app/interfaces/IImagemAtividadeRd';

import { IRelatorioDiario } from "@/app/interfaces/IRelatorioDiario";
import {
    createAtividadeRd,
    deleteAtividadeRd,
    getAllAtivdadesInRd,
    updateAtividadeRd
} from "@/app/services/AtvidadeRd.Service";
import { deleteImagemAtividadeRd, getAllImagensInAtividade } from '@/app/services/ImagensAtividadeRd.Service';
import { deleteAllImagesFromAtividadeFromAzure } from '@/app/services/Images.Services';
import {
    getEmpresaRelatorioDiario,
    getRelatorioDiarioById,
    updateFinishRelatorioDiario,
    updateRelatorioDiario
} from "@/app/services/RelatorioDiario.Services";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Flex, TextField, Button } from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Building2, MapPin, Phone, FileText, User, CheckCircle, Clock, AlertCircle, Download, Loader2 } from 'lucide-react';

import './report-styles.css';

export default function Report({params}: any) {
    const route = useRouter();
    const [confirmAuthorizeMessage, setconfirmAuthorizeMessage] = useState<string>();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const conditionsRoles = currentUser?.role == "Administrador" || currentUser?.role == "Diretor" || currentUser?.role == "SuporteTecnico";
    const [empresa, setEmpresa] = useState<string>("");
    const [contato, setContato] = useState<string>('');
    const [cnpj, setCnpj] = useState<string>('');
    const [telefone, setTelefone] = useState<string>('');
    const [endereco, setEndereco] = useState<string>('');
    const [descricaoAtividade, setDescricaoAtividade] = useState<string>("");
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const [delayNovaAtividade, setDelayNovaAtividade] = useState<boolean>();
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const [imagesLoadedForPdf, setImagesLoadedForPdf] = useState(false);
    const [atividadesWithImages, setAtividadesWithImages] = useState<IAtividadeRd[]>([]);
    
    const semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

    useEffect(() => {
        //@ts-ignore
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (user != null) {
            setCurrentUser(user);
        }
    }, []);

    const {data: relatorioDiario, refetch: refetchRelatorioDiario} = useQuery({
        queryKey: ["relatorio-diario", params.reportId],
        queryFn: () => getRelatorioDiarioById(params.reportId),
        staleTime: 72000000,
        gcTime: 72000000,
    });

    useEffect(() => {
        if (relatorioDiario) {
            setEmpresa(relatorioDiario.empresa ?? "");
            setContato(relatorioDiario.contato ?? "");
            setTelefone(relatorioDiario.telefone ?? "");
            setEndereco(relatorioDiario.endereco ?? "");
            setCnpj(relatorioDiario.cnpj ?? "");
        }
    }, [relatorioDiario]);

    const {data: atividades, refetch: refetchAtividades} = useQuery<IAtividadeRd[]>({
        queryKey: ["atividades", `atividades-rd-${params.reportId}`],
        queryFn: () => getAllAtivdadesInRd(params.reportId),
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60
    });

    // Carrega todas as imagens para o PDF quando necessário
    const loadImagesForPdf = async () => {
        if (!atividades || atividades.length === 0) return;
        
        setIsPdfLoading(true);
        try {
            const atividadesComImagens: IAtividadeRd[] = [];
            
            for (const atividade of atividades) {
                const imagens = await getAllImagensInAtividade(atividade.id);
                atividadesComImagens.push({
                    ...atividade,
                    imagensAtividades: imagens,
                });
            }
            
            setAtividadesWithImages(atividadesComImagens);
            setImagesLoadedForPdf(true);
        } catch (error) {
            console.error('Erro ao carregar imagens para PDF:', error);
        } finally {
            setIsPdfLoading(false);
        }
    };

    // Carrega imagens quando atividades mudam
    useEffect(() => {
        if (atividades && atividades.length > 0) {
            loadImagesForPdf();
        }
    }, [atividades]);

    // Verifica se relatório está completo para PDF
    const isReportComplete = atividades 
        ? atividades.every(a => a.status && a.status !== 'Não Iniciada') && atividades.length > 0
        : false;

    const canGeneratePdf = isReportComplete && imagesLoadedForPdf && !isPdfLoading;

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            await handleUpdateRelatorioDiario();
        }
    };

    const getInformacoesEmpresaRd = async (empresa: string) => {
        if (empresa.length) {
            const res = await getEmpresaRelatorioDiario(empresa);
            setCnpj(res.cnpj ?? "");
            setContato(res.contato ?? "");
            setEndereco(res.endereco ?? "");
            setTelefone(res.telefone ?? "");
            handleUpdateRelatorioDiario();
        }
    };

    const handleCreateaAtividade = async () => {
        if (!relatorioDiario) return;

        setDelayNovaAtividade(true);
        const atividadeRd: IAtividadeRd = {
            descricao: descricaoAtividade,
            relatorioRdId: relatorioDiario.id,
            relatorioDiario: {}
        };
        const res: any = await createAtividadeRd(atividadeRd);
        if (res) {
            setOpenSnackBar(true);
            setSeveridadeAlert("success");
            setMessageAlert("Atividade Adicionada Ao Relatório");
            refetchAtividades();
            setDescricaoAtividade("");
        }
        setTimeout(() => {
            setDelayNovaAtividade(false);
        }, 1200);
    };

    const handleDeleteAtividade = async (id: number) => {
        const imagens: IImagemAtividadeRd[] = await getAllImagensInAtividade(id);
        
        if (imagens.length > 1) {
            await deleteAllImagesFromAtividadeFromAzure(imagens);
            await deleteAtividadeRd(id);
        } else {
            if (imagens.length) await deleteImagemAtividadeRd(imagens[0].id);
            const res = await deleteAtividadeRd(id);
            if (res) {
                setOpenSnackBar(true);
                setSeveridadeAlert("success");
                setMessageAlert("Atividade Removida");
            }
        }
        refetchAtividades();
    };

    const handleUpdateRelatorioDiario = async () => {
        if (!relatorioDiario) return;

        const rd: IRelatorioDiario = {
            id: relatorioDiario.id,
            empresa: empresa.toUpperCase(),
            contato: contato.toUpperCase(),
            cnpj: cnpj,
            telefone: telefone,
            endereco: endereco,
            responsavelAbertura: relatorioDiario.responsavelAbertura
        };

        const res = await updateRelatorioDiario(rd);

        if (res == 200) {
            setOpenSnackBar(true);
            setSeveridadeAlert("success");
            setMessageAlert("Relatório Diário Atualizado");
        }
    };

    const finalizarRelatorioDiario = useMutation({
        mutationKey: [`finalizar-rd`, `finish-relatorio-diario-${params.reportId}`],
        mutationFn: () => updateFinishRelatorioDiario(params.reportId),
        onSuccess: () => refetchRelatorioDiario()
    });

    const atualizarTarefaMutation = useMutation({
        mutationFn: (task: IAtividadeRd) => updateAtividadeRd(task),
        onSuccess: () => {
            setOpenSnackBar(true);
            setSeveridadeAlert("success");
            setMessageAlert("Atividade Atualizada");
            refetchAtividades();
        }
    });

    const updateAtividade = (atividade: IAtividadeRd, status: string | undefined, observacoes: string | undefined, descricao: string | undefined) => {
        if (atividades != undefined) {
            const novaAtividade: IAtividadeRd[] = [...atividades];
            const index = atividades.findIndex(x => x.id == atividade.id);
            novaAtividade[index].status = status;
            novaAtividade[index].observacoes = observacoes;
            novaAtividade[index].descricao = descricao;
            atualizarTarefaMutation.mutate(novaAtividade[index]);
        }
    };

    const getStatusInfo = () => {
        if (relatorioDiario?.isFinished) {
            return {
                text: "Relatório Concluído",
                icon: <CheckCircle className="w-5 h-5" />,
                className: "status-badge status-badge-completed"
            };
        }
        return {
            text: "Em Análise",
            icon: <Clock className="w-5 h-5" />,
            className: "status-badge status-badge-analysis"
        };
    };

    const statusInfo = getStatusInfo();

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
                <div className="max-w-5xl mx-auto space-y-8">
                    
                    {/* Header Section */}
                    <div className="report-header animate-fade-in-up">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-gray-300 text-sm mb-1">Relatório Diário</p>
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    Nº {relatorioDiario?.id}
                                </h1>
                                <p className="text-gray-300 mt-2 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {relatorioDiario?.responsavelAbertura}
                                </p>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-2">
                                <div className={statusInfo.className}>
                                    {statusInfo.icon}
                                    {statusInfo.text}
                                </div>
                                {relatorioDiario?.horarioAbertura && (
                                    <p className="text-gray-300 text-sm">
                                        {dayjs(relatorioDiario.horarioAbertura).format("DD/MM/YYYY [às] HH:mm")}
                                        {" • "}
                                        {semana[dayjs(relatorioDiario.horarioAbertura).day()]}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Client Info Section */}
                    <div className="glass-card p-6 animate-fade-in-up animation-delay-100">
                        <h2 className="section-title mb-6">Informações do Cliente</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="client-info-card">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="client-info-label">Empresa / Cliente</p>
                                        {!relatorioDiario?.isFinished ? (
                                            <input
                                                value={empresa}
                                                className="modern-input mt-1"
                                                onKeyDown={handleKeyDown}
                                                onBlur={handleUpdateRelatorioDiario}
                                                onChange={(x) => {
                                                    setEmpresa(x.target.value);
                                                    getInformacoesEmpresaRd(x.target.value);
                                                }}
                                                placeholder="Nome da empresa"
                                            />
                                        ) : (
                                            <p className="client-info-value">{empresa || "—"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="client-info-card">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="client-info-label">Endereço</p>
                                        {!relatorioDiario?.isFinished ? (
                                            <input
                                                value={endereco}
                                                className="modern-input mt-1"
                                                onKeyDown={handleKeyDown}
                                                onBlur={handleUpdateRelatorioDiario}
                                                onChange={(x) => setEndereco(x.target.value)}
                                                placeholder="Endereço completo"
                                            />
                                        ) : (
                                            <p className="client-info-value">{endereco || "—"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="client-info-card">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="client-info-label">CNPJ</p>
                                        {!relatorioDiario?.isFinished ? (
                                            <input
                                                value={cnpj}
                                                className="modern-input mt-1"
                                                onKeyDown={handleKeyDown}
                                                onBlur={handleUpdateRelatorioDiario}
                                                onChange={(x) => setCnpj(x.target.value)}
                                                placeholder="00.000.000/0000-00"
                                            />
                                        ) : (
                                            <p className="client-info-value">{cnpj || "—"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="client-info-card">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="client-info-label">Telefone / Contato</p>
                                        {!relatorioDiario?.isFinished ? (
                                            <input
                                                value={telefone}
                                                className="modern-input mt-1"
                                                onKeyDown={handleKeyDown}
                                                onBlur={handleUpdateRelatorioDiario}
                                                onChange={(x) => setTelefone(x.target.value)}
                                                placeholder="(00) 00000-0000"
                                            />
                                        ) : (
                                            <p className="client-info-value">{telefone || "—"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className="glass-card p-6 animate-fade-in-up animation-delay-200">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* PDF Button Section */}
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                {relatorioDiario && atividades && atividades.length > 0 && (
                                    <Tooltip
                                        content={
                                            !isReportComplete 
                                                ? "Complete todas as atividades para gerar o PDF"
                                                : isPdfLoading
                                                    ? "Carregando imagens..."
                                                    : "Clique para baixar o PDF"
                                        }
                                        placement="bottom"
                                    >
                                        <div>
                                            {canGeneratePdf ? (
                                                <PDFDownloadLink
                                                    document={
                                                        <RelatorioDiarioPDF
                                                            relatorioDiario={relatorioDiario}
                                                            atividadesRd={atividadesWithImages}
                                                        />
                                                    }
                                                    fileName={`Relatorio-Diario-${relatorioDiario.id}.pdf`}
                                                    className="pdf-button pdf-button-ready"
                                                >
                                                    <IconFileEarmarkPdf height="1.3em" width="1.3em" />
                                                    Baixar PDF
                                                </PDFDownloadLink>
                                            ) : (
                                                <button 
                                                    className={`pdf-button ${isPdfLoading ? 'pdf-button-loading' : 'pdf-button-disabled'}`}
                                                    disabled
                                                >
                                                    {isPdfLoading ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <AlertCircle className="w-5 h-5" />
                                                    )}
                                                    {isPdfLoading ? "Carregando..." : "PDF Indisponível"}
                                                </button>
                                            )}
                                        </div>
                                    </Tooltip>
                                )}
                                
                                {!isReportComplete && atividades && atividades.length > 0 && (
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Finalize todas as atividades
                                    </p>
                                )}
                            </div>

                            {/* Finish Report Button */}
                            {conditionsRoles && !relatorioDiario?.isFinished && (
                                <Button onClick={onOpen} color="blue" size="3">
                                    Fechar Relatório
                                </Button>
                            )}
                        </div>

                        {/* Progress indicator for PDF */}
                        {isPdfLoading && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">Preparando imagens para o PDF...</p>
                                <div className="progress-bar-container">
                                    <div className="progress-bar-fill" style={{ width: '50%' }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Activities Section */}
                    <div className="glass-card p-6 animate-fade-in-up animation-delay-300">
                        <h2 className="section-title mb-6">Atividades do Relatório</h2>
                        
                        {/* Add Activity Form */}
                        {!relatorioDiario?.isFinished && (
                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                                <input
                                    value={descricaoAtividade}
                                    className="modern-input flex-1"
                                    onChange={(x) => setDescricaoAtividade(x.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && descricaoAtividade.length > 0) {
                                            handleCreateaAtividade();
                                        }
                                    }}
                                    placeholder="Descreva a nova atividade..."
                                />
                                {!delayNovaAtividade && descricaoAtividade.length > 0 && (
                                    <Button
                                        onClick={handleCreateaAtividade}
                                        color="blue"
                                        size="3"
                                        className="whitespace-nowrap"
                                    >
                                        <IconPlusSquare height="1.2em" width="1.2em" />
                                        Adicionar
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Activities List */}
                        <div className="space-y-4">
                            {atividades?.length && relatorioDiario ? (
                                atividades.map((atividade: IAtividadeRd, index: number) => (
                                    <div 
                                        key={atividade.id} 
                                        className={`activity-card ${
                                            atividade.status === 'Concluída' 
                                                ? 'activity-status-concluida'
                                                : atividade.status === 'Em Andamento'
                                                    ? 'activity-status-em-andamento'
                                                    : 'activity-status-nao-iniciada'
                                        }`}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <Atividade
                                            relatorioDiario={relatorioDiario}
                                            atividade={atividade}
                                            onUpdate={updateAtividade}
                                            onDelete={handleDeleteAtividade}
                                            isFinished={relatorioDiario?.isFinished ?? false}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <FileText className="empty-state-icon" />
                                    <p className="text-lg font-medium">Sem Atividades</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Adicione atividades usando o campo acima
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Finish Report Modal */}
            <Modal isOpen={isOpen} backdrop="blur" size='xl' onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="pt-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="w-8 h-8 text-red-600" />
                                    </div>
                                    <h2 className='text-xl font-bold text-gray-900 mb-2'>
                                        Finalizar Relatório
                                    </h2>
                                    <p className='text-gray-600 mb-6'>
                                        Esta ação é irreversível. Após finalizar, o relatório não poderá mais ser editado.
                                    </p>
                                    <p className='text-sm font-medium text-gray-700 mb-2'>
                                        Digite <span className="text-red-600 font-bold">AUTORIZAR</span> para confirmar
                                    </p>
                                    <input
                                        className="modern-input text-center"
                                        onChange={(e) => setconfirmAuthorizeMessage(e.target.value)}
                                        value={confirmAuthorizeMessage}
                                        placeholder="Digite aqui..."
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter className='flex flex-row gap-4 justify-center pb-8'>
                                <Button color="gray" size='3' variant="soft" onClick={onClose}>
                                    Cancelar
                                </Button>
                                {!relatorioDiario?.isFinished && confirmAuthorizeMessage === "AUTORIZAR" && (
                                    <Button 
                                        variant='solid' 
                                        size="3" 
                                        color='red' 
                                        onClick={() => {
                                            finalizarRelatorioDiario.mutate();
                                            onClose();
                                        }}
                                    >
                                        Confirmar Finalização
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Snackbar */}
            <Snackbar
                open={openSnackBar}
                autoHideDuration={2000}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                onClose={() => setOpenSnackBar(false)}
            >
                <MuiAlert
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
