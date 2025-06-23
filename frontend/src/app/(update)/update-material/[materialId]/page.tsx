// src/app/(update)/update-material/[materialId]/page.tsx

"use client";

import { useEffect, useState, useCallback, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";

import { 
  Flex, 
  Button, 
  Text, 
  Box, 
  Card, 
  Heading, 
  Separator, 
  TextField,
  Grid,
  Select // Importamos o componente Select
} from "@radix-ui/themes";
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Spinner } from "@nextui-org/react";

import { getMaterialById, updateMaterial } from "@/app/services/Material.Services";
import IMaterial from "@/app/interfaces/IMaterial";

interface MaterialFormData {
  descricao: string;
  codigoFabricante: string;
  marca: string;
  tensao: string;
  corrente: string;
  localizacao: string;
  unidade: string;
  precoCusto: string;
  precoVenda: string;
  markup: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface UpdateMaterialPageProps {
  params: { materialId: string };
}

export default function UpdateMaterialPage({ params }: UpdateMaterialPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const materialId = parseInt(params.materialId);

  const [formData, setFormData] = useState<MaterialFormData>({
    descricao: "", codigoFabricante: "", marca: "", tensao: "",
    corrente: "", localizacao: "", unidade: "", precoCusto: '',
    precoVenda: '', markup: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MaterialFormData, string>>>({});

  // 🎓 CONCEITO: Dados Estáticos para Componentes
  // Definir as opções do Select como uma constante facilita a manutenção e leitura do código.
  const unidadeOptions: SelectOption[] = [
    { value: "UN", label: "UN - Unidade" },
    { value: "RL", label: "RL - Rolo" },
    { value: "PC", label: "PC - Peça" },
    { value: "MT", label: "MT - Metro" },
    { value: "P", label: "P - Pacote" },
    { value: "CX", label: "CX - Caixa" },
    { value: "KIT", label: "KIT - Kit" }
  ];

  const { data: material, isLoading, error: queryError } = useQuery({
    queryKey: ['material', materialId],
    queryFn: () => getMaterialById(materialId),
    enabled: !!materialId,
  });

  const updateMaterialMutation = useMutation({
    mutationFn: updateMaterial,
    onSuccess: () => {
      toast.success("Material atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['material', materialId] });
      queryClient.invalidateQueries({ queryKey: ['materiais'] });
    },
    onError: (err: any) => toast.error(`Erro ao atualizar: ${err.message || 'Tente novamente.'}`),
  });

  useEffect(() => {
    if (material) {
      const formatPrice = (price: number | null | undefined) => 
        price != null ? price.toString().replace('.', ',') : '';
      
      setFormData({
        descricao: material.descricao || "",
        codigoFabricante: material.codigoFabricante || "",
        marca: material.marca || "",
        tensao: material.tensao || "",
        corrente: material.corrente || "",
        localizacao: material.localizacao || "",
        unidade: material.unidade || "",
        precoCusto: formatPrice(material.precoCusto),
        precoVenda: formatPrice(material.precoVenda),
        markup: formatPrice(material.markup),
      });
    }
  }, [material]);

  // Handler para inputs de texto (inalterado)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof MaterialFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // 🎓 MUDANÇA: Handler específico para o Select.
  // Necessário porque a API do Select (onValueChange) é diferente da API de um input (onChange).
  const handleSelectChange = (value: string, name: keyof MaterialFormData) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePriceCalculation = useCallback((source: 'venda' | 'markup') => {
    const custoStr = formData.precoCusto.replace(',', '.');
    const vendaStr = formData.precoVenda.replace(',', '.');
    const markupStr = formData.markup.replace(',', '.');
    const custo = parseFloat(custoStr);
    if (isNaN(custo) || custo <= 0) return;

    if (source === 'venda') {
      const venda = parseFloat(vendaStr);
      if (!isNaN(venda)) {
        const newMarkup = ((venda / custo) - 1) * 100;
        setFormData(prev => ({ ...prev, markup: newMarkup.toFixed(2).replace('.', ',') }));
      }
    } else if (source === 'markup') {
      const markupPercent = parseFloat(markupStr);
      if (!isNaN(markupPercent)) {
        const newPrecoVenda = custo * (1 + markupPercent / 100);
        setFormData(prev => ({ ...prev, precoVenda: newPrecoVenda.toFixed(2).replace('.', ',') }));
      }
    }
  }, [formData.precoCusto, formData.precoVenda, formData.markup]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MaterialFormData, string>> = {};
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória.';
    if (!formData.unidade.trim()) newErrors.unidade = 'Unidade é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    const parseOptionalNumber = (value?: string) => {
      if (!value || value.trim() === '') return undefined;
      const number = parseFloat(value.replace(',', '.'));
      return isNaN(number) ? undefined : number;
    };

    const payload: Partial<IMaterial> = {
      id: materialId,
      ...formData,
      precoCusto: parseOptionalNumber(formData.precoCusto),
      precoVenda: parseOptionalNumber(formData.precoVenda),
      markup: parseOptionalNumber(formData.markup),
    };

    updateMaterialMutation.mutate(payload as IMaterial);
  };

  if (isLoading) return <Flex justify="center" align="center" className="min-h-screen"><Spinner label="Carregando material..." size="lg" /></Flex>;
  if (queryError) return <Box className="p-6 text-center"><Text color="red">Erro ao carregar o material. Tente novamente.</Text></Box>;

  return (
    <Box className="container mx-auto p-4 md:p-6 max-w-4xl">
      <Toaster richColors position="top-right" />
      
      <Flex align="center" justify="between" mb="6">
        <Button variant="soft" asChild>
          <Link href="/materials">
            <ArrowLeftIcon height="16" width="16" />
            Voltar para a Lista
          </Link>
        </Button>
      </Flex>

      <Heading align="center" size="7" mb="2">Editar Material</Heading>
      <Text align="center" color="gray" size="3" mb="6">{material?.descricao} (ID: {materialId})</Text>

      <Card variant="surface" size="4">
        <form onSubmit={handleSubmit}>
          <Grid columns={{ initial: '1', sm: '2' }} gap="4">
            
            {/* Linha 1: Descrição (ocupa 2 colunas) - Estrutura Original Restaurada */}
            <Box className="sm:col-span-2">
              <Flex direction="column" gap="1">
                <Text as="label" htmlFor="descricao" weight="bold">Descrição <span className="text-red-500">*</span></Text>
                <TextField.Root size="3" color={errors.descricao ? 'red' : undefined}>
                  <TextField.Input id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Ex: Disjuntor Monopolar 20A" disabled={updateMaterialMutation.isPending} />
                </TextField.Root>
                {errors.descricao && <Text size="1" color="red">{errors.descricao}</Text>}
              </Flex>
            </Box>

            {/* Linha 2: Código do Fabricante e Marca - Estrutura Original Restaurada */}
            <Flex direction="column" gap="1">
              <Text as="label" htmlFor="codigoFabricante" weight="bold">Código do Fabricante</Text>
              <TextField.Root size="3">
                <TextField.Input id="codigoFabricante" name="codigoFabricante" value={formData.codigoFabricante} onChange={handleChange} placeholder="Ex: 5SX2120-7" disabled={updateMaterialMutation.isPending} />
              </TextField.Root>
            </Flex>
            <Flex direction="column" gap="1">
              <Text as="label" htmlFor="marca" weight="bold">Marca</Text>
              <TextField.Root size="3">
                <TextField.Input id="marca" name="marca" value={formData.marca} onChange={handleChange} placeholder="Ex: Siemens" disabled={updateMaterialMutation.isPending} />
              </TextField.Root>
            </Flex>

            {/* Linha 3: Localização e Unidade */}
            <Flex direction="column" gap="1">
              <Text as="label" htmlFor="localizacao" weight="bold">Localização</Text>
              <TextField.Root size="3">
                <TextField.Input id="localizacao" name="localizacao" value={formData.localizacao} onChange={handleChange} placeholder="Prateleira A-01" disabled={updateMaterialMutation.isPending} />
              </TextField.Root>
            </Flex>
            {/* 🎓 MUDANÇA APLICADA: Campo Unidade como Select */}
            <Flex direction="column" gap="1">
              <Text as="label" htmlFor="unidade" weight="bold">Unidade <span className="text-red-500">*</span></Text>
              <Select.Root name="unidade" value={formData.unidade} onValueChange={(value) => handleSelectChange(value, 'unidade')} size="3" disabled={updateMaterialMutation.isPending}>
                <Select.Trigger placeholder="Selecione uma unidade..." />
                <Select.Content position="popper">
                  {unidadeOptions.map(option => (
                    <Select.Item key={option.value} value={option.value}>{option.label}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              {errors.unidade && <Text size="1" color="red">{errors.unidade}</Text>}
            </Flex>

            {/* Linha 4: Tensão e Corrente - Estrutura Original Restaurada */}
            <Flex direction="column" gap="1">
              <Text as="label" htmlFor="tensao" weight="bold">Tensão</Text>
              <TextField.Root size="3">
                <TextField.Input id="tensao" name="tensao" value={formData.tensao} onChange={handleChange} placeholder="Ex: 220V" disabled={updateMaterialMutation.isPending} />
              </TextField.Root>
            </Flex>
            <Flex direction="column" gap="1">
              <Text as="label" htmlFor="corrente" weight="bold">Corrente</Text>
              <TextField.Root size="3">
                <TextField.Input id="corrente" name="corrente" value={formData.corrente} onChange={handleChange} placeholder="Ex: 20A" disabled={updateMaterialMutation.isPending} />
              </TextField.Root>
            </Flex>

            {/* Seção de Preços - Estrutura Original Restaurada */}
            <Box className="sm:col-span-2"><Separator size="4" my="3" /></Box>
            
            <Flex direction="column" gap="1">
              <Text as="label" htmlFor="precoCusto" weight="bold">Preço de Custo (R$)</Text>
              <TextField.Root size="3">
                <TextField.Input id="precoCusto" name="precoCusto" value={formData.precoCusto} onChange={handleChange} placeholder="0,00" disabled={updateMaterialMutation.isPending} />
              </TextField.Root>
            </Flex>
            <Flex direction="column" gap="1">
              <Text as="label" htmlFor="markup" weight="bold">Markup (%)</Text>
              <TextField.Root size="3">
                <TextField.Input id="markup" name="markup" value={formData.markup} onChange={handleChange} onBlur={() => handlePriceCalculation('markup')} placeholder="0,00" disabled={updateMaterialMutation.isPending} />
              </TextField.Root>
            </Flex>
            <Flex direction="column" gap="1" className="sm:col-span-2">
              <Text as="label" htmlFor="precoVenda" weight="bold">Preço de Venda (R$)</Text>
              <TextField.Root size="3">
                <TextField.Input id="precoVenda" name="precoVenda" value={formData.precoVenda} onChange={handleChange} onBlur={() => handlePriceCalculation('venda')} placeholder="0,00" disabled={updateMaterialMutation.isPending} />
              </TextField.Root>
            </Flex>

          </Grid>
          
          <Separator size="4" my="5" />
          
          <Flex justify="end" gap="3">
            <Button type="button" variant="soft" color="gray" onClick={() => router.back()} disabled={updateMaterialMutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" color="sky" disabled={updateMaterialMutation.isPending}>
              {updateMaterialMutation.isPending ? <Spinner size="sm" color="default" /> : 'Salvar Alterações'}
            </Button>
          </Flex>
        </form>
      </Card>
    </Box>
  );
}