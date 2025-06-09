"use client";

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import "dayjs/locale/pt-br";
import { z } from 'zod';

// UI e Ícones
import { 
    Box, 
    Card, 
    Flex, 
    Heading, 
    Text, 
    Table, 
    TextField, 
    Button,
    Callout,
    IconButton
} from '@radix-ui/themes';
import {DatePicker} from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import { 
  Search, 
  ListOrdered, 
  X, 
  FileWarning, 
  Loader2,
  CalendarDays,
  User,
  ServerCrash
} from 'lucide-react';

// Serviços e Hooks
import { url } from "../api/webApiUrl";
import { authHeader } from '../_helpers/auth_headers';
import axios from "axios";

// Configura o locale do dayjs
dayjs.locale('pt-br');

// --- TIPOS E SCHEMAS ---
interface ILogAcao {
  id: number;
  acao: string;
  dataAcao: string;
  responsavel: string;
}

const filterSchema = z.object({
  searchTerm: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FilterState = z.infer<typeof filterSchema>;

// --- HOOK DE DEBOUNCE ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

// --- FUNÇÃO DE FETCH ---
const fetchLogs = async (filters: FilterState): Promise<ILogAcao[]> => {
    const params = new URLSearchParams();
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const { data } = await axios.get(`${url}/LogAcoesUsuario/filter`, {
        headers: authHeader(),
        params
    });
    return data;
};

// --- COMPONENTE PRINCIPAL ---
export default function LogRegisterPage() {
    // --- ESTADOS E HOOKS ---
    const [filters, setFilters] = useState<FilterState>({});
    const debouncedSearchTerm = useDebounce(filters.searchTerm, 500);

    const queryFilters = useMemo(() => ({
        ...filters,
        searchTerm: debouncedSearchTerm,
    }), [filters, debouncedSearchTerm]);

    const { data: logs = [] as ILogAcao[], isLoading, isError, isFetching } = useQuery<ILogAcao[], Error>({
        queryKey: ['logs', queryFilters],
        queryFn: () => fetchLogs(queryFilters),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });

    const handleFilterChange = (field: keyof FilterState, value: string | null) => {
        setFilters(prev => ({ ...prev, [field]: value || undefined }));
    };
    
    const clearFilters = () => {
        setFilters({});
    };

    // --- RENDERIZAÇÃO ---
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 md:p-8 min-h-screen bg-slate-50"
        >
            <Box className="max-w-7xl mx-auto">
                {/* Cabeçalho */}
                <Flex direction="column" gap="2" align="center" mb="8">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                        <ListOrdered className="w-8 h-8 text-white" />
                    </div>
                    <Heading size="8" className="text-gray-800">Registro de Ações</Heading>
                    <Text color="gray" size="4">Explore o histórico de atividades do sistema.</Text>
                </Flex>

                {/* Controles de Filtro */}
                <Card className="mb-8 shadow-sm">
                    <Flex direction={{ initial: 'column', md: 'row' }} gap="4" align="end">
                        <Box className="flex-grow">
                            <Text as="label" size="2" weight="medium" mb="1" className="block">Buscar Ação ou Responsável</Text>
                            <TextField.Root size="3">
                                <TextField.Slot><Search className="w-4 h-4 text-gray-500" /></TextField.Slot>
                                <TextField.Input
                                    placeholder="Ex: 'Material criado' ou 'nome.sobrenome'"
                                    value={filters.searchTerm || ""}
                                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                />
                            </TextField.Root>
                        </Box>

                        <Box>
                            <Text as="label" size="2" weight="medium" mb="1" className="block">Data de Início</Text>
                            <DatePicker
                                aria-label="Data de início"
                                value={filters.startDate ? parseDate(filters.startDate) : null}
                                onChange={(date:any) => handleFilterChange('startDate', date ? date.toString() : null)}
                            />
                        </Box>

                        <Box>
                            <Text as="label" size="2" weight="medium" mb="1" className="block">Data de Fim</Text>
                            <DatePicker
                                aria-label="Data de fim"
                                value={filters.endDate ? parseDate(filters.endDate) : null}
                                onChange={(date:any) => handleFilterChange('endDate', date ? date.toString() : null)}
                            />
                        </Box>
                        
                        <Button variant="soft" color="gray" size="3" onClick={clearFilters} disabled={isFetching}>
                            <X className="w-4 h-4 mr-1" />
                            Limpar Filtros
                        </Button>
                    </Flex>
                </Card>

                {/* Tabela de Resultados */}
                <Card className="shadow-lg">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div key="loading" className="p-8 text-center">
                                <Flex align="center" justify="center" gap="3">
                                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                                    <Text size="4" color="gray">Carregando registros...</Text>
                                </Flex>
                            </motion.div>
                        ) : isError ? (
                            <motion.div key="error" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="p-8">
                                <Callout.Root color="red" size="2">
                                    <Callout.Icon><ServerCrash /></Callout.Icon>
                                    <Callout.Text>
                                        Falha ao buscar os registros. Por favor, verifique sua conexão e tente novamente.
                                    </Callout.Text>
                                </Callout.Root>
                            </motion.div>
                        ) : logs.length === 0 ? (
                            <motion.div key="empty" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="p-12 text-center">
                                <FileWarning className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <Heading size="5" className="text-gray-700">Nenhum Registro Encontrado</Heading>
                                <Text color="gray" mt="2">Tente ajustar os filtros ou limpe-os para ver todos os registros.</Text>
                            </motion.div>
                        ) : (
                            <motion.div key="table" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                <Table.Root variant="surface">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeaderCell>Ação</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>Responsável</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>Data e Hora</Table.ColumnHeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {logs.map(log => (
                                            <Table.Row key={log.id}>
                                                <Table.Cell><Text>{log.acao}</Text></Table.Cell>
                                                <Table.Cell>
                                                    <Flex align="center" gap="2">
                                                        <User className="w-4 h-4 text-gray-500" />
                                                        <Text>{log.responsavel}</Text>
                                                    </Flex>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Flex align="center" gap="2">
                                                        <CalendarDays className="w-4 h-4 text-gray-500" />
                                                        <Text>{dayjs(log.dataAcao).format('DD/MM/YYYY [às] HH:mm:ss')}</Text>
                                                    </Flex>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </Box>
        </motion.div>
    );
}