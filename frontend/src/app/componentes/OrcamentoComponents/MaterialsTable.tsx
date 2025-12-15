"use client";

import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Check, X, Trash2, Package, DollarSign, Hash, Ruler } from 'lucide-react';
import { updateItemOrcamento } from '@/app/services/ItensOrcamento.Service';
import type { IItemOrcamento } from '@/app/interfaces/IItemOrcamento';

interface MaterialsTableProps {
  materiais: any[];
  isPaid?: boolean;
  onEdit: (item: any) => void;
  onDelete: (itemId: number) => void;
  orcamentoId: number;
}

export function MaterialsTable({ 
  materiais, 
  isPaid, 
  onEdit, 
  onDelete,
  orcamentoId 
}: MaterialsTableProps) {
  const queryClient = useQueryClient();
  
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  const updatePriceMutation = useMutation({
    mutationFn: ({itemId, novoPreco }: { itemId: number; novoPreco: number }) => {
      const item = materiais.find(m => m.id === itemId);
      if (!item) throw new Error('Item não encontrado');
      
      return updateItemOrcamento({
        item: { ...item, precoVenda: novoPreco },
        novaQuantidade: item.quantidadeMaterial
      });
    },
    onSuccess: () => {
      toast.success("Preço atualizado!");
      queryClient.invalidateQueries({ queryKey: ['materiaisOrcamento', orcamentoId] });
      setEditingPriceId(null);
      setTempPrice('');
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
      setEditingPriceId(null);
      setTempPrice('');
    },
  });

  const formatPriceInput = useCallback((value: string): string => {
    const cleaned = value.replace(/[^\d,]/g, '');
    if (cleaned.includes(',')) {
      const [integer, decimal] = cleaned.split(',');
      return `${integer},${decimal.slice(0, 2)}`;
    }
    return cleaned;
  }, []);

  const handleStartEditPrice = useCallback((item: any) => {
    if (isPaid) return;
    setEditingPriceId(item.id);
    const currentPrice = item.precoVenda || item.precoItemOrcamento || item.material?.precoVenda || 0;
    setTempPrice(Number(currentPrice).toFixed(2).replace('.', ','));
  }, [isPaid]);

  const handleCancelEditPrice = useCallback(() => {
    setEditingPriceId(null);
    setTempPrice('');
  }, []);

  const handlePriceInputChange = useCallback((value: string) => {
    setTempPrice(formatPriceInput(value));
  }, [formatPriceInput]);

  const handleSavePrice = useCallback((itemId: number) => {
    const numericPrice = parseFloat(tempPrice.replace(',', '.'));
    
    if (isNaN(numericPrice)) {
      toast.error('Por favor, insira um valor válido');
      return;
    }

    if (numericPrice < 0) {
      toast.error('O preço não pode ser negativo');
      return;
    }

    updatePriceMutation.mutate({ itemId, novoPreco: numericPrice });
  }, [tempPrice, updatePriceMutation]);

  const handlePriceKeyDown = useCallback((e: React.KeyboardEvent, itemId: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSavePrice(itemId);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEditPrice();
    }
  }, [handleSavePrice, handleCancelEditPrice]);

  const formatCurrency = useCallback((value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }, []);

  const getItemPrice = useCallback((item: IItemOrcamento): number => {
    const price = item.precoItemOrcamento ?? item.material?.precoVenda ?? 0;
    return Number(price);
  }, []);

  const calculateSubtotal = useCallback((item: IItemOrcamento): number => {
    const price = getItemPrice(item);
    const quantity = item.quantidadeMaterial || 0;
    return Number(price) * quantity;
  }, [getItemPrice]);

  // Agrupa quantidades por unidade
  const quantitiesByUnit = useMemo(() => {
    const grouped: Record<string, number> = {};
    materiais.forEach(item => {
      const unit = item.material?.unidade || 'UN';
      grouped[unit] = (grouped[unit] || 0) + (item.quantidadeMaterial || 0);
    });
    return grouped;
  }, [materiais]);

  if (!materiais || materiais.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Header da Tabela - Desktop */}
      <div className="hidden lg:grid grid-cols-12 gap-3 px-4 py-3 bg-gray-800 text-white rounded-xl">
        <div className="col-span-1 text-xs font-semibold text-center">ID</div>
        <div className="col-span-5 text-xs font-semibold flex items-center gap-2">
          <Package className="w-3.5 h-3.5" />
          Material
        </div>
        <div className="col-span-1 text-xs font-semibold text-center">Qtd</div>
        <div className="col-span-1 text-xs font-semibold text-center">Un</div>
        <div className="col-span-2 text-xs font-semibold text-center">Unitário</div>
        <div className="col-span-2 text-xs font-semibold text-center">Subtotal</div>
      </div>

      {/* Lista de Materiais */}
      <AnimatePresence>
        {materiais.map((item: IItemOrcamento, index: number) => {
          const unitPrice = getItemPrice(item);
          const subtotal = calculateSubtotal(item);
          const isEditing = editingPriceId === item.id;
          const unit = item.material?.unidade || 'UN';

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.03 }}
              className={`
                group bg-white border rounded-xl transition-all duration-200
                ${!isPaid ? 'hover:shadow-md hover:border-gray-200' : ''}
                ${isEditing ? 'border-blue-300 shadow-md ring-2 ring-blue-100' : 'border-gray-100'}
              `}
            >
              {/* Layout Desktop */}
              <div className="hidden lg:grid grid-cols-12 gap-3 items-center px-4 py-3">
                {/* ID */}
                <div className="col-span-1 text-center">
                  <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    #{item.material?.id || item.id}
                  </span>
                </div>

                {/* Material - Descrição expandida */}
                <div className="col-span-5">
                  <p className="text-sm font-medium text-gray-900 leading-snug">
                    {item.material?.descricao}
                  </p>
                  {item.material?.codigoFabricante && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Cód: {item.material.codigoFabricante}
                    </p>
                  )}
                </div>

                {/* Quantidade */}
                <div className="col-span-1 text-center">
                  <span className="inline-flex items-center justify-center min-w-[2rem] h-7 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm">
                    {item.quantidadeMaterial}
                  </span>
                </div>

                {/* Unidade */}
                <div className="col-span-1 text-center">
                  <span className="inline-flex items-center justify-center px-2 h-6 bg-purple-50 text-purple-700 rounded text-xs font-semibold">
                    {unit}
                  </span>
                </div>

                {/* Preço Unitário */}
                <div className="col-span-2 flex justify-center">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">R$</span>
                      <input
                        type="text"
                        value={tempPrice}
                        onChange={(e) => handlePriceInputChange(e.target.value)}
                        onKeyDown={(e) => handlePriceKeyDown(e, item.id)}
                        placeholder="0,00"
                        autoFocus
                        className="w-20 px-2 py-1 text-center border-2 border-blue-400 rounded-lg text-sm font-medium focus:outline-none"
                      />
                      <button
                        onClick={() => handleSavePrice(item.id)}
                        disabled={updatePriceMutation.isPending}
                        className="w-6 h-6 rounded bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                      <button
                        onClick={handleCancelEditPrice}
                        className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                      >
                        <X className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEditPrice(item)}
                      disabled={isPaid}
                      className={`
                        group/price flex items-center gap-1 px-2 py-1 rounded-lg transition-all text-sm
                        ${!isPaid ? 'hover:bg-blue-50 cursor-pointer' : 'cursor-default'}
                        ${unitPrice === 0 ? 'text-amber-600 font-bold' : 'text-gray-700'}
                      `}
                    >
                      {formatCurrency(unitPrice)}
                      {!isPaid && (
                        <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover/price:opacity-100 transition-opacity" />
                      )}
                    </button>
                  )}
                </div>

                {/* Subtotal */}
                <div className="col-span-2 text-center">
                  <span className="font-bold text-emerald-600 text-sm">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>

              {/* Ações Desktop - Hover */}
              {!isPaid && (
                <div className="hidden lg:flex items-center justify-end gap-1 px-4 pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                    title="Editar quantidade"
                  >
                    <Edit3 className="w-3 h-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
                    title="Remover item"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remover
                  </button>
                </div>
              )}

              {/* Layout Mobile/Tablet */}
              <div className="lg:hidden p-4 space-y-3">
                {/* Header com ID e Ações */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      #{item.material?.id || item.id}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-semibold">
                      {unit}
                    </span>
                  </div>
                  {!isPaid && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Descrição do Material */}
                <p className="text-sm font-medium text-gray-900 leading-relaxed">
                  {item.material?.descricao}
                </p>
                {item.material?.codigoFabricante && (
                  <p className="text-xs text-gray-400">Cód: {item.material.codigoFabricante}</p>
                )}

                {/* Grid de Valores */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-gray-500 uppercase mb-0.5">Quantidade</p>
                    <p className="font-bold text-blue-700">{item.quantidadeMaterial} {unit}</p>
                  </div>
                  <div 
                    className={`rounded-lg p-2 text-center ${!isPaid ? 'bg-gray-50 cursor-pointer hover:bg-gray-100' : 'bg-gray-50'}`}
                    onClick={() => !isPaid && handleStartEditPrice(item)}
                  >
                    <p className="text-[10px] text-gray-500 uppercase mb-0.5">Unitário</p>
                    <p className={`font-semibold text-sm ${unitPrice === 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                      {formatCurrency(unitPrice)}
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-gray-500 uppercase mb-0.5">Subtotal</p>
                    <p className="font-bold text-emerald-600 text-sm">{formatCurrency(subtotal)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Resumo de Quantidades por Unidade */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            {materiais.length} {materiais.length === 1 ? 'item' : 'itens'}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">Totais:</span>
          {Object.entries(quantitiesByUnit).map(([unit, qty]) => (
            <span 
              key={unit}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm"
            >
              <Ruler className="w-3 h-3 text-purple-500" />
              {qty} {unit}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}