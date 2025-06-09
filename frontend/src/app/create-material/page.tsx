"use client"
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Autocomplete, AutocompleteItem, Spinner } from "@nextui-org/react";
import { 
    Card, 
    Flex, 
    Box, 
    Heading, 
    Text, 
    Separator, 
    TextField, 
    Button, 
    Badge, 
    Callout, 
    Table 
} from '@radix-ui/themes';

import { IInventario } from "../interfaces/IInventarios";
import IMaterial from "../interfaces/IMaterial";
import { createMaterial, searchByDescription, searchByFabricanteCode } from "../services/Material.Services";

// Ícones modernos com Lucide React
import {
    Search,
    Plus,
    Edit3,
    AlertTriangle,
    Package,
    Sparkles,
    TrendingUp,
    Eye,
    Filter,
    RefreshCw,
    DollarSign,
    MapPin,
    Zap,
    Building2,
    Hash,
    Archive,
    Activity,
    ChevronDown,
    Award
} from 'lucide-react';

// Hook customizado para Debounce
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Interface para o usuário
interface IUser {
    role: "Administrador" | "Diretor" | "SuporteTecnico" | string;
}


// Configurações de animação
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const tableRowVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

// Componente de linha de tabela com animação robusta
const MotionTableRow = motion(Table.Row);

function CreateMaterialPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Estados do Formulário
    const [formDescricao, setFormDescricao] = useState<string>("");
    const [formCodigoFabricante, setFormCodigoFabricante] = useState<string>("");
    const [formMarca, setFormMarca] = useState<string>("");
    const [formTensao, setFormTensao] = useState<string>("");
    const [formLocalizacao, setFormLocalizacao] = useState<string>("");
    const [formCorrente, setFormCorrente] = useState<string>("");
    const [formUnidade, setFormUnidade] = useState<string>("UN");
    const [formPrecoCusto, setFormPrecoCusto] = useState<string>("");
    const [formMarkup, setFormMarkup] = useState<string>("");

    // Estados para busca e UI
    const [inputDescricao, setInputDescricao] = useState<string>("");
    const [inputCodigoFabricante, setInputCodigoFabricante] = useState<string>("");
    const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    // Estados Debounced
    const debouncedSearchTermDescricao = useDebounce(inputDescricao, 500);
    const debouncedSearchTermCodigo = useDebounce(inputCodigoFabricante, 500);

    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const conditionsRoles = currentUser?.role === "Administrador" || currentUser?.role === "Diretor" || currentUser?.role === "SuporteTecnico";

    useEffect(() => {
        const userString = localStorage.getItem("currentUser");
        if (userString) {
            try {
                const user = JSON.parse(userString);
                setCurrentUser(user);
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                setCurrentUser(null);
            }
        }

        const persistedSearchTerm = sessionStorage.getItem("materialSearchDescription");
        if (persistedSearchTerm) {
            setInputDescricao(persistedSearchTerm);
        }
    }, []);

    useEffect(() => {
        if (debouncedSearchTermDescricao && debouncedSearchTermDescricao.length <= 3) {
            sessionStorage.removeItem("materialSearchDescription");
            sessionStorage.removeItem("lastSearchedMateriais");
            queryClient.setQueryData(['materiaisByTerm', debouncedSearchTermDescricao], []);
        } else if (debouncedSearchTermDescricao && debouncedSearchTermDescricao.length > 3) {
            sessionStorage.setItem("materialSearchDescription", debouncedSearchTermDescricao);
        }
    }, [debouncedSearchTermDescricao, queryClient]);

    // Lógica de Query para busca
    const searchTerm = debouncedSearchTermDescricao.length > 3 ? debouncedSearchTermDescricao : (debouncedSearchTermCodigo.length > 3 ? debouncedSearchTermCodigo : "");
    const searchType = debouncedSearchTermDescricao.length > 3 ? 'descricao' : (debouncedSearchTermCodigo.length > 3 ? 'codigo' : 'none');

    const { data: materiais = [], isLoading: isLoadingMateriais, isFetching: isFetchingMateriais, isPreviousData } = useQuery<IInventario[], Error, IInventario[]>({
        queryKey: ['materiaisSearch', searchTerm, searchType],
        queryFn: async () => {
            if (searchType === 'none') return [] as IInventario[];
            if (searchType === 'descricao') {
                const result = await searchByDescription(searchTerm);
                return result as IInventario[];
            }
            const result = await searchByFabricanteCode(searchTerm);
            return result as IInventario[];
        },
        enabled: searchType !== 'none',
        staleTime: 1000 * 60 * 2,
        keepPreviousData: true,
    });
    
    // --- CORREÇÃO: Sintaxe do useMutation ajustada para TanStack Query v5 ---
    const mutationCreateMaterial = useMutation({
        mutationFn: createMaterial,
        onSuccess: (newMaterial: IInventario) => {
            // --- CORREÇÃO: Chamada de toast ajustada para a API do 'sonner' ---
            toast.success("Material criado com sucesso! 🎉");

            // Reset form
            setFormDescricao(""); setFormCodigoFabricante(""); setFormMarca("");
            setFormTensao(""); setFormLocalizacao(""); setFormCorrente("");
            setFormUnidade("UN"); setFormPrecoCusto(""); setFormMarkup("");
            setIsFormExpanded(false);
            
            queryClient.invalidateQueries({ queryKey: ['materiaisSearch'] });
            queryClient.invalidateQueries({ queryKey: ['allInventario'] });
        },
        onError: (error: Error) => {
            // --- CORREÇÃO: Chamada de toast ajustada para a API do 'sonner' ---
            toast.error(`Erro ao criar material: ${error.message}`);
        }
    });

    const handleCreateMaterialSubmit = () => {
        if (!formDescricao.trim() || !formUnidade.trim()) {
            toast.error("Descrição e Unidade são obrigatórios!");
            return;
        }

        const precoCustoParsed = parseFloat(formPrecoCusto.replace(',', '.'));

        const materialPayload: IMaterial = {
            codigoFabricante: formCodigoFabricante.trim().replace(/\s\s+/g, " "),
            descricao: formDescricao.trim().replace(/\s\s+/g, " "),
            categoria: "",
            marca: formMarca.trim().replace(/\s\s+/g, " "),
            corrente: formCorrente.trim().replace(/\s\s+/g, " "),
            unidade: formUnidade.trim().replace(/\s\s+/g, " "),
            tensao: formTensao.trim().replace(/\s\s+/g, " "),
            localizacao: formLocalizacao.trim().replace(/\s\s+/g, " "),
            precoCusto: isNaN(precoCustoParsed) ? 0 : precoCustoParsed,
            markup: formMarkup,
        };

        mutationCreateMaterial.mutate(materialPayload);
    };

    const handleNavigateToUpdate = (materialId: string | number | undefined) => {
        if (materialId === undefined || materialId === null) {
            toast.error("ID do material inválido.");
            return;
        }
        if (searchType === 'descricao' && debouncedSearchTermDescricao) {
            sessionStorage.setItem("materialSearchDescription", debouncedSearchTermDescricao);
        }
        router.push(`update-material/${materialId}`);
    };

    const getStockBadgeColor = (stock: number): "red" | "amber" | "blue" | "green" => {
        if (stock === 0) return 'red';
        if (stock <= 5) return 'amber';
        if (stock <= 10) return 'blue';
        return 'green';
    };
    
    const unidadeMaterial = useMemo(() => ["UN", "RL", "MT", "P", "CX", "KIT"], []);
    const tensoes = useMemo(() => ["", "12V", "24V", "110V", "127V", "220V", "380V", "440V", "660V"], []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* --- CORREÇÃO: Toaster ajustado para 'sonner' com 'richColors' --- */}
            <Toaster richColors position="top-right" />

            {/* Elementos decorativos de fundo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="container mx-auto px-4 md:px-6 py-8 relative z-10"
            >
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    className="text-center mb-8"
                >
                    <div className="relative inline-block">
                        <motion.div
                            className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-30"
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                            <Heading
                                size="8"
                                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-bold"
                            >
                                Gerenciamento de Materiais
                            </Heading>
                            <motion.div
                                className="absolute -top-2 -right-2 text-yellow-400"
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 3
                                }}
                            >
                                <Sparkles className="w-6 h-6" />
                            </motion.div>
                        </div>
                    </div>
                    <Text className="text-slate-600 mt-4 text-lg">
                        Crie, busque e gerencie materiais de forma inteligente
                    </Text>
                </motion.div>

                {/* Seção de Criação */}
                {conditionsRoles && (
                    <motion.div variants={fadeInUp}>
                        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                            <motion.div
                                className="cursor-pointer"
                                onClick={() => setIsFormExpanded(!isFormExpanded)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
                                    <Flex align="center" justify="between">
                                        <Flex align="center" gap="4">
                                            <motion.div
                                                className="p-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl text-white shadow-lg"
                                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Plus className="w-7 h-7" />
                                            </motion.div>
                                            <div>
                                                <Heading size="6" className="text-slate-800 mb-1">
                                                    Criar Novo Material
                                                </Heading>
                                                <Text className="text-slate-600 text-sm flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4" />
                                                    Clique para {isFormExpanded ? 'recolher' : 'expandir'} o formulário
                                                </Text>
                                            </div>
                                        </Flex>
                                        <motion.div
                                            animate={{ rotate: isFormExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-2 rounded-full bg-white/50"
                                        >
                                            <ChevronDown className="w-5 h-5 text-slate-600" />
                                        </motion.div>
                                    </Flex>
                                </Box>
                            </motion.div>

                            <AnimatePresence>
                                {isFormExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <Box className="px-6 pb-6">
                                            <Separator className="my-6" />
                                            
                                            <motion.div
                                                variants={staggerContainer}
                                                initial="initial"
                                                animate="animate"
                                                className="space-y-6"
                                            >
                                                {/* Linha 1 */}
                                                <motion.div variants={fadeInUp}>
                                                    <Text className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                                                        <Hash className="w-4 h-4" />
                                                        Informações Básicas
                                                    </Text>
                                                    <Flex direction={{ initial: 'column', sm: 'row' }} gap="4">
                                                        <div className="flex-1">
                                                            <TextField.Root>
                                                                <TextField.Slot>
                                                                    <Search className="w-4 h-4 text-slate-400" />
                                                                </TextField.Slot>
                                                                <TextField.Input
                                                                    value={formCodigoFabricante}
                                                                    variant='surface'
                                                                    onChange={(e) => setFormCodigoFabricante(e.target.value)}
                                                                    placeholder='Código Fabricante'
                                                                    size="3"
                                                                    className="focus:ring-2 focus:ring-emerald-500 transition-all border-slate-200"
                                                                />
                                                            </TextField.Root>
                                                        </div>
                                                        <div className="flex-1 sm:flex-[2]">
                                                            <TextField.Root>
                                                                <TextField.Input
                                                                    value={formDescricao}
                                                                    variant='surface'
                                                                    onChange={(e) => setFormDescricao(e.target.value)}
                                                                    placeholder='Descrição do Material*'
                                                                    size="3"
                                                                    required
                                                                    className="focus:ring-2 focus:ring-emerald-500 transition-all border-slate-200"
                                                                />
                                                            </TextField.Root>
                                                        </div>
                                                    </Flex>
                                                </motion.div>

                                                {/* Linha 2 */}
                                                <motion.div variants={fadeInUp}>
                                                    <Text className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                                                        <Building2 className="w-4 h-4" />
                                                        Marca e Localização
                                                    </Text>
                                                    <Flex direction={{ initial: 'column', sm: 'row' }} gap="4">
                                                        <div className="flex-1">
                                                            <TextField.Root>
                                                                <TextField.Slot>
                                                                    <Award className="w-4 h-4 text-slate-400" />
                                                                </TextField.Slot>
                                                                <TextField.Input
                                                                    value={formMarca}
                                                                    variant='surface'
                                                                    onChange={(e) => setFormMarca(e.target.value)}
                                                                    placeholder='Marca'
                                                                    size="3"
                                                                    className="focus:ring-2 focus:ring-emerald-500 transition-all border-slate-200"
                                                                />
                                                            </TextField.Root>
                                                        </div>
                                                        <div className="flex-1">
                                                            <TextField.Root>
                                                                <TextField.Slot>
                                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                                </TextField.Slot>
                                                                <TextField.Input
                                                                    value={formLocalizacao}
                                                                    variant='surface'
                                                                    onChange={(e) => setFormLocalizacao(e.target.value)}
                                                                    placeholder='Localização (Ex: A1-B2)'
                                                                    size="3"
                                                                    className="focus:ring-2 focus:ring-emerald-500 transition-all border-slate-200"
                                                                />
                                                            </TextField.Root>
                                                        </div>
                                                    </Flex>
                                                </motion.div>
                                                
                                                {/* Linha 3 */}
                                                <motion.div variants={fadeInUp}>
                                                    <Text className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4" />
                                                        Preços e Especificações
                                                    </Text>
                                                    <Flex direction={{ initial: 'column', lg: 'row' }} gap="4" align="end">
                                                        <div className="flex-1">
                                                            <TextField.Root>
                                                                <TextField.Slot>
                                                                    <DollarSign className="w-4 h-4 text-green-500" />
                                                                </TextField.Slot>
                                                                <TextField.Input
                                                                    value={formPrecoCusto}
                                                                    variant='surface'
                                                                    onChange={(e) => setFormPrecoCusto(e.target.value)}
                                                                    placeholder='Preço Custo (Ex: 10,50)'
                                                                    type="text"
                                                                    inputMode="decimal"
                                                                    size="3"
                                                                    className="focus:ring-2 focus:ring-emerald-500 transition-all border-slate-200"
                                                                />
                                                            </TextField.Root>
                                                        </div>
                                                        <div className="flex-1">
                                                            <TextField.Root>
                                                                <TextField.Slot>
                                                                    <TrendingUp className="w-4 h-4 text-blue-500" />
                                                                </TextField.Slot>
                                                                <TextField.Input
                                                                    value={formMarkup}
                                                                    variant='surface'
                                                                    onChange={(e) => setFormMarkup(e.target.value)}
                                                                    placeholder='Markup % (Ex: 25)'
                                                                    type="text"
                                                                    inputMode="decimal"
                                                                    size="3"
                                                                    className="focus:ring-2 focus:ring-emerald-500 transition-all border-slate-200"
                                                                />
                                                            </TextField.Root>
                                                        </div>
                                                        <div className="flex-1">
                                                            <TextField.Root>
                                                                <TextField.Slot>
                                                                    <Activity className="w-4 h-4 text-purple-500" />
                                                                </TextField.Slot>
                                                                <TextField.Input
                                                                    value={formCorrente}
                                                                    variant='surface'
                                                                    onChange={(e) => setFormCorrente(e.target.value)}
                                                                    placeholder='Corrente (Ex: 10A)'
                                                                    size="3"
                                                                    className="focus:ring-2 focus:ring-emerald-500 transition-all border-slate-200"
                                                                />
                                                            </TextField.Root>
                                                        </div>
                                                        <div className="flex-1 min-w-[180px]">
                                                            <motion.div whileHover={{ scale: 1.02 }}>
                                                                <Autocomplete
                                                                    label="Tensão"
                                                                    placeholder="EX: 127V"
                                                                    variant="bordered"
                                                                    defaultItems={tensoes.map(t => ({ id: t, name: t }))}
                                                                    selectedKey={formTensao}
                                                                    onSelectionChange={(key) => setFormTensao(key as string)}
                                                                    size="lg"
                                                                    className="focus-within:ring-2 focus-within:ring-emerald-500 transition-all"
                                                                    startContent={<Zap className="w-4 h-4 text-yellow-500" />}
                                                                >
                                                                    {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                                                                </Autocomplete>
                                                            </motion.div>
                                                        </div>
                                                        <div className="flex-1 min-w-[180px]">
                                                            <motion.div whileHover={{ scale: 1.02 }}>
                                                                <Autocomplete
                                                                    label="Unidade*"
                                                                    placeholder="EX: UN"
                                                                    variant="bordered"
                                                                    defaultItems={unidadeMaterial.map(u => ({ id: u, name: u }))}
                                                                    selectedKey={formUnidade}
                                                                    onSelectionChange={(key) => setFormUnidade(key as string)}
                                                                    isRequired
                                                                    size="lg"
                                                                    className="focus-within:ring-2 focus-within:ring-emerald-500 transition-all"
                                                                    startContent={<Archive className="w-4 h-4 text-indigo-500" />}
                                                                >
                                                                    {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                                                                </Autocomplete>
                                                            </motion.div>
                                                        </div>
                                                    </Flex>
                                                </motion.div>

                                                {/* Botão Criar */}
                                                <motion.div variants={fadeInUp}>
                                                    <Flex justify="end" mt="6">
                                                        <motion.div
                                                            whileHover={{ scale: 1.05, y: -2 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Button
                                                                size="3"
                                                                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-8 flex items-center"
                                                                onClick={handleCreateMaterialSubmit}
                                                                disabled={mutationCreateMaterial.isLoading}
                                                            >
                                                                {mutationCreateMaterial.isLoading ? (
                                                                    <motion.div
                                                                        animate={{ rotate: 360 }}
                                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                    >
                                                                        <RefreshCw className="w-5 h-5 mr-2" />
                                                                    </motion.div>
                                                                ) : (
                                                                    <Plus className="w-5 h-5 mr-2" />
                                                                )}
                                                                Criar Material
                                                            </Button>
                                                        </motion.div>
                                                    </Flex>
                                                </motion.div>
                                            </motion.div>
                                        </Box>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </motion.div>
                )}

                {/* Seção de Busca */}
                <motion.div variants={fadeInUp}>
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
                        <Box className="p-6">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                                <Flex align="center" gap="4" mb="4">
                                    <motion.div
                                        className="p-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl text-white shadow-lg"
                                        whileHover={{
                                            rotate: [0, -5, 5, 0],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Search className="w-7 h-7" />
                                    </motion.div>
                                    <div>
                                        <Heading size="6" className="text-slate-800 mb-1">
                                            Buscar Materiais
                                        </Heading>
                                        <Text className="text-slate-600 text-sm flex items-center gap-2">
                                            <Filter className="w-4 h-4" />
                                            Encontre materiais por descrição ou código
                                        </Text>
                                    </div>
                                </Flex>

                                <motion.div variants={staggerContainer} className="space-y-4">
                                    <motion.div variants={fadeInUp}>
                                        <Flex direction={{ initial: 'column', sm: 'row' }} gap="4">
                                            <div className="flex-1">
                                                <motion.div whileHover={{ scale: 1.02 }}>
                                                    <TextField.Root>
                                                        <TextField.Slot>
                                                            <Search className="w-4 h-4 text-slate-400" />
                                                        </TextField.Slot>
                                                        <TextField.Input
                                                            value={inputDescricao}
                                                            variant='surface'
                                                            onChange={(e) => setInputDescricao(e.target.value)}
                                                            placeholder='Buscar por Descrição (mín. 4 caracteres)'
                                                            size="3"
                                                            className="focus:ring-2 focus:ring-purple-500 transition-all border-slate-200 bg-white/80"
                                                        />
                                                    </TextField.Root>
                                                </motion.div>
                                            </div>
                                            <div className="flex-1">
                                                <motion.div whileHover={{ scale: 1.02 }}>
                                                    <TextField.Root>
                                                        <TextField.Slot>
                                                            <Hash className="w-4 h-4 text-slate-400" />
                                                        </TextField.Slot>
                                                        <TextField.Input
                                                            value={inputCodigoFabricante}
                                                            variant='surface'
                                                            onChange={(e) => setInputCodigoFabricante(e.target.value)}
                                                            placeholder='Buscar por Código (mín. 4 caracteres)'
                                                            size="3"
                                                            className="focus:ring-2 focus:ring-purple-500 transition-all border-slate-200 bg-white/80" />
                                                    </TextField.Root>
                                                </motion.div>
                                            </div>
                                        </Flex>
                                    </motion.div>

                                    <motion.div variants={fadeInUp}>
                                        <AnimatePresence>
                                            {(isLoadingMateriais || isFetchingMateriais) && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                                                >
                                                    <Spinner size="sm" color="primary" />
                                                    <Text className="text-blue-700 font-medium">
                                                        Buscando materiais...
                                                    </Text>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Área de Resultados */}
                            <AnimatePresence mode="wait">
                                {materiais.length > 0 ? (
                                    <motion.div
                                        key="results"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <motion.div
                                            variants={fadeInUp}
                                            className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 mb-6 border border-slate-200"
                                        >
                                            <Flex align="center" justify="between">
                                                <Flex align="center" gap="3">
                                                    <motion.div
                                                        className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white"
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        <Package className="w-5 h-5" />
                                                    </motion.div>
                                                    <div>
                                                        <Heading size="4" className="text-slate-800">
                                                            Materiais Encontrados
                                                        </Heading>
                                                        <Text className="text-slate-600 text-sm">
                                                            {materiais.length} {materiais.length === 1 ? 'material encontrado' : 'materiais encontrados'}
                                                        </Text>
                                                    </div>
                                                </Flex>
                                            </Flex>
                                            
                                            {isPreviousData && (
                                                <Callout.Root color="amber" className="mt-3">
                                                    <Callout.Icon>
                                                        <AlertTriangle className="w-4 h-4" />
                                                    </Callout.Icon>
                                                    <Callout.Text>
                                                        Mostrando resultados anteriores enquanto busca...
                                                    </Callout.Text>
                                                </Callout.Root>
                                            )}
                                        </motion.div>

                                        <motion.div
                                            variants={staggerContainer}
                                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
                                        >
                                            <Table.Root className="w-full">
                                                <Table.Header className="bg-gradient-to-r from-slate-50 to-gray-50">
                                                    <Table.Row>
                                                        <Table.ColumnHeaderCell className="p-4 font-semibold text-slate-700"><Flex align="center" gap="2"><Hash className="w-4 h-4" />Código</Flex></Table.ColumnHeaderCell>
                                                        <Table.ColumnHeaderCell className="p-4 font-semibold text-slate-700"><Flex align="center" gap="2"><Package className="w-4 h-4" />Descrição</Flex></Table.ColumnHeaderCell>
                                                        <Table.ColumnHeaderCell className="p-4 font-semibold text-slate-700"><Flex align="center" gap="2"><Building2 className="w-4 h-4" />Marca</Flex></Table.ColumnHeaderCell>
                                                        <Table.ColumnHeaderCell className="p-4 font-semibold text-slate-700"><Flex align="center" gap="2"><Archive className="w-4 h-4" />Estoque</Flex></Table.ColumnHeaderCell>
                                                        <Table.ColumnHeaderCell className="p-4 font-semibold text-slate-700"><Flex align="center" gap="2"><MapPin className="w-4 h-4" />Local</Flex></Table.ColumnHeaderCell>
                                                        <Table.ColumnHeaderCell className="p-4 font-semibold text-slate-700"><Flex align="center" gap="2"><DollarSign className="w-4 h-4" />Preço</Flex></Table.ColumnHeaderCell>
                                                        {conditionsRoles && <Table.ColumnHeaderCell className="p-4 font-semibold text-slate-700"><Flex align="center" gap="2"><Edit3 className="w-4 h-4" />Ações</Flex></Table.ColumnHeaderCell>}
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    <AnimatePresence>
                                                        {(materiais as IInventario[]).map((item:IInventario, index) => (
                                                            <MotionTableRow
                                                                key={item.id}
                                                                variants={tableRowVariants}
                                                                initial="initial"
                                                                animate="animate"
                                                                exit="exit"
                                                                transition={{ delay: index * 0.05 }}
                                                                className={`border-b border-slate-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 cursor-pointer`}
                                                                onMouseEnter={() => setHoveredRow(item.id?.toString() || null)}
                                                                onMouseLeave={() => setHoveredRow(null)}
                                                            >
                                                                <Table.Cell className="p-4">
                                                                    <Badge color="gray" variant="soft" className="font-mono text-xs">{item.material.codigoFabricante || 'N/A'}</Badge>
                                                                </Table.Cell>
                                                                <Table.Cell className="p-4 max-w-xs truncate">
                                                                    <Text className="font-medium text-slate-800 truncate">{item.material.descricao}</Text>
                                                                    <Text className="text-xs text-slate-500 mt-1 block">{item.material.unidade}</Text>
                                                                </Table.Cell>
                                                                <Table.Cell className="p-4">
                                                                    {item.material.marca ? <Badge color="blue" variant="soft">{item.material.marca}</Badge> : <Text className="text-slate-400 text-sm">N/A</Text>}
                                                                </Table.Cell>
                                                                <Table.Cell className="p-4">
                                                                    <Flex align="center" gap="2">
                                                                        <Badge color={getStockBadgeColor(item.estoque || 0)} variant="solid" className="px-3 py-1 font-bold">{item.estoque || 0}</Badge>
                                                                        {(item.estoque || 0) <= 5 && (
                                                                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                                                                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                                            </motion.div>
                                                                        )}
                                                                    </Flex>
                                                                </Table.Cell>
                                                                <Table.Cell className="p-4">
                                                                    {item.material.localizacao ? <Text className="text-sm font-medium text-slate-700">{item.material.localizacao}</Text> : <Text className="text-slate-400 text-sm">N/A</Text>}
                                                                </Table.Cell>
                                                                <Table.Cell className="p-4">
                                                                    {item.material.precoCusto ? <Text className="text-sm font-bold text-green-700">R$ {item.material.precoCusto.toFixed(2).replace('.', ',')}</Text> : <Text className="text-slate-400 text-sm">N/A</Text>}
                                                                </Table.Cell>
                                                                {conditionsRoles && (
                                                                    <Table.Cell className="p-4">
                                                                        <Button size="2" variant="soft" color="blue" onClick={() => handleNavigateToUpdate(item.id)}>
                                                                            <Edit3 className="w-4 h-4 mr-1" />
                                                                            Editar
                                                                        </Button>
                                                                    </Table.Cell>
                                                                )}
                                                            </MotionTableRow>
                                                        ))}
                                                    </AnimatePresence>
                                                </Table.Body>
                                            </Table.Root>
                                        </motion.div>
                                    </motion.div>
                                ) : searchTerm && !isLoadingMateriais && !isFetchingMateriais ? (
                                    <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center py-16">
                                        <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="mb-6">
                                            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-slate-100 to-gray-100 rounded-full flex items-center justify-center">
                                                <Search className="w-12 h-12 text-slate-400" />
                                            </div>
                                        </motion.div>
                                        <Heading size="5" className="text-slate-600 mb-2">Nenhum material encontrado</Heading>
                                        <Text className="text-slate-500 max-w-md mx-auto">Tente ajustar os termos de busca ou use pelo menos 4 caracteres.</Text>
                                    </motion.div>
                                ) : (
                                    <motion.div key="initial" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                                        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="mb-6">
                                            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                                <Eye className="w-12 h-12 text-blue-500" />
                                            </div>
                                        </motion.div>
                                        <Heading size="5" className="text-slate-700 mb-2">Comece digitando para buscar</Heading>
                                        <Text className="text-slate-500 max-w-md mx-auto">Digite pelo menos 4 caracteres na descrição ou código para encontrar materiais.</Text>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Box>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default CreateMaterialPage;