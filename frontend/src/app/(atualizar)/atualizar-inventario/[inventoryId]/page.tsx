"use client"

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Button, 
  Input, 
  Card, 
  CardBody, 
  CardHeader,
  Textarea,
  Divider,
  Chip,
  Skeleton
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Toaster, toast } from 'sonner';
import { 
  ArrowLeft, 
  Package, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  Calendar,
  Hash,
  FileText,
  TrendingUp
} from "lucide-react";
import axios from "axios";
import dayjs from "dayjs";
import { url } from '@/app/api/webApiUrl';

// Schema de validação com Zod
const inventorySchema = z.object({
  razao: z.string()
    .min(3, "Razão deve ter pelo menos 3 caracteres")
    .max(200, "Razão deve ter no máximo 200 caracteres")
    .transform(str => str.trim().replace(/\s\s+/g, ' ')),
  movimento: z.coerce.number().min(0, "Estoque não pode ser negativo"),
  estoque: z.number().min(0, "Estoque não pode ser negativo").optional()
});

type InventoryFormData = z.infer<typeof inventorySchema>;

// Types
interface Material {
  id: number;
  descricao: string;
  categoria: string;
  codigoFabricante?: number;
  unidade?: string;
}

interface InventoryItem {
  id: number;
  saldoFinal: number | null;
  estoque: number;
  razao: string;
  dataAlteracao: string;
  material: Material;
}

// API Functions
const fetchInventoryItem = async (id: string): Promise<InventoryItem[]> => {
  const response = await axios.get(`${url}/Inventarios/buscaCodigoInventario/${id}`);
  return response.data;
};

const updateInventory = async (data: { 
  razao: string; 
  saldoFinal: number; 
  estoque: number; 
  materialId: string 
}) => {
  const response = await axios.post(`${url}/Inventarios`, {
    ...data,
    material: {}
  });
  return response.data;
};

interface UpdateInventoryProps {
  params: {
    inventoryId: string;
  };
}

export default function UpdateInventory({ params }: UpdateInventoryProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
    watch
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      razao: "Levantamento de Estoque",
      movimento: 0,
      estoque: 0
    },
    mode: "onChange"
  });

  // TanStack Query - Fetch inventory data
  const { 
    data: inventoryData, 
    isLoading, 
    error,
    isSuccess 
  } = useQuery({
    queryKey: ['inventory', params.inventoryId],
    queryFn: () => fetchInventoryItem(params.inventoryId),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // TanStack Query - Update mutation
  const updateMutation = useMutation({
    mutationFn: updateInventory,
    onSuccess: () => {
      toast.success("Inventário atualizado com sucesso!", {
        icon: "✅",
        duration: 4000,
      });
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['inventory', params.inventoryId] });
      queryClient.invalidateQueries({ queryKey: ['materiaisSearch'] });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.back();
      }, 2000);
    },
    onError: (error) => {
      console.error('Erro ao atualizar:', error);
      toast.error("Erro ao atualizar inventário. Tente novamente.", {
        icon: "❌",
        duration: 4000,
      });
    },
  });

  // Get latest inventory item
  const latestItem = inventoryData?.[inventoryData.length - 1];

  // Reset form when data is loaded
  useEffect(() => {
    if (latestItem) {
      reset({
        razao: "Levantamento de Estoque",
        movimento: latestItem.saldoFinal ?? 0,
        estoque: latestItem.saldoFinal ?? 0
      });
    }
  }, [latestItem, reset]);

  // Form submission
  const onSubmit = (data: InventoryFormData) => {
    if (!latestItem) return;

    updateMutation.mutate({
      razao: data.razao,
      saldoFinal: data.movimento,
      estoque: data.estoque || data.movimento,
      materialId: String(latestItem.material.id)
    });
  };

  // Watch form values for real-time feedback
  const watchedValues = watch();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4 flex items-center justify-center">
        <Card className="max-w-md border-l-4 border-l-red-500">
          <CardBody className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Erro ao Carregar</h2>
            <p className="text-red-600 mb-4">Não foi possível carregar os dados do inventário.</p>
            <Button 
              color="danger" 
              variant="flat" 
              onClick={() => router.back()}
              startContent={<ArrowLeft className="w-4 h-4" />}
            >
              Voltar
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Toaster 
        position="top-center"
        toastOptions={{
          className: "font-medium",
          style: {
            background: "#fff",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
          }
        }}
      />
      
      <div className="max-w-4xl mx-auto">
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="light"
            startContent={<ArrowLeft className="w-4 h-4" />}
            onClick={() => router.back()}
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Retornar
          </Button>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              className="flex items-center justify-center gap-3 mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-3 bg-blue-500 rounded-full">
                <Package className="w-8 h-8 text-white" />
              </div>
              {isLoading ? (
                <Skeleton className="h-12 w-80 rounded-lg" />
              ) : (
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Editando Inventário
                </h1>
              )}
            </motion.div>
            
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-96 mx-auto rounded" />
                <Skeleton className="h-4 w-48 mx-auto rounded" />
              </div>
            ) : latestItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {latestItem.material.descricao}
                </h2>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Hash className="w-4 h-4" />
                    <span>Código: {latestItem.material.id}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Última atualização: {dayjs(latestItem.dataAlteracao).format("DD/MM/YYYY")}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Material Information Card */}
          {latestItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Informações do Material</h3>
                </CardHeader>
                <CardBody className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Descrição</p>
                      <p className="font-semibold text-gray-900">{latestItem.material.descricao}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Categoria</p>
                      <Chip color="primary" variant="flat" size="sm">
                        {latestItem.material.categoria}
                      </Chip>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Estoque Atual</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-green-600">
                          {latestItem.saldoFinal ?? 0} {latestItem.material.unidade || 'un'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-md">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-800">Atualizar Inventário</h3>
              </CardHeader>
              <Divider />
              <CardBody className="p-6">
                {isLoading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Skeleton className="h-14 w-full rounded-lg" />
                      <Skeleton className="h-14 w-full rounded-lg" />
                    </div>
                    <Skeleton className="h-12 w-48 mx-auto rounded-lg" />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Razão */}
                    <div>
                      <Controller
                        name="razao"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            label="Razão da Movimentação"
                            placeholder="Ex: Levantamento de Estoque, Ajuste de Inventário..."
                            startContent={<FileText className="w-4 h-4 text-gray-400" />}
                            variant="bordered"
                            classNames={{
                              inputWrapper: "border-2 border-gray-200 hover:border-blue-400 focus-within:!border-blue-500"
                            }}
                            isInvalid={!!errors.razao}
                            errorMessage={errors.razao?.message}
                            minRows={2}
                            maxRows={4}
                          />
                        )}
                      />
                    </div>

                    {/* Movimento e Estoque */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Controller
                        name="movimento"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            value={String(field.value || '')}
                            label="Novo Estoque"
                            placeholder="0"
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <TrendingUp className="w-4 h-4 text-gray-400" />
                              </div>
                            }
                            endContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-gray-400 text-sm">
                                  {latestItem?.material.unidade || 'un'}
                                </span>
                              </div>
                            }
                            variant="bordered"
                            classNames={{
                              inputWrapper: "border-2 border-gray-200 hover:border-blue-400 focus-within:!border-blue-500"
                            }}
                            isInvalid={!!errors.movimento}
                            errorMessage={errors.movimento?.message}
                          />
                        )}
                      />

                      {/* Preview do novo valor */}
                      <div className="flex items-center justify-center">
                        <Card className="border border-dashed border-gray-300 bg-gray-50">
                          <CardBody className="p-4 text-center">
                            <p className="text-sm text-gray-500 mb-1">Novo Saldo</p>
                            <p className="text-2xl font-bold text-green-600">
                              {watchedValues.movimento || '0'} {latestItem?.material.unidade || 'un'}
                            </p>
                          </CardBody>
                        </Card>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                      <Button
                        type="button"
                        variant="flat"
                        onClick={() => router.back()}
                        className="min-w-32"
                        startContent={<ArrowLeft className="w-4 h-4" />}
                      >
                        Cancelar
                      </Button>
                      
                      <Button
                        type="submit"
                        color="primary"
                        size="lg"
                        className="min-w-48 font-semibold"
                        isLoading={updateMutation.isPending}
                        isDisabled={!isValid || !isDirty}
                        startContent={
                          updateMutation.isPending ? null : 
                          updateMutation.isSuccess ? <CheckCircle2 className="w-5 h-5" /> : 
                          <Save className="w-5 h-5" />
                        }
                      >
                        {updateMutation.isPending 
                          ? "Atualizando..." 
                          : updateMutation.isSuccess 
                          ? "Atualizado!" 
                          : "Atualizar Inventário"
                        }
                      </Button>
                    </div>

                    {/* Form Status */}
                    {!isValid && isDirty && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <div className="flex items-center justify-center gap-2 text-amber-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Corrija os erros acima para continuar</span>
                        </div>
                      </motion.div>
                    )}
                  </form>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}