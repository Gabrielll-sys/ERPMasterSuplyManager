"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Chip, Divider, Checkbox, CheckboxGroup, Spinner, Input, Textarea
} from "@nextui-org/react";
import { 
  Clock, User, CheckCircle, PlayCircle, Calendar, 
  Users, AlertCircle, X, Edit2, Save
} from "lucide-react";
import { 
  ISolicitacaoServico, 
  getStatusLabel, 
  getStatusColor,
  StatusSolicitacao 
} from "../interfaces/ISolicitacaoServico";
import { getAllUsers } from "../services/User.Services";
import { IUsuario } from "../interfaces/IUsuario";

interface SolicitacaoServicoDetailsModalProps {
  solicitacao: ISolicitacaoServico | null;
  isOpen: boolean;
  onClose: () => void;
  onAceitar?: (id: number) => Promise<void>;
  onConcluir?: (id: number, usuarios: string[]) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  onUpdate?: (id: number, nomeCliente: string, descricao: string) => Promise<void>;
  currentUserName?: string;
  userRole?: string;
}

/**
 * Modal com detalhes da solicitação e ações de aceite/conclusão
 */
export const SolicitacaoServicoDetailsModal = ({
  solicitacao,
  isOpen,
  onClose,
  onAceitar,
  onConcluir,
  onDelete,
  onUpdate,
  currentUserName,
  userRole
}: SolicitacaoServicoDetailsModalProps) => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState<string[]>([]);
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showConcluirForm, setShowConcluirForm] = useState(false);
  
  // Estados para edição
  const [isEditing, setIsEditing] = useState(false);
  const [editNomeCliente, setEditNomeCliente] = useState("");
  const [editDescricao, setEditDescricao] = useState("");

  // Carregar usuários quando abrir o modal para conclusão
  useEffect(() => {
    const loadUsuarios = async () => {
      if (solicitacao?.status === StatusSolicitacao.Aceita && showConcluirForm) {
        setIsLoadingUsuarios(true);
        try {
          const users = await getAllUsers();
          // Filtrar apenas usuários ativos
          setUsuarios(users.filter(u => u.isActive));
        } catch (error) {
          console.error("Erro ao carregar usuários:", error);
        } finally {
          setIsLoadingUsuarios(false);
        }
      }
    };
    loadUsuarios();
  }, [solicitacao?.status, showConcluirForm]);

  // Resetar estado ao fechar
  useEffect(() => {
    if (!isOpen) {
      setSelectedUsuarios([]);
      setShowConcluirForm(false);
      setIsEditing(false);
    } else if (solicitacao) {
      // Inicializar valores de edição
      setEditNomeCliente(solicitacao.nomeCliente || "");
      setEditDescricao(solicitacao.descricao || "");
    }
  }, [isOpen, solicitacao]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Parse dos usuários de conclusão
  const usuariosConclusao = useMemo(() => {
    if (!solicitacao?.usuariosConclusao) return [];
    try {
      return JSON.parse(solicitacao.usuariosConclusao);
    } catch {
      return [];
    }
  }, [solicitacao?.usuariosConclusao]);

  // Parse dos usuários designados (string separada por vírgula)
  const usuariosDesignados = useMemo(() => {
    if (!solicitacao?.usuariosDesignados) return [];
    return solicitacao.usuariosDesignados
      .split(",")
      .map((usuario) => usuario.trim())
      .filter(Boolean);
  }, [solicitacao?.usuariosDesignados]);

  const handleAceitar = async () => {
    if (!solicitacao || !onAceitar) return;
    setIsActionLoading(true);
    try {
      await onAceitar(solicitacao.id);
      onClose();
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConcluir = async () => {
    if (!solicitacao || !onConcluir || selectedUsuarios.length === 0) return;
    setIsActionLoading(true);
    try {
      await onConcluir(solicitacao.id, selectedUsuarios);
      onClose();
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!solicitacao || !onDelete) return;
    if (!confirm(`Tem certeza que deseja excluir a solicitação #${solicitacao.id}?`)) return;
    setIsActionLoading(true);
    try {
      await onDelete(solicitacao.id);
      onClose();
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!solicitacao || !onUpdate) return;
    if (!editNomeCliente.trim() || !editDescricao.trim()) {
      alert("Nome do cliente e descrição são obrigatórios");
      return;
    }
    setIsActionLoading(true);
    try {
      await onUpdate(solicitacao.id, editNomeCliente, editDescricao);
      setIsEditing(false);
      onClose();
    } finally {
      setIsActionLoading(false);
    }
  };

  const canEdit = userRole === "Administrador" || userRole === "Diretor" || userRole === "SuporteTecnico" || userRole === "SuporteTécnico";

  if (!solicitacao) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between w-full pr-8">
            <span>Solicitação #{solicitacao.id}</span>
            <Chip
              color={getStatusColor(solicitacao.status) as any}
              variant="flat"
              size="sm"
            >
              {getStatusLabel(solicitacao.status)}
            </Chip>
          </div>
        </ModalHeader>
        
        <ModalBody>
          {/* Informações do Cliente */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Cliente
              </label>
              {/* Modo de edição do cliente */}
              {isEditing ? (
                <Input
                  value={editNomeCliente}
                  onValueChange={setEditNomeCliente}
                  variant="bordered"
                  placeholder="Nome do cliente"
                  isRequired
                />
              ) : (
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {solicitacao.nomeCliente}
                </p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Descrição do Serviço
              </label>
              {/* Modo de edição da descrição */}
              {isEditing ? (
                <Textarea
                  value={editDescricao}
                  onValueChange={setEditDescricao}
                  variant="bordered"
                  minRows={3}
                  placeholder="Descrição do serviço"
                  isRequired
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {solicitacao.descricao}
                </p>
              )}
            </div>

            {usuariosDesignados.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Usuários Designados
                </label>
                <div className="mt-2 flex flex-wrap gap-1">
                  {usuariosDesignados.map((user: string, idx: number) => (
                    <Chip key={idx} size="sm" variant="flat" color="primary">
                      <Users size={12} className="mr-1" />
                      {user}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
            
            <Divider />
            
            {/* Timeline de status */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                Histórico
              </h4>
              
              {/* Criação */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <Clock size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Solicitação Criada</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(solicitacao.dataSolicitacao)}
                  </p>
                </div>
              </div>
              
              {/* Aceite */}
              {solicitacao.status >= StatusSolicitacao.Aceita && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                    <PlayCircle size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Aceita</p>
                    <p className="text-xs text-gray-500">
                      Por: {solicitacao.usuarioAceite} • {formatDate(solicitacao.dataAceite)}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Conclusão */}
              {solicitacao.status === StatusSolicitacao.Concluida && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Concluída</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(solicitacao.dataConclusao)}
                    </p>
                    {usuariosConclusao.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {usuariosConclusao.map((user: string, idx: number) => (
                          <Chip key={idx} size="sm" variant="flat" color="success">
                            <User size={12} className="mr-1" />
                            {user}
                          </Chip>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Formulário de Conclusão */}
            {showConcluirForm && solicitacao.status === StatusSolicitacao.Aceita && (
              <>
                <Divider />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-gray-500" />
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                      Selecione os responsáveis pela conclusão
                    </h4>
                  </div>
                  
                  {isLoadingUsuarios ? (
                    <div className="flex justify-center p-4">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    <CheckboxGroup
                      value={selectedUsuarios}
                      onValueChange={setSelectedUsuarios}
                      className="gap-2"
                    >
                      {usuarios.map((usuario) => (
                        <Checkbox 
                          key={usuario.id} 
                          value={usuario.nome || ""}
                          classNames={{
                            label: "text-sm"
                          }}
                        >
                          {usuario.nome}
                          {usuario.cargo && (
                            <span className="text-xs text-gray-400 ml-2">
                              ({usuario.cargo})
                            </span>
                          )}
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  )}
                  
                  {selectedUsuarios.length === 0 && !isLoadingUsuarios && (
                    <div className="flex items-center gap-2 text-amber-600 text-sm">
                      <AlertCircle size={16} />
                      Selecione pelo menos um usuário
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </ModalBody>
        
        <ModalFooter>
          <div className="flex w-full justify-between items-center">
            <div>
              {/* Botão de excluir (apenas Admin/Diretor) */}
              {canEdit && onDelete && (
                <Button 
                  color="danger"
                  variant="light"
                  isLoading={isActionLoading}
                  onPress={handleDelete}
                >
                  Excluir
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
            <Button variant="light" onClick={onClose}>
              Fechar
            </Button>

          {/* Ações de edição (somente perfis autorizados) */}
          {canEdit && onUpdate && (
            <>
              {!isEditing ? (
                <Button
                  variant="bordered"
                  onPress={() => setIsEditing(true)}
                  startContent={<Edit2 size={16} />}
                >
                  Editar
                </Button>
              ) : (
                <>
                  <Button
                    variant="flat"
                    onPress={() => setIsEditing(false)}
                    startContent={<X size={16} />}
                    isDisabled={isActionLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleSaveEdit}
                    isLoading={isActionLoading}
                    startContent={<Save size={16} />}
                  >
                    Salvar
                  </Button>
                </>
              )}
            </>
          )}
          
          {/* Ação: Aceitar (status = Pendente) */}
          {solicitacao.status === StatusSolicitacao.Pendente && onAceitar && (
            <Button 
              color="primary"
              isLoading={isActionLoading}
              onPress={handleAceitar}
            >
              Aceitar Solicitação
            </Button>
          )}
          
          {/* Ação: Concluir (status = Aceita) */}
          {solicitacao.status === StatusSolicitacao.Aceita && onConcluir && (
            <>
              {!showConcluirForm ? (
                <Button 
                  color="success"
                  onPress={() => setShowConcluirForm(true)}
                >
                  Concluir Serviço
                </Button>
              ) : (
                <>
                  <Button 
                    variant="flat"
                    onPress={() => setShowConcluirForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    color="success"
                    isLoading={isActionLoading}
                    isDisabled={selectedUsuarios.length === 0}
                    onPress={handleConcluir}
                  >
                    Confirmar Conclusão
                  </Button>
                </>
              )}
            </>
          )}
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SolicitacaoServicoDetailsModal;
