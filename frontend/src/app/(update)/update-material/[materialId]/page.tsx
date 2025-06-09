"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form"; // Controller não é estritamente necessário com a abordagem atual, mas é bom ter
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Componentes UI
import { 
  Flex, 
  Button, 
  Text, 
  Box, 
  Card, 
  Heading, 
  Separator 
} from "@radix-ui/themes";
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Spinner } from "@nextui-org/react";

// Componentes customizados
import MaterialFormFields from "@/app/componentes/UpdateMaterialComponentes/MaterialFormFields";
// Removi a seção de imagem por enquanto para focar no formulário

// Serviços e Interfaces
import { getMaterialById, updateMaterial } from "@/app/services/Material.Services";
import IMaterial from "@/app/interfaces/IMaterial";

// --- CORREÇÃO: Schema de validação deve aceitar string para campos numéricos ---
const materialSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória').max(200, 'Máximo 200 caracteres'),
  codigoFabricante: z.string().max(50, 'Máximo 50 caracteres').optional(),
  marca: z.string().max(50, 'Máximo 50 caracteres').optional(),
  tensao: z.string().optional(),
  corrente: z.string().max(20, 'Máximo 20 caracteres').optional(),
  localizacao: z.string().max(100, 'Máximo 100 caracteres').optional(),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
  // Os campos de preço são strings no formulário, a conversão ocorre no submit
  precoCusto: z.string().optional(),
  precoVenda: z.string().optional(),
  markup: z.string().optional(),
});

type MaterialFormData = z.infer<typeof materialSchema>;

interface UpdateMaterialPageProps {
  params: { materialId: string };
}

export default function UpdateMaterialPage({ params }: UpdateMaterialPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const materialId = parseInt(params.materialId);

  // React Hook Form
  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      descricao: "",
      codigoFabricante: "",
      marca: "",
      tensao: "",
      corrente: "",
      localizacao: "",
      unidade: "",
      precoCusto: '',
      precoVenda: '',
      markup: '',
    },
  });

  const { reset, watch, setValue, getValues } = form;

  // Query para buscar dados
  const { data: material, isLoading, error } = useQuery({
    queryKey: ['material', materialId],
    queryFn: () => getMaterialById(materialId),
    enabled: !!materialId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutação para atualizar
  const updateMaterialMutation = useMutation({
    mutationFn: updateMaterial,
    onSuccess: () => {
      toast.success("Material atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['material', materialId] });
    },
    onError: (err: any) => {
      toast.error(`Erro ao atualizar: ${err.message || 'Tente novamente.'}`);
    },
  });

  // Popula o formulário quando os dados chegam
  useEffect(() => {
    if (material) {
      const formData = {
        descricao: material.descricao || "",
        codigoFabricante: material.codigoFabricante || "",
        marca: material.marca || "",
        tensao: material.tensao || "",
        corrente: material.corrente || "",
        localizacao: material.localizacao || "",
        unidade: material.unidade || "",
        precoCusto: material.precoCusto?.toString().replace('.', ',') || '',
        precoVenda: material.precoVenda?.toString().replace('.', ',') || '',
        markup: material.markup?.toString().replace('.', ',') || '',
      };
      reset(formData);
    }
  }, [material, reset]);
  
  // --- LÓGICA DE CÁLCULO DE PREÇO ---
  const handleCalculateMarkup = useCallback(() => {
    const { precoCusto, precoVenda } = getValues();
    const custo = parseFloat(String(precoCusto).replace(',', '.'));
    const venda = parseFloat(String(precoVenda).replace(',', '.'));

    if (!isNaN(custo) && !isNaN(venda) && custo > 0) {
      const newMarkup = ((venda / custo) - 1) * 100;
      setValue('markup', newMarkup.toFixed(2).replace('.', ','));
    }
  }, [getValues, setValue]);

  const handleCalculatePrecoVenda = useCallback(() => {
    const { precoCusto, markup } = getValues();
    const custo = parseFloat(String(precoCusto).replace(',', '.'));
    const markupPercent = parseFloat(String(markup).replace(',', '.'));

    if (!isNaN(custo) && !isNaN(markupPercent)) {
      const newPrecoVenda = custo * (1 + markupPercent / 100);
      setValue('precoVenda', newPrecoVenda.toFixed(2).replace('.', ','));
    }
  }, [getValues, setValue]);


  // Handler para o submit
  const onSubmit = (data: MaterialFormData) => {
    const parseOptionalNumber = (value?: string) => {
        if (value === undefined || value.trim() === '') return null;
        const number = parseFloat(value.replace(',', '.'));
        return isNaN(number) ? null : number;
    };

    const payload: Partial<IMaterial> = {
      id: materialId,
      ...data,
      precoCusto: parseOptionalNumber(data.precoCusto),
      precoVenda: parseOptionalNumber(data.precoVenda),
      markup: parseOptionalNumber(data.markup),
    };

    updateMaterialMutation.mutate(payload as IMaterial);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" className="min-h-screen">
        <Spinner size="lg" label="Carregando dados do material..." />
      </Flex>
    );
  }

  if (error) {
    return <Box className="p-6 text-center"><Text color="red">Erro ao carregar o material.</Text></Box>;
  }

  return (
    <Box className="container mx-auto p-4 md:p-6 max-w-4xl">
      <Flex align="center" justify="between" mb="6">
        <Button variant="soft" asChild>
          <Link href="/create-material">
            <ArrowLeftIcon height="16" width="16" />
            Voltar
          </Link>
        </Button>
      </Flex>

      <Heading align="center" size="7" mb="2">Editar Material</Heading>
      <Text align="center" color="gray" size="3" mb="6">{material?.descricao} (ID: {materialId})</Text>

      <Card variant="surface" size="4" className="mb-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Flex direction="column" gap="6">
            
     
            <MaterialFormFields
              formData={watch()}
              onFormDataChange={(field:any, value:any) => setValue(field, value, { shouldValidate: true, shouldDirty: true })}
              disabled={updateMaterialMutation.isPending}
              onPriceCalculation={{
                onCalculateMarkup: handleCalculateMarkup,
                onCalculatePrecoVenda: handleCalculatePrecoVenda
              }}
            />
            
            <Separator size="4" />
            
            <Flex justify="end" gap="3">
              <Button type="button" variant="soft" color="gray" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMaterialMutation.isPending || !form.formState.isDirty}>
                {updateMaterialMutation.isPending ? <Spinner size="sm" color="default" /> : 'Salvar Alterações'}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Card>
    </Box>
  );
}