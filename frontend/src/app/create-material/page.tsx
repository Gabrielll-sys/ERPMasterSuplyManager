
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Card, Flex, Box, Heading, Text, Separator, TextField, Button, Badge, Table, Select } from '@radix-ui/themes';
import { 
    Search, Plus, Edit3, Eye, ChevronDown, Hash, Package, Building2, MapPin, DollarSign, TrendingUp, Archive 
} from 'lucide-react';

import { IInventario } from '../interfaces/IInventario';
import { createMaterial } from "../services/Material.Services";
import { useMaterialSearch } from '../hooks/useMaterialSearch';
import type { IMaterial } from '../interfaces';


// 🎓 ANIMAÇÕES REFINADAS: Adicionamos um container para animações escalonadas.
// 🤔 PORQUÊ: O `staggerChildren` cria um efeito elegante onde os itens de uma lista ou formulário
// aparecem um após o outro, guiando o olhar do usuário de forma natural.
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05, // Um pequeno atraso entre cada item filho.
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }
};

export default function CreateMaterialPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    searchDescription, setSearchDescription, searchCode, setSearchCode,
    materials, isLoading, hasNoResults, isInitialState
  } = useMaterialSearch();

  // 🎓 ESTADO DO FORMULÁRIO EXPANDIDO: Incluindo todos os campos para uma criação detalhada.
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [formState, setFormState] = useState({
      descricao: "",
      codigoFabricante: "",
      marca: "",
      unidade: "UN",
      localizacao: "",
      precoCusto: "",
      markup: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUnitChange = (value: string) => {
    setFormState(prevState => ({ ...prevState, unidade: value }));
  };

  const createMutation = useMutation({
    mutationFn: (newMaterial: IMaterial) => createMaterial(newMaterial),
    onSuccess: () => {
      toast.success("Material criado com sucesso! 🎉");
      queryClient.invalidateQueries({ queryKey: ['materiaisSearch'] });
      // Reseta o formulário para o estado inicial.
      setFormState({ descricao: "", codigoFabricante: "", marca: "", unidade: "UN", localizacao: "", precoCusto: "", markup: "" });
      setIsFormExpanded(false);
    },
    onError: (error: Error) => toast.error(`Erro ao criar material: ${error.message}`)
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.descricao.trim() || !formState.unidade.trim()) {
      toast.error("Descrição e Unidade são obrigatórios!");
      return;
    }
    
    // 🎓 PARSE DE DADOS: Convertendo strings de preço para números antes de enviar.
    // 🤔 PORQUÊ: Inputs de formulário sempre retornam strings. É crucial validar e converter
    // para o tipo de dado correto que a API espera, evitando erros.
    const precoCustoParsed = parseFloat(formState.precoCusto.replace(',', '.'));

    const payload: IMaterial = {
        ...formState,
        descricao: formState.descricao.trim(),
        codigoFabricante: formState.codigoFabricante.trim(),
        marca: formState.marca.trim(),
        localizacao: formState.localizacao.trim(),
        precoCusto: isNaN(precoCustoParsed) ? 0 : precoCustoParsed,
        // Campos não presentes no form, com valores default
        categoria: "", corrente: "", tensao: ""
    };
    createMutation.mutate(payload);
  };
  
  const handleNavigateToUpdate = (materialId?: string | number) => {
    if (!materialId) return;
    router.push(`/update-material/${materialId}`);
  };

  const getStockBadgeColor = (stock: number): "red" | "orange" | "blue" | "green" => {
    if (stock === 0) return 'red';
    if (stock <= 5) return 'orange';
    if (stock <= 10) return 'blue';
    return 'green';
  };

  return (
    <Box className="min-h-screen bg-slate-100/50 p-4 sm:p-6 md:p-8">
      <Toaster richColors position="top-right" />
      
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="max-w-7xl mx-auto space-y-8"
      >
        <motion.header variants={fadeInUp} className="text-center">
          <Heading size="8" className="font-bold text-slate-800">
            Gerenciamento de Materiais
          </Heading>
      
        </motion.header>

        
        <motion.div variants={fadeInUp}>
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <button type="button" className="w-full text-left p-5" onClick={() => setIsFormExpanded(!isFormExpanded)} aria-expanded={isFormExpanded}>
                <Flex align="center" justify="between">
                <Flex align="center" gap="4">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-3 rounded-xl shadow-lg"><Plus size={24} /></div>
                    <div>
                    <Heading size="5" className="text-slate-800">Criar Novo Material</Heading>
                    <Text size="2" className="text-slate-500">Preencha os detalhes para adicionar um item ao inventário</Text>
                    </div>
                </Flex>
                <motion.div animate={{ rotate: isFormExpanded ? 180 : 0 }}><ChevronDown className="text-slate-500" /></motion.div>
                </Flex>
            </button>
            <AnimatePresence>
                {isFormExpanded && (
                <motion.section initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <Box className="p-5 border-t border-slate-200">
                    <motion.form variants={staggerContainer} initial="initial" animate="animate" onSubmit={handleCreateSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                        <motion.div variants={fadeInUp} className="sm:col-span-2 lg:col-span-4">
                            <label htmlFor="descricao" className="block text-sm font-medium text-slate-700 mb-1">Descrição*</label>
                            <TextField.Root><TextField.Slot><Package className="text-slate-400" /></TextField.Slot><TextField.Input size="3" id="descricao" name="descricao" value={formState.descricao} onChange={handleFormChange} placeholder="Ex: Disjuntor Monopolar 20A" required /></TextField.Root>
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <label htmlFor="codigoFabricante" className="block text-sm font-medium text-slate-700 mb-1">Código Fabricante</label>
                            <TextField.Root><TextField.Slot><Hash className="text-slate-400" /></TextField.Slot><TextField.Input size="3" id="codigoFabricante" name="codigoFabricante" value={formState.codigoFabricante} onChange={handleFormChange} placeholder="Ex: 5SL1120-7MB" /></TextField.Root>
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <label htmlFor="marca" className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
                            <TextField.Root><TextField.Slot><Building2 className="text-slate-400" /></TextField.Slot><TextField.Input size="3" id="marca" name="marca" value={formState.marca} onChange={handleFormChange} placeholder="Ex: Siemens" /></TextField.Root>
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <label htmlFor="localizacao" className="block text-sm font-medium text-slate-700 mb-1">Localização</label>
                            <TextField.Root><TextField.Slot><MapPin className="text-slate-400" /></TextField.Slot><TextField.Input size="3" id="localizacao" name="localizacao" value={formState.localizacao} onChange={handleFormChange} placeholder="Ex: A1-B2" /></TextField.Root>
                        </motion.div>
                         <motion.div variants={fadeInUp}>
                            <label htmlFor="unidade" className="block text-sm font-medium text-slate-700 mb-1">Unidade*</label>
                            <Select.Root name="unidade" value={formState.unidade} onValueChange={handleUnitChange} required>
                                <Select.Trigger id="unidade" className="w-full" placeholder='Selecione...' />
                                <Select.Content><Select.Item value="UN">UN</Select.Item><Select.Item value="RL">RL</Select.Item><Select.Item value="MT">MT</Select.Item><Select.Item value="CX">CX</Select.Item><Select.Item value="KIT">KIT</Select.Item></Select.Content>
                            </Select.Root>
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <label htmlFor="precoCusto" className="block text-sm font-medium text-slate-700 mb-1">Preço Custo (R$)</label>
                            <TextField.Root><TextField.Slot><DollarSign className="text-green-500" /></TextField.Slot><TextField.Input size="3" id="precoCusto" name="precoCusto" value={formState.precoCusto} onChange={handleFormChange} placeholder="Ex: 15,50" /></TextField.Root>
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <label htmlFor="markup" className="block text-sm font-medium text-slate-700 mb-1">Markup (%)</label>
                            <TextField.Root><TextField.Slot><TrendingUp className="text-blue-500" /></TextField.Slot><TextField.Input size="3" id="markup" name="markup" value={formState.markup} onChange={handleFormChange} placeholder="Ex: 25" /></TextField.Root>
                        </motion.div>
                        <Flex asChild justify="end" className="sm:col-span-2 lg:col-span-4 mt-4">
                            <motion.div variants={fadeInUp}>
                                <Button size="3" type="submit" disabled={createMutation.isPending}>
                                    <Plus className="mr-2" /> {createMutation.isPending ? 'Criando...' : 'Adicionar Material'}
                                </Button>
                            </motion.div>
                        </Flex>
                    </motion.form>
                    </Box>
                </motion.section>
                )}
            </AnimatePresence>
            </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
            <Card className="shadow-md">
            <Box p="5">
                <Heading size="5" className="text-slate-800 mb-4">Buscar Materiais Existentes</Heading>
                <Flex direction={{ initial: 'column', sm: 'row' }} gap="4">
                <TextField.Root><TextField.Slot><Search className="text-slate-500" /></TextField.Slot><TextField.Input size="3" value={searchDescription} onChange={(e) => setSearchDescription(e.target.value)} placeholder="Buscar por Descrição (mín. 4 caracteres)" /></TextField.Root>
                <TextField.Root><TextField.Slot><Hash className="text-slate-500" /></TextField.Slot><TextField.Input size="3" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} placeholder="Buscar por Código (mín. 4 caracteres)" /></TextField.Root>
                </Flex>
            </Box>
            <Box className="p-1 min-h-[300px] relative">
                <AnimatePresence mode="wait">
                {isLoading && <motion.div key="loading" {...fadeInUp} className="absolute inset-0 flex justify-center items-center bg-white/50 z-10"><Text>Buscando...</Text></motion.div>}
                {isInitialState && !isLoading && (
                    <motion.div key="initial" {...fadeInUp} className="text-center py-16 px-4">
                    <Eye className="w-12 h-12 mx-auto text-slate-400 mb-4" /><Heading size="4" className="text-slate-600">Comece a sua busca</Heading><Text size="2" className="text-slate-500">Digite na descrição ou código para encontrar materiais.</Text>
                    </motion.div>
                )}
                {hasNoResults && (
                    <motion.div key="no-results" {...fadeInUp} className="text-center py-16 px-4">
                    <Search className="w-12 h-12 mx-auto text-slate-400 mb-4" /><Heading size="4" className="text-slate-600">Nenhum resultado encontrado</Heading><Text size="2" className="text-slate-500">Tente um termo de busca diferente.</Text>
                    </motion.div>
                )}
                {materials.length > 0 && !isLoading && (
                    <motion.div key="results" variants={staggerContainer} initial="initial" animate="animate">
                    <Table.Root variant="surface" className="w-full">
                        <Table.Header className="bg-slate-100">
                        <Table.Row><Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell><Table.ColumnHeaderCell>Descrição</Table.ColumnHeaderCell><Table.ColumnHeaderCell className="hidden lg:table-cell">Marca</Table.ColumnHeaderCell><Table.ColumnHeaderCell>Localização</Table.ColumnHeaderCell><Table.ColumnHeaderCell>Estoque</Table.ColumnHeaderCell><Table.ColumnHeaderCell className="hidden sm:table-cell">Preço Venda</Table.ColumnHeaderCell><Table.ColumnHeaderCell>Ações</Table.ColumnHeaderCell></Table.Row>
                        </Table.Header>
                        <Table.Body>
                        {materials.map((item:IInventario) => (
                            <motion.tr variants={fadeInUp} key={item.id} className="radix-Table-Row hover:bg-blue-50/50 transition-colors duration-200">
                                <Table.Cell><Text weight="bold" className="text-slate-800">{item.material.id}</Text><Text size="1" className="block text-slate-500">{item.material.codigoFabricante || 'Sem código'}</Text></Table.Cell>
                                <Table.Cell><Text weight="bold" className="text-slate-800">{item.material.descricao}</Text><Text size="1" className="block text-slate-500">{item.material.codigoFabricante || 'Sem código'}</Text></Table.Cell>
                                <Table.Cell className="hidden lg:table-cell">{item.material.marca || 'N/A'}</Table.Cell>
                                <Table.Cell>{item.material.localizacao || 'N/A'}</Table.Cell>
                                <Table.Cell><Badge size="2" color={getStockBadgeColor(item.estoque || 0)}>{item.estoque || 0}</Badge></Table.Cell>
                                <Table.Cell className="hidden sm:table-cell">
                                    
                                    {item.material.precoVenda ? (
                                        <Text weight="bold" color="green">R$ {item.material.precoVenda?.toFixed(2).replace('.', ',')}</Text>
                                    ) : (<Text color='gray'>N/A</Text>)}
                                </Table.Cell>
                                <Table.Cell>
                                <Button size="1" variant="soft" onClick={() => handleNavigateToUpdate(item.material.id)}>
                                    <Edit3 className="w-3 h-3 md:mr-1" /><span className="hidden md:inline">Editar</span>
                                </Button>
                                </Table.Cell>
                            </motion.tr>
                        ))}
                        </Table.Body>
                    </Table.Root>
                    </motion.div>
                )}
                </AnimatePresence>
            </Box>
            </Card>
        </motion.div>
      </motion.div>
    </Box>
  );
}