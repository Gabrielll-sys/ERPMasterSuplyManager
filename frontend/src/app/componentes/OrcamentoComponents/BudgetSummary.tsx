"use client";

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Percent, Receipt } from 'lucide-react';
import { IItemOrcamento } from '@/app/interfaces/IItemOrcamento';

type BudgetSummaryProps = {
  materiais: IItemOrcamento[];
  desconto: string;
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function BudgetSummary({ materiais, desconto }: BudgetSummaryProps) {
  
  const { precoVendaTotal, precoComDesconto, quantidadeItens } = useMemo(() => {
    const total = materiais.reduce((acc, item) => {
      const precoUnitario = item.precoItemOrcamento ?? item.material?.precoVenda ?? 0;
      const itemTotal = Number(precoUnitario) * item.quantidadeMaterial;
      return acc + itemTotal;
    }, 0);

    const qtdItens = materiais.reduce((acc, item) => acc + item.quantidadeMaterial, 0);
    const discountValue = parseFloat(desconto.replace(',', '.')) || 0;
    const finalPrice = total * (1 - discountValue / 100);

    return {
      precoVendaTotal: total,
      precoComDesconto: finalPrice,
      quantidadeItens: qtdItens
    };
  }, [materiais, desconto]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Resumo Financeiro</h2>
            <p className="text-sm text-gray-500">{materiais.length} itens • {quantidadeItens} unidades</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Subtotal</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{formatCurrency(precoVendaTotal)}</span>
        </div>

        {/* Desconto */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Desconto ({desconto || '0'}%)</span>
          </div>
          <span className="text-sm font-medium text-red-500">
            - {formatCurrency(precoVendaTotal - precoComDesconto)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200 my-4" />

        {/* Total */}
        <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-emerald-600">{formatCurrency(precoComDesconto)}</span>
        </div>
      </div>
    </motion.div>
  );
}
