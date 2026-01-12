"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from 'dayjs';
import "dayjs/locale/pt-br";

// TanStack Query
import { useMutation, useQuery } from '@tanstack/react-query';

// Radix UI Components
import { 
  AlertDialog, 
  Button, 
  Text, 
  Flex, 
  Badge,
  Heading,
  Card,
  Separator
} from "@radix-ui/themes";

// Next UI Components
import { 
  Spinner,
  Skeleton
} from "@nextui-org/react";

// Icons
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  FileText,
  Loader2,
  Search,
  Filter,
  TrendingUp,
  Building2,
  User
} from 'lucide-react';

// Services & Interfaces
import { IRelatorioDiario } from '@/app/interfaces/IRelatorioDiario';
import { 
  createRelatorioDiario, 
  getAllRelatoriosDiarios 
} from "@/app/services/RelatorioDiario.Services";

// Configurar dayjs
dayjs.locale('pt-br');

// Constantes
const DIAS_SEMANA = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", 
  "Quinta-feira", "Sexta-feira", "Sábado"
];

// Variantes de animação
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Componente de Loading Skeleton
const ReportSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-white rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-start">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    ))}
  </div>
);

// Componente do Card de Relatório
const ReportCard = ({ relatorioDiario, onEdit, index }: { 
  relatorioDiario: IRelatorioDiario, 
  onEdit: (id: number) => void,
  index: number
}) => {
  const dataAbertura = dayjs(relatorioDiario.horarioAbertura);
  const diaSemana = DIAS_SEMANA[dataAbertura.day()];
  const isFinished = relatorioDiario.isFinished;
  
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.2 } 
      }}
      className="group"
    >
      <div className={`
        relative overflow-hidden rounded-2xl bg-white 
        border border-gray-100 shadow-sm
        hover:shadow-xl hover:shadow-gray-200/50
        transition-all duration-300
      `}>
        {/* Gradient Accent Top */}
        <div className={`
          h-1.5 w-full
          ${isFinished 
            ? 'bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500' 
            : 'bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500'
          }
        `} />

        {/* Card Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                ${isFinished 
                  ? 'bg-gradient-to-br from-emerald-50 to-green-100' 
                  : 'bg-gradient-to-br from-amber-50 to-orange-100'
                }
              `}>
                <FileText className={`w-6 h-6 ${isFinished ? 'text-emerald-600' : 'text-amber-600'}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Relatório
                </p>
                <h3 className="text-xl font-bold text-gray-900">
                  #{relatorioDiario.id}
                </h3>
              </div>
            </div>
            
            <Badge 
              color={isFinished ? "green" : "orange"}
              variant="soft"
              className="px-3 py-1.5 text-xs font-semibold"
            >
              <span className="flex items-center gap-1.5">
                {isFinished ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                {isFinished ? "Concluído" : "Em Análise"}
              </span>
            </Badge>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Data</p>
                <p className="text-sm font-semibold text-gray-700">
                  {dataAbertura.format("DD/MM/YY")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Dia</p>
                <p className="text-sm font-semibold text-gray-700 truncate">
                  {diaSemana.split('-')[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          {relatorioDiario.empresa && (
            <div className="flex items-center gap-2 mb-5 p-3 bg-blue-50 rounded-xl">
              <Building2 className="w-4 h-4 text-blue-500" />
              <p className="text-sm font-medium text-blue-700 truncate">
                {relatorioDiario.empresa}
              </p>
            </div>
          )}

          {/* Action Button */}
          <motion.button
            onClick={() => relatorioDiario.id && onEdit(relatorioDiario.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full py-3.5 px-4 rounded-xl font-semibold text-sm
              flex items-center justify-center gap-2
              transition-all duration-200
              ${isFinished 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25'
              }
            `}
          >
            <Eye className="w-4 h-4" />
            {isFinished ? 'Visualizar' : 'Continuar Edição'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente de Estatísticas
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  iconBg,
  delay 
}: { 
  title: string;
  value: number;
  icon: any;
  gradient: string;
  iconBg: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
      {/* Decorative circles */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
    </div>
  </motion.div>
);

export default function Reports() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Query para buscar relatórios
  const {
    data: relatoriosDiarios = [],
    refetch: refetchRds,
    isSuccess,
    isFetching,
    isLoading,
    error
  } = useQuery({
    queryKey: ['relatorios'],
    queryFn: getAllRelatoriosDiarios,
    staleTime: 8 * 60 * 60 * 1000,
    gcTime: 8 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Mutation para criar novo relatório
  const relatorioDiarioMutation = useMutation({
    mutationFn: createRelatorioDiario,
    onSuccess: (data) => {
      setIsDialogOpen(false);
      // Redireciona imediatamente para o relatório criado
      if (data?.id) {
        router.push(`/report/${data.id}`);
      }
    },
    onError: (error) => {
      console.error("Erro ao criar relatório:", error);
      setIsDialogOpen(false);
    }
  });

  const handleEditReport = (id: number) => {
    router.push(`/report/${id}`);
  };

  const handleCreateReport = () => {
    relatorioDiarioMutation.mutate();
  };

  // Filtrar relatórios
  const filteredReports = relatoriosDiarios.filter((r: IRelatorioDiario) => {
    if (!searchQuery) return true;
    return (
      r.id?.toString().includes(searchQuery) ||
      r.empresa?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Estatísticas
  const totalReports = relatoriosDiarios.length;
  const completedReports = relatoriosDiarios.filter((r: IRelatorioDiario) => r.isFinished).length;
  const pendingReports = totalReports - completedReports;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <Heading size="6" className="mb-2">Erro ao carregar</Heading>
          <Text size="3" color="gray" className="mb-6">
            Não foi possível carregar os relatórios. Verifique sua conexão.
          </Text>
          <Button onClick={() => refetchRds()} size="3" className="bg-blue-600 text-white px-8">
            Tentar novamente
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-blue-400 font-medium">Gestão de Relatórios</span>
              </motion.div>
              <Heading size="8" className="text-white mb-2">
                Relatórios Diários
              </Heading>
              <Text size="4" className="text-gray-400">
                Gerencie e acompanhe todos os seus relatórios em um só lugar
              </Text>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <AlertDialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialog.Trigger>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Novo Relatório
                  </motion.button>
                </AlertDialog.Trigger>
                
                <AlertDialog.Content className="max-w-md rounded-2xl">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <AlertDialog.Title className="text-xl font-bold">
                      Criar Novo Relatório
                    </AlertDialog.Title>
                    <AlertDialog.Description size="3" className="text-gray-500 mt-2">
                      Um novo relatório será criado com a data atual. Deseja continuar?
                    </AlertDialog.Description>
                  </div>

                  <Separator className="my-4" />

                  <Flex gap="3" justify="center">
                    <AlertDialog.Cancel>
                      <Button variant="soft" color="gray" size="3" className="px-6">
                        Cancelar
                      </Button>
                    </AlertDialog.Cancel>
                    
                    <motion.button 
                      onClick={handleCreateReport}
                      disabled={relatorioDiarioMutation.isPending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50"
                    >
                      {relatorioDiarioMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Criar Relatório
                        </>
                      )}
                    </motion.button>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-16">
          <StatCard
            title="Total de Relatórios"
            value={totalReports}
            icon={FileText}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            iconBg="bg-white/20"
            delay={0.1}
          />
          <StatCard
            title="Concluídos"
            value={completedReports}
            icon={CheckCircle2}
            gradient="bg-gradient-to-br from-emerald-500 to-green-600 text-white"
            iconBg="bg-white/20"
            delay={0.2}
          />
          <StatCard
            title="Em Análise"
            value={pendingReports}
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-amber-500 to-orange-600 text-white"
            iconBg="bg-white/20"
            delay={0.3}
          />
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nº do relatório ou empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && <ReportSkeleton />}

        {/* Lista de Relatórios */}
        <AnimatePresence mode="wait">
          {isSuccess && filteredReports.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredReports.map((relatorioDiario: IRelatorioDiario, index: number) => (
                <ReportCard
                  key={relatorioDiario.id}
                  relatorioDiario={relatorioDiario}
                  onEdit={handleEditReport}
                  index={index}
                />
              ))}
            </motion.div>
          )}

          {/* Estado vazio */}
          {isSuccess && filteredReports.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-300" />
              </div>
              <Heading size="6" className="mb-2 text-gray-900">
                {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum relatório ainda'}
              </Heading>
              <Text size="3" color="gray" className="mb-6">
                {searchQuery 
                  ? 'Tente buscar com outros termos' 
                  : 'Comece criando seu primeiro relatório diário'
                }
              </Text>
              {!searchQuery && (
                <motion.button
                  onClick={() => setIsDialogOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  Criar Primeiro Relatório
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Indicator para Refetch */}
        <AnimatePresence>
          {isFetching && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-lg border border-gray-100">
                <Spinner size="sm" />
                <Text size="2" className="font-medium">Atualizando...</Text>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}