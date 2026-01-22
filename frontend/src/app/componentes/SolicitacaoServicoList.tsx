"use client";

import { Card, CardBody, Chip, Button, Tooltip, Skeleton } from "@nextui-org/react";
import { Eye, Clock, User, CheckCircle, PlayCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ISolicitacaoServico, 
  getStatusLabel, 
  getStatusColor,
  StatusSolicitacao 
} from "../interfaces/ISolicitacaoServico";

interface SolicitacaoServicoListProps {
  solicitacoes: ISolicitacaoServico[];
  onViewDetails: (solicitacao: ISolicitacaoServico) => void;
  onAceitar?: (id: number) => void;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

/**
 * Lista de solicitações de serviço com indicadores de status e animações
 */
export const SolicitacaoServicoList = ({ 
  solicitacoes, 
  onViewDetails,
  onAceitar,
  onDelete,
  isLoading = false
}: SolicitacaoServicoListProps) => {
  
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

  const getStatusIcon = (status: number) => {
    switch (status) {
      case StatusSolicitacao.Pendente:
        return <Clock size={16} />;
      case StatusSolicitacao.Aceita:
        return <PlayCircle size={16} />;
      case StatusSolicitacao.Concluida:
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  // Estado vazio
  if (solicitacoes.length === 0) {
    return (
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardBody className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Clock className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Nenhuma solicitação encontrada
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Crie uma nova solicitação usando o formulário acima
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 w-full">
      <AnimatePresence mode="popLayout">
        {solicitacoes.map((solicitacao, index) => (
          <motion.div
            key={solicitacao.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.2,
              delay: index * 0.05 // Stagger animation
            }}
            layout
            className="w-full"
          >
            <Card 
              className={`
                shadow-sm hover:shadow-md transition-all duration-200 
                border border-gray-200 dark:border-gray-700
                hover:border-blue-300 dark:hover:border-blue-700
                cursor-pointer group
                w-full
              `}
              isPressable
              onPress={() => onViewDetails(solicitacao)}
            >
              <CardBody className="p-4">
                <div className="flex flex-col gap-4">
                  {/* Informações principais */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Chip
                        color={getStatusColor(solicitacao.status) as any}
                        variant="flat"
                        size="sm"
                        startContent={getStatusIcon(solicitacao.status)}
                        classNames={{
                          base: "transition-transform group-hover:scale-105"
                        }}
                      >
                        {getStatusLabel(solicitacao.status)}
                      </Chip>
                      <span className="text-sm font-mono text-gray-400 dark:text-gray-500">
                        #{solicitacao.id.toString().padStart(4, '0')}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {solicitacao.nomeCliente}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {solicitacao.descricao}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(solicitacao.dataSolicitacao)}
                      </span>
                      {solicitacao.usuarioAceite && (
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <User size={12} />
                          {solicitacao.usuarioAceite}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Ações - Full width no mobile */}
                  <div className="flex gap-2 w-full md:w-auto" onClick={(e) => e.stopPropagation()}>
                    {solicitacao.status === StatusSolicitacao.Pendente && onAceitar && (
                      <Tooltip content="Aceitar esta solicitação">
                        <Button
                          color="primary"
                          variant="flat"
                          size="sm"
                          isLoading={isLoading}
                          onPress={() => onAceitar(solicitacao.id)}
                          className="font-medium flex-1 md:flex-initial"
                        >
                          Aceitar
                        </Button>
                      </Tooltip>
                    )}
                    
                    <Tooltip content="Ver detalhes">
                      <Button
                        color="default"
                        variant="bordered"
                        size="sm"
                        isIconOnly
                        onPress={() => onViewDetails(solicitacao)}
                        className="group-hover:border-blue-400"
                      >
                        <Eye size={18} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Skeleton de loading
export const SolicitacaoServicoListSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="shadow-sm border border-gray-200 dark:border-gray-700">
        <CardBody className="p-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="w-20 h-6 rounded-full" />
              <Skeleton className="w-16 h-6 rounded" />
            </div>
            <Skeleton className="w-48 h-6 rounded" />
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-32 h-4 rounded" />
          </div>
        </CardBody>
      </Card>
    ))}
  </div>
);

export default SolicitacaoServicoList;
