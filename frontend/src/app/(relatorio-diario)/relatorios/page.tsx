"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from 'dayjs';
import "dayjs/locale/pt-br";

// TanStack Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Radix UI Components
import { 
  AlertDialog, 
  Button, 
  Text, 
  Flex, 
  Box, 
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
  Edit3,
  FileText,
  Loader2
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
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Componente de Loading Skeleton
const RelatorioSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
    {Array.from({ length: 8 }).map((_, index) => (
      <Card key={index} className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-8 w-1/2" />
        </div>
        <Skeleton className="h-10 w-20 ml-auto" />
      </Card>
    ))}
  </div>
);

// Componente do Card de Relatório
const ReportCard = ({ relatorioDiario, onEdit }: { 
  relatorioDiario: IRelatorioDiario, 
  onEdit: (id: number) => void 
}) => {
  const dataAbertura = dayjs(relatorioDiario.horarioAbertura);
  const diaSemana = DIAS_SEMANA[dataAbertura.day()];
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
    >
      <Card className="group overflow-hidden border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        {/* Header do Card */}
        <Box className="p-6 border-b border-gray-100">
          <Flex align="center" justify="between" mb="3">
            <Flex align="center" gap="2">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <Heading size="4" className="text-gray-900">
                  Relatório #{relatorioDiario.id}
                </Heading>
              </div>
            </Flex>
            
            <Badge 
              color={relatorioDiario.isFinished ? "green" : "orange"}
              variant="soft"
              className="flex items-center gap-1 px-2 py-1"
            >
              {relatorioDiario.isFinished ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <AlertCircle className="w-3 h-3" />
              )}
              {relatorioDiario.isFinished ? "Concluído" : "Em Análise"}
            </Badge>
          </Flex>
        </Box>

        {/* Conteúdo do Card */}
        <Box className="p-6 flex-1">
          <div className="space-y-4">
            <Flex align="center" gap="2" className="text-gray-600">
              <Calendar className="w-4 h-4" />
              <Text size="2">
                {dataAbertura.format("DD/MM/YYYY")}
              </Text>
            </Flex>
            
            <Flex align="center" gap="2" className="text-gray-600">
              <Clock className="w-4 h-4" />
              <Text size="2">{diaSemana}</Text>
            </Flex>

            {relatorioDiario.isFinished && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <Text size="2" className="text-green-700 font-medium">
                  ✓ Relatório finalizado com sucesso
                </Text>
              </motion.div>
            )}
          </div>
        </Box>

        {/* Footer do Card */}
        <Box className="p-6 pt-0">
          <Button
            onClick={() => relatorioDiario.id && onEdit(relatorioDiario.id)}
            size="3"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 group-hover:scale-105"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Editar Relatório
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

export default function Relatorios() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    staleTime: 8 * 60 * 60 * 1000, // 8 horas
    gcTime: 8 * 60 * 60 * 1000, // 8 horas (substitui cacheTime)
    refetchOnWindowFocus: false,
  });

  // Mutation para criar novo relatório
  const relatorioDiarioMutation = useMutation({
    mutationFn: createRelatorioDiario,
    onSuccess: () => {
      refetchRds();
      setIsDialogOpen(false);
      // Aqui você pode adicionar um toast de sucesso
    },
    onError: (error) => {
      console.error("Erro ao criar relatório:", error);
      // Aqui você pode adicionar um toast de erro
    }
  });

  const handleEditReport = (id: number) => {
    router.push(`/report/${id}`);
  };

  const handleCreateReport = () => {
    relatorioDiarioMutation.mutate();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <Heading size="6" mb="2">Erro ao carregar relatórios</Heading>
          <Text size="3" color="gray" mb="4">
            Não foi possível carregar os relatórios. Tente novamente.
          </Text>
          <Button onClick={() => refetchRds()} variant="outline">
            Tentar novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <Flex justify="between" align="center" className="mb-8">
            <div>
              <Heading size="8" className="text-gray-900 mb-2">
                Relatórios Diários
              </Heading>
              <Text size="4" color="gray">
                Gerencie e acompanhe seus relatórios diários
              </Text>
            </div>

            <AlertDialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialog.Trigger >
                <Button 
                  size="3"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Novo Relatório
                </Button>
              </AlertDialog.Trigger>
              
              <AlertDialog.Content className="max-w-md">
                <AlertDialog.Title className="text-xl font-semibold">
                  Criar Novo Relatório
                </AlertDialog.Title>
                
                <AlertDialog.Description size="3" className="text-gray-600 my-4">
                  Deseja criar um novo relatório diário? Esta ação irá gerar um novo relatório com a data atual.
                </AlertDialog.Description>

                <Separator className="my-4" />

                <Flex gap="3" justify="end">
                  <AlertDialog.Cancel >
                    <Button variant="soft" color="gray">
                      Cancelar
                    </Button>
                  </AlertDialog.Cancel>
                  
                  <AlertDialog.Action>
                    <button 
                      onClick={handleCreateReport}
                      disabled={relatorioDiarioMutation.isPending}
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      {relatorioDiarioMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        'Criar Relatório'
                      )}
                    </button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </Flex>
        </motion.div>

        {/* Stats Cards (opcional) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-0">
            <Flex align="center" gap="3">
              <div className="p-3 bg-blue-500 rounded-full">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text size="2" color="gray">Total de Relatórios</Text>
                <Heading size="6">{relatoriosDiarios?.length || 0}</Heading>
              </div>
            </Flex>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-0">
            <Flex align="center" gap="3">
              <div className="p-3 bg-green-500 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text size="2" color="gray">Concluídos</Text>
                <Heading size="6">
                  {relatoriosDiarios?.filter((r: IRelatorioDiario) => r.isFinished).length || 0}
                </Heading>
              </div>
            </Flex>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-0">
            <Flex align="center" gap="3">
              <div className="p-3 bg-orange-500 rounded-full">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text size="2" color="gray">Em Análise</Text>
                <Heading size="6">
                  {relatoriosDiarios?.filter((r:IRelatorioDiario) => !r.isFinished).length || 0}
                </Heading>
              </div>
            </Flex>
          </Card>
        </motion.div>

        {/* Loading State */}
        {isLoading && <RelatorioSkeleton />}

        {/* Lista de Relatórios */}
        <AnimatePresence mode="wait">
          {isSuccess && relatoriosDiarios.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {relatoriosDiarios.map((relatorioDiario: IRelatorioDiario) => (
                <ReportCard
                  key={relatorioDiario.id}
                  relatorioDiario={relatorioDiario}
                  onEdit={handleEditReport}
                />
              ))}
            </motion.div>
          )}

          {/* Estado vazio */}
          {isSuccess && relatoriosDiarios.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Card className="p-12 max-w-md mx-auto">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <Heading size="6" mb="2">Nenhum relatório encontrado</Heading>
                <Text size="3" color="gray" mb="6">
                  Comece criando seu primeiro relatório diário
                </Text>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Relatório
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Indicator para Refetch */}
        <AnimatePresence>
          {isFetching && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-4 right-4 z-50"
            >
              <Card className="p-4 shadow-lg">
                <Flex align="center" gap="2">
                  <Spinner size="sm" />
                  <Text size="2">Atualizando relatórios...</Text>
                </Flex>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}