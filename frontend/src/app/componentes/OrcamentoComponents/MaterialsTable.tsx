"use client";

import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Table, Button, TextField, Text, IconButton } from '@radix-ui/themes';
import { Edit3, Check, X, Trash2 } from 'lucide-react';
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
  
  // Estados para controle da edição inline de preços
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Mutação para atualizar o preço de venda do item
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
      toast.success("Preço atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['materiaisOrcamento', orcamentoId] });
      setEditingPriceId(null);
      setTempPrice('');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar preço: ${error.message}`);
      setEditingPriceId(null);
      setTempPrice('');
    },
  });

  // Função para formatar entrada de preço em tempo real
  const formatPriceInput = useCallback((value: string): string => {
    // Remove tudo que não é número ou vírgula
    const cleaned = value.replace(/[^\d,]/g, '');
    
    // Se tem vírgula, limita a 2 casas decimais
    if (cleaned.includes(',')) {
      const [integer, decimal] = cleaned.split(',');
      return `${integer},${decimal.slice(0, 2)}`;
    }
    
    return cleaned;
  }, []);

  // Handlers para edição de preço
  const handleStartEditPrice = useCallback((item: any) => {
    if (isPaid) return;
    
    setEditingPriceId(item.id);
    const currentPrice = item.precoVenda || 0;
    setTempPrice(currentPrice.toFixed(2).replace('.', ','));
  }, [isPaid]);

  const handleCancelEditPrice = useCallback(() => {
    setEditingPriceId(null);
    setTempPrice('');
  }, []);

  const handlePriceInputChange = useCallback((value: string) => {
    const formatted = formatPriceInput(value);
    setTempPrice(formatted);
  }, [formatPriceInput]);

  const handleSavePrice = useCallback((itemId: number) => {
    const numericPrice = parseFloat(tempPrice.replace(',', '.'));
    
    if (isNaN(numericPrice)) {
      toast.error('Por favor, insira um valor numérico válido');
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

  // Funções de formatação memoizadas
  const formatPrice = useCallback((item: IItemOrcamento | null | undefined): string => {
    if ((item?.precoItemOrcamento == 0 || item?.precoItemOrcamento === 0) && (item?.precoVenda == 0 || item?.precoVenda === 0)) return 'R$ 0,00';
    else return item?.precoItemOrcamento ? 
      `R$ ${Number(item.precoItemOrcamento).toFixed(2).replace('.', ',')}` : 
      `R$ ${Number(item?.material?.precoVenda).toFixed(2).replace('.', ',')}`;
  }, []);

  const calculateSubtotal = useCallback((item: IItemOrcamento): number => {
   
    if ( item.material?.precoVenda != undefined && item.precoItemOrcamento!=undefined){

      const price = item.material?.precoVenda ? item.material?.precoVenda : item.precoItemOrcamento;
      const quantity = item.quantidadeMaterial || 0;
      console.log(Number(price) * quantity)
      return Number(price) * quantity;
    }
  }, []);

  // Memoiza os totais para evitar recálculos desnecessários
  const totalGeral = useMemo(() => {
    return materiais.reduce((total, item) => total + calculateSubtotal(item), 0);
  }, [materiais, calculateSubtotal]);

  if (!materiais || materiais.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Text>Nenhum material adicionado ao orçamento</Text>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Quantidade</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Preço Unitário</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Subtotal</Table.ColumnHeaderCell>
            {!isPaid && <Table.ColumnHeaderCell>Ações</Table.ColumnHeaderCell>}
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {materiais.map((item:IItemOrcamento) => (
            <Table.Row key={item.id}>
              {/* Coluna do Material */}
              <Table.Cell>
                <div>
                  <Text weight="medium">{item.material?.descricao}</Text>
                
                </div>
              </Table.Cell>

              {/* Coluna da Quantidade */}
              <Table.Cell>
                <Text>{item.quantidadeMaterial}</Text>
              </Table.Cell>

              {/* Coluna do Preço Unitário - EDITÁVEL */}
              <Table.Cell>
                {editingPriceId === item.id ? (
                  <div className="flex items-center gap-2 min-w-fit">
                    <TextField.Input
                      value={tempPrice}
                      onChange={(e) => handlePriceInputChange(e.target.value)}
                      onKeyDown={(e) => handlePriceKeyDown(e, item.id)}
                      placeholder="0,00"
                      size="1"
                      className="w-24 text-sm"
                      autoFocus
                      aria-label="Editar preço do material"
                    />
                    <IconButton
                      size="1"
                      variant="ghost"
                      color="green"
                      onClick={() => handleSavePrice(item.id)}
                      disabled={updatePriceMutation.isLoading}
                      title="Salvar preço"
                      aria-label="Salvar preço"
                    >
                      <Check size={12} />
                    </IconButton>
                    <IconButton
                      size="1"
                      variant="ghost"
                      color="red"
                      onClick={handleCancelEditPrice}
                      disabled={updatePriceMutation.isLoading}
                      title="Cancelar edição"
                      aria-label="Cancelar edição"
                    >
                      <X size={12} />
                    </IconButton>
                  </div>
                ) : (
                  <div 
                    className={`group flex items-center gap-1 transition-colors ${
                      !isPaid ? 'cursor-pointer hover:bg-gray-50 rounded px-2 py-1' : ''
                    }`}
                    onClick={() => handleStartEditPrice(item)}
                    title={!isPaid ? 'Clique para editar o preço' : ''}
                    role={!isPaid ? 'button' : undefined}
                    tabIndex={!isPaid ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (!isPaid && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleStartEditPrice(item);
                      }
                    }}
                    aria-label={!isPaid ? `Editar preço do material ${item.material?.descricao}` : undefined}
                  >
                    <Text 
                      color={!item.precoVenda || item.precoVenda === 0 ? 'orange' : 'gray'}
                      weight={!item.precoVenda || item.precoVenda === 0 ? 'bold' : 'regular'}
                    >
                      {formatPrice(item)}
                    </Text>
                    {!isPaid && (
                      <Edit3 
                        size={12} 
                        className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" 
                      />
                    )}
                  </div>
                )}
              </Table.Cell>

              {/* Coluna do Subtotal */}
              <Table.Cell>
                <Text weight="medium" color="blue">
                 R${calculateSubtotal(item)}
                </Text>
              </Table.Cell>

              {/* Coluna das Ações */}
              {!isPaid && (
                <Table.Cell>
                  <div className="flex gap-1">
                    <Button
                      size="1"
                      variant="ghost"
                      onClick={() => onEdit(item)}
                      title="Editar quantidade"
                      aria-label={`Editar quantidade do material ${item.material?.descricao}`}
                    >
                      <Edit3 size={12} />
                    </Button>
                    <Button
                      size="1"
                      variant="ghost"
                      color="red"
                      onClick={() => onDelete(item.id)}
                      title="Remover item"
                      aria-label={`Remover material ${item.material?.descricao}`}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
        
        {/* Rodapé com Total */}
        {/* <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={isPaid ? 3 : 4}>
              <Text weight="bold">Total Geral</Text>
            </Table.Cell>
            <Table.Cell>
              <Text weight="bold" color="blue" size="4">
                {formatPrice(totalGeral)}
              </Text>
            </Table.Cell>
            {!isPaid && <Table.Cell />}
          </Table.Row>
        </Table.Footer> */}
      </Table.Root>
    </div>
  );
}