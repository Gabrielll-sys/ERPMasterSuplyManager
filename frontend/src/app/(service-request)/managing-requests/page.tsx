"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, Tab, Chip, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { Search, Clock, CheckCircle, PlayCircle, RefreshCw } from "lucide-react";
import SolicitacaoServicoForm from "@/app/componentes/SolicitacaoServicoForm";
import SolicitacaoServicoList from "@/app/componentes/SolicitacaoServicoList";
import SolicitacaoServicoDetailsModal from "@/app/componentes/SolicitacaoServicoDetailsModal";
import { ISolicitacaoServico, StatusSolicitacao } from "@/app/interfaces/ISolicitacaoServico";
import { useSolicitacaoServico } from "@/app/hooks/useSolicitacaoServico";

export default function SolicitacaoServicoPage() {
  const { user } = useAuth();
  const {
    solicitacoes,
    isLoading,
    isError,
    error,
    refetch,
    createSolicitacao,
    aceitarSolicitacao,
    concluirSolicitacao,
    deleteSolicitacao,
    isCreating,
    isActing,
  } = useSolicitacaoServico();

  // Estado local para UI
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<ISolicitacaoServico | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // 🎓 MEMO: Filtrar solicitações por status e termo de busca
  const filteredSolicitacoes = useMemo(() => {
    let filtered = [...solicitacoes];

    // Filtrar por status
    if (selectedTab !== "all") {
      const statusMap: Record<string, number> = {
        pending: StatusSolicitacao.Pendente,
        accepted: StatusSolicitacao.Aceita,
        completed: StatusSolicitacao.Concluida,
      };
      filtered = filtered.filter(s => s.status === statusMap[selectedTab]);
    }

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.nomeCliente?.toLowerCase().includes(term) ||
        s.descricao?.toLowerCase().includes(term) ||
        s.id.toString().includes(term)
      );
    }

    return filtered;
  }, [solicitacoes, selectedTab, searchTerm]);

  // Contadores para as abas
  const counts = useMemo(() => ({
    all: solicitacoes.length,
    pending: solicitacoes.filter(s => s.status === StatusSolicitacao.Pendente).length,
    accepted: solicitacoes.filter(s => s.status === StatusSolicitacao.Aceita).length,
    completed: solicitacoes.filter(s => s.status === StatusSolicitacao.Concluida).length,
  }), [solicitacoes]);

  // Handler para criar
  const handleCreate = async (payload: { descricao: string; nomeCliente: string }) => {
    createSolicitacao(payload);
  };

  // Handler para aceitar
  const handleAceitar = async (id: number) => {
    aceitarSolicitacao(id);
  };

  // Handler para concluir
  const handleConcluir = async (id: number, usuarios: string[]) => {
    concluirSolicitacao(id, usuarios);
  };

  // Handler para deletar
  const handleDelete = async (id: number) => {
    deleteSolicitacao(id);
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        {/* Header com gradiente */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Solicitações de Serviço
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Gerencie as solicitações de serviço dos clientes
              </p>
            </div>
            
            {/* Botão de refresh */}
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 
                         bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 
                         transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Atualizar
            </button>
          </div>
        </header>

        {/* Formulário de criação */}
        <SolicitacaoServicoForm
          onSubmit={handleCreate}
          isLoading={isCreating}
        />

        {/* Barra de filtros */}
        <div className="mb-6 space-y-4">
          {/* Tabs de status */}
          <Tabs 
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key.toString())}
            variant="underlined"
            classNames={{
              tabList: "gap-4 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-gradient-to-r from-blue-500 to-indigo-500",
              tab: "max-w-fit px-2 h-12",
              tabContent: "group-data-[selected=true]:text-blue-600"
            }}
          >
            <Tab 
              key="all" 
              title={
                <div className="flex items-center gap-2">
                  <span>Todas</span>
                  <Chip size="sm" variant="flat">{counts.all}</Chip>
                </div>
              }
            />
            <Tab 
              key="pending" 
              title={
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Pendentes</span>
                  <Chip size="sm" variant="flat" color="warning">{counts.pending}</Chip>
                </div>
              }
            />
            <Tab 
              key="accepted" 
              title={
                <div className="flex items-center gap-2">
                  <PlayCircle size={16} />
                  <span>Aceitas</span>
                  <Chip size="sm" variant="flat" color="primary">{counts.accepted}</Chip>
                </div>
              }
            />
            <Tab 
              key="completed" 
              title={
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Concluídas</span>
                  <Chip size="sm" variant="flat" color="success">{counts.completed}</Chip>
                </div>
              }
            />
          </Tabs>

          {/* Campo de busca */}
          <Input
            placeholder="Buscar por cliente, descrição ou número..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            startContent={<Search size={18} className="text-gray-400" />}
            isClearable
            onClear={() => setSearchTerm("")}
            classNames={{
              base: "max-w-md",
              inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            }}
          />
        </div>

        {/* Estados de loading e erro */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Spinner size="lg" color="primary" />
            <p className="text-gray-500">Carregando solicitações...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Erro ao carregar solicitações
            </h3>
            <p className="text-gray-500 mb-4">{error?.message}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            {/* Resumo de resultados */}
            {searchTerm && (
              <p className="text-sm text-gray-500 mb-4">
                {filteredSolicitacoes.length} resultado(s) para "{searchTerm}"
              </p>
            )}
            
            {/* Lista de solicitações */}
            <SolicitacaoServicoList
              solicitacoes={filteredSolicitacoes}
              onViewDetails={setSelectedSolicitacao}
              onAceitar={handleAceitar}
              isLoading={isActing}
            />
          </>
        )}
      </div>

      {/* Modal de detalhes */}
      <SolicitacaoServicoDetailsModal
        solicitacao={selectedSolicitacao}
        isOpen={!!selectedSolicitacao}
        onClose={() => setSelectedSolicitacao(null)}
        onAceitar={handleAceitar}
        onConcluir={handleConcluir}
        onDelete={handleDelete}
        currentUserName={user?.userName}
        userRole={user?.role}
      />
    </>
  );
}
