"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { Toaster, toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from 'lucide-react';

// Serviços da API
import { getMateriaisByOrcamentoId } from "@/app/services/ItensOrcamento.Service";
import { getOrcamentoById, updateOrcamento } from "@/app/services/Orcamentos.Service"; 

// Componentes da Página
import { BudgetHeader } from "@/app/componentes/OrcamentoComponents/BudgetHeader";
import { CustomerForm } from "@/app/componentes/OrcamentoComponents/CustomForm";
import { MaterialsSection } from '@/app/componentes/OrcamentoComponents/MaterialsSection';
import { BudgetSummary } from '@/app/componentes/OrcamentoComponents/BudgetSummary';
import { ActionButtons } from '@/app/componentes/OrcamentoComponents/ActionButtons';

// --- Interfaces e Reducer para o estado do formulário ---
interface BudgetState {
  nomeCliente: string;
  endereco: string;
  emailCliente: string;
  cpfOrCnpj: string;
  telefone: string;
  observacoes: string;
  metodoPagamento: string;
  desconto: string;
}

type BudgetAction = 
  | { type: 'SET_FIELD'; field: keyof BudgetState; value: string }
  | { type: 'LOAD_DATA'; payload: BudgetState };

const budgetReducer = (state: BudgetState, action: BudgetAction): BudgetState => {
  switch (action.type) {
    case 'SET_FIELD': return { ...state, [action.field]: action.value };
    case 'LOAD_DATA': return { ...state, ...action.payload };
    default: return state;
  }
};

const initialState: BudgetState = {
  nomeCliente: '',
  endereco: '',
  emailCliente: '',
  cpfOrCnpj: '',
  telefone: '',
  observacoes: '',
  metodoPagamento: 'Cartão de Crédito',
  desconto: '0',
};

export default function ManageBudgetPage({ params }: { params: { orcamentoId: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formState, dispatch] = useReducer(budgetReducer, initialState);
  
  const orcamentoId = Number(params.orcamentoId);

  // --- BUSCA DE DADOS ---
  const { data: orcamento, isLoading: isLoadingOrcamento, isError: isErrorOrcamento } = useQuery({
    queryKey: ['orcamento', orcamentoId],
    queryFn: () => getOrcamentoById(orcamentoId),
    enabled: !!orcamentoId,
  });

  const { data: materiais, isLoading: isLoadingMateriais, isError: isErrorMateriais } = useQuery({
    queryKey: ['materiaisOrcamento', orcamentoId],
    queryFn: () => getMateriaisByOrcamentoId(orcamentoId),
    enabled: !!orcamentoId,
    initialData: [],
  });

  // --- MUTAÇÃO PARA ATUALIZAR ORÇAMENTO ---
  const updateBudgetMutation = useMutation({
    mutationFn: updateOrcamento,
    onSuccess: () => {
      toast.success("Orçamento atualizado!");
      queryClient.invalidateQueries({ queryKey: ['orcamento', orcamentoId] });
    },
    onError: (error: any) => {
      toast.error(`Falha ao atualizar orçamento: ${error.message}`);
    },
  });
  
  // --- EFEITO PARA CARREGAR O FORMULÁRIO COM DADOS DA API ---
  useEffect(() => {
    if (orcamento) {
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          nomeCliente: orcamento.nomeCliente || '',
          endereco: orcamento.endereco || '',
          emailCliente: orcamento.emailCliente || '',
          cpfOrCnpj: orcamento.cpfOrCnpj || '',
          telefone: orcamento.telefone || '',
          observacoes: orcamento.observacoes || '',
          metodoPagamento: orcamento.tipoPagamento || 'PIX',
          desconto: orcamento.desconto?.toString() || '0',
        },
      });
    }
  }, [orcamento]);
  
  // --- HANDLERS ---
  const handleFormChange = (field: keyof BudgetState, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };
  
  const handleUpdateBudget = () => {
    if (!orcamento || updateBudgetMutation.isPending) return;

    const payload = {
      ...orcamento,
      nomeCliente: formState.nomeCliente,
      endereco: formState.endereco,
      emailCliente: formState.emailCliente,
      cpfOrCnpj: formState.cpfOrCnpj,
      telefone: formState.telefone,
      observacoes: formState.observacoes,
      tipoPagamento: formState.metodoPagamento,  // Mapear para tipoPagamento
      desconto: parseFloat(formState.desconto.replace(',', '.')) || 0,
    };
    
    updateBudgetMutation.mutate(payload);
  };
  
  // --- RENDERIZAÇÃO DE ESTADO DE CARREGAMENTO / ERRO ---
  if (isLoadingOrcamento || isLoadingMateriais) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Carregando orçamento...</p>
        </motion.div>
      </div>
    );
  }

  if (isErrorOrcamento || isErrorMateriais) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erro ao carregar</h2>
          <p className="text-gray-500 mb-6">Não foi possível carregar o orçamento ou seus materiais.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Voltar
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <Toaster richColors position="top-right" />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <BudgetHeader 
          budgetId={orcamento?.id} 
          onBack={() => router.back()}
          isPaid={orcamento?.isPayed}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            <CustomerForm 
              formState={formState} 
              onFormChange={handleFormChange}
              onBlur={handleUpdateBudget}
            />
            <MaterialsSection
              orcamentoId={orcamentoId}
              isPaid={orcamento?.isPayed}
              materiais={materiais}
            />
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            <BudgetSummary 
              materiais={materiais}
              desconto={formState.desconto}
            />
            <ActionButtons
              isPaid={orcamento?.isPayed}
              orcamento={orcamento}
              materiais={materiais}
              onAuthorize={() => { /* Implementar lógica de autorização aqui */ }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}