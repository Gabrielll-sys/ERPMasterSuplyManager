"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { Theme, Box, Text } from "@radix-ui/themes";
import { Toaster, toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/react";
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
  metodoPagamento: 'PIX',
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
    initialData: [], // Inicia com um array vazio para evitar 'undefined'
  });

  // --- MUTAÇÃO PARA ATUALIZAR ORÇAMENTO ---
  const updateBudgetMutation = useMutation({
    mutationFn: updateOrcamento,
    onSuccess: () => {
      toast.success("Orçamento atualizado!");
      queryClient.invalidateQueries(['orcamento', orcamentoId]);
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
  
  // CORRIGIDO: Função que efetivamente salva as alterações do formulário
  const handleUpdateBudget = () => {
    if (!orcamento || updateBudgetMutation.isLoading) return;

    // Combina os dados originais do orçamento com as alterações do formulário
    const payload = {
      ...orcamento,
      ...formState,
      // Garante que o desconto seja enviado como número
      desconto: parseFloat(formState.desconto.replace(',', '.')) || 0,
    };
    
    updateBudgetMutation.mutate(payload);
  };
  
  // --- RENDERIZAÇÃO DE ESTADO DE CARREGAMENTO / ERRO ---
  if (isLoadingOrcamento || isLoadingMateriais) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
        <Text ml="2">Carregando dados do orçamento...</Text>
      </Box>
    );
  }

  if (isErrorOrcamento || isErrorMateriais) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <Text color="red">Erro ao carregar o orçamento ou seus materiais.</Text>
      </Box>
    );
  }

  return (
    <Theme>
      <Toaster richColors position="top-right" />
      
      <Box className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <BudgetHeader 
          budgetId={orcamento?.id} 
          onBack={() => router.back()} 
        />

        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
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
          <aside className="lg:col-span-1 space-y-6">
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
          </aside>
        </main>
      </Box>
    </Theme>
  );
}