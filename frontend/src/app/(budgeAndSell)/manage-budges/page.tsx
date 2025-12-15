"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import dayjs from 'dayjs';
import "dayjs/locale/pt-br";
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { 
  Search, 
  Plus, 
  FileText, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  DollarSign,
  ArrowRight,
  Filter,
  Loader2,
  AlertCircle
} from 'lucide-react';

// React Query
import { useQuery } from '@tanstack/react-query';

// Serviços e Interfaces
import { IOrcamento } from '@/app/interfaces/IOrcamento';
import { getAllOrcamentos, getOrcamentoById } from '@/app/services/Orcamentos.Service';

dayjs.locale("pt-br");

// Hook de Debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

// Variantes de animação
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export default function ManageBudgesPage() {
  const router = useRouter();

  const [inputNumeroOrcamento, setInputNumeroOrcamento] = useState<string>("");
  const [inputCliente, setInputCliente] = useState<string>("");

  const debouncedNumeroOrcamento = useDebounce(inputNumeroOrcamento, 500);
  const debouncedCliente = useDebounce(inputCliente, 500);

  const {
    data: orcamentosData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<IOrcamento[], Error>({
    queryKey: ['orcamentos', { cliente: debouncedCliente, numero: debouncedNumeroOrcamento }],
    queryFn: async () => {
      if (debouncedNumeroOrcamento && debouncedNumeroOrcamento.length > 0) {
        const id = parseInt(debouncedNumeroOrcamento);
        if (!isNaN(id)) {
          const orc = await getOrcamentoById(id);
          return orc ? [orc] : [];
        }
        return [];
      }
      return getAllOrcamentos();
    },
    staleTime: 1000 * 60 * 1,
  });

  const orcamentosExibidos: IOrcamento[] = useMemo(() => {
    let data = orcamentosData || [];
    if (debouncedCliente) {
      data = data.filter(orc => 
        orc.nomeCliente?.toLowerCase().includes(debouncedCliente.toLowerCase())
      );
    }
    return data.sort((a, b) => (b.id || 0) - (a.id || 0));
  }, [orcamentosData, debouncedCliente]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = orcamentosExibidos.length;
    const abertos = orcamentosExibidos.filter(o => !o.isPayed).length;
    const concluidos = orcamentosExibidos.filter(o => o.isPayed).length;
    const valorTotal = orcamentosExibidos.reduce((acc, o) => 
      acc + (o.precoVendaComDesconto || o.precoVendaTotal || 0), 0
    );
    return { total, abertos, concluidos, valorTotal };
  }, [orcamentosExibidos]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-blue-400 font-medium text-sm">Gestão Comercial</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Orçamentos</h1>
              <p className="text-gray-400 text-sm mt-1">Gerencie todos os orçamentos</p>
            </div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link 
                href="/create-budge"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all"
              >
                <Plus className="w-5 h-5" />
                Novo Orçamento
              </Link>
            </motion.div>
          </motion.div>

          {/* Stat Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-gray-400">Total</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.abertos}</p>
                  <p className="text-xs text-gray-400">Em Aberto</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.concluidos}</p>
                  <p className="text-xs text-gray-400">Concluídos</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold truncate">{formatCurrency(stats.valorTotal)}</p>
                  <p className="text-xs text-gray-400">Valor Total</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 sm:p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-gray-700">Filtros</span>
            {isFetching && <Loader2 className="w-4 h-4 text-blue-500 animate-spin ml-2" />}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do Orçamento
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={inputNumeroOrcamento}
                  onChange={(e) => setInputNumeroOrcamento(e.target.value)}
                  placeholder="Ex: 1234"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Cliente
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={inputCliente}
                  onChange={(e) => setInputCliente(e.target.value)}
                  placeholder="Buscar por cliente..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500">Carregando orçamentos...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar</h3>
            <p className="text-red-600">{error?.message || "Erro desconhecido"}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && orcamentosExibidos.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {debouncedCliente || debouncedNumeroOrcamento 
                ? "Nenhum orçamento encontrado" 
                : "Nenhum orçamento cadastrado"
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {debouncedCliente || debouncedNumeroOrcamento 
                ? "Tente ajustar os filtros de busca"
                : "Comece criando o primeiro orçamento"
              }
            </p>
            {!debouncedCliente && !debouncedNumeroOrcamento && (
              <Link 
                href="/create-budge"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                Criar Orçamento
              </Link>
            )}
          </div>
        )}

        {/* Grid de Orçamentos */}
        {!isLoading && !isError && orcamentosExibidos.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {orcamentosExibidos.map((orc) => (
              <motion.div
                key={orc.id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className={`
                  relative bg-white rounded-2xl shadow-sm border overflow-hidden
                  hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300
                  ${orc.isPayed ? 'border-emerald-100' : 'border-amber-100'}
                `}>
                  {/* Status Bar */}
                  <div className={`
                    h-1 w-full
                    ${orc.isPayed 
                      ? 'bg-gradient-to-r from-emerald-400 to-green-500' 
                      : 'bg-gradient-to-r from-amber-400 to-orange-500'
                    }
                  `} />

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-11 h-11 rounded-xl flex items-center justify-center
                          ${orc.isPayed 
                            ? 'bg-gradient-to-br from-emerald-50 to-green-100' 
                            : 'bg-gradient-to-br from-amber-50 to-orange-100'
                          }
                        `}>
                          <FileText className={`w-5 h-5 ${orc.isPayed ? 'text-emerald-600' : 'text-amber-600'}`} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Orçamento</p>
                          <h3 className="text-xl font-bold text-gray-900">#{orc.id}</h3>
                        </div>
                      </div>
                      <span className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                        ${orc.isPayed 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                        }
                      `}>
                        {orc.isPayed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {orc.isPayed ? 'Concluído' : 'Em Aberto'}
                      </span>
                    </div>

                    {/* Client */}
                    <div className="flex items-center gap-2 mb-3 p-2.5 bg-gray-50 rounded-xl">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {orc.nomeCliente || "Cliente não informado"}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">Data</p>
                          <p className="text-xs font-semibold text-gray-700">
                            {dayjs(orc.dataOrcamento).format("DD/MM/YY")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">Valor</p>
                          <p className="text-xs font-semibold text-gray-700">
                            {formatCurrency(orc.precoVendaComDesconto || orc.precoVendaTotal || 0)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link 
                      href={`/edit-budge/${orc.id}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-100 hover:bg-blue-500 text-gray-600 hover:text-white font-medium transition-all group-hover:bg-blue-500 group-hover:text-white"
                    >
                      <span>Ver Detalhes</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}