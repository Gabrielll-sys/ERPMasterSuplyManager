"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes de UI
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Search, Package, Plus, X, Loader2 } from 'lucide-react';

// Componentes e Serviços
import { MaterialsTable } from './MaterialsTable';
import { searchByDescription } from '@/app/services/Material.Services';
import { createItemOrcamento, updateItemOrcamento, deleteItemOrcamento } from '@/app/services/ItensOrcamento.Service';
import { IInventario } from '@/app/interfaces/IInventarios';
import { useConfirmDialog } from '@/app/hooks/useConfirmDialog';

type MaterialsSectionProps = {
  orcamentoId: number;
  isPaid?: boolean;
  materiais: any[];
};

export function MaterialsSection({ orcamentoId, isPaid, materiais }: MaterialsSectionProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IInventario[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any | null>(null);
  const [quantity, setQuantity] = useState("1");

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.length > 2) {
      const results = await searchByDescription(query);
      setSearchResults(results ?? []);
    } else {
      setSearchResults([]);
    }
  };

  const onMutationSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ['materiaisOrcamento', orcamentoId] });
    setIsDialogOpen(false);
  };

  const onMutationError = (error: any, defaultMessage: string) => {
    console.error(defaultMessage, error);
    toast.error(`${defaultMessage}: ${error.response?.data?.message || error.message}`);
  };

  const addItemMutation = useMutation({
    mutationFn: createItemOrcamento,
    onSuccess: () => onMutationSuccess("Material adicionado!"),
    onError: (error) => onMutationError(error, "Falha ao adicionar material"),
  });

  const updateItemMutation = useMutation({
    mutationFn: updateItemOrcamento,
    onSuccess: () => onMutationSuccess("Quantidade atualizada!"),
    onError: (error) => onMutationError(error, "Falha ao atualizar quantidade"),
  });

  const deleteItemMutation = useMutation({
    mutationFn: deleteItemOrcamento,
    onSuccess: () => onMutationSuccess("Material removido!"),
    onError: (error) => onMutationError(error, "Falha ao remover material"),
  });

  const handleConfirmAction = () => {
    if (!currentItem) return;

    if (currentItem.isEditing) {
      updateItemMutation.mutate({
        item: currentItem,
        novaQuantidade: Number(quantity),
      });
    } else {
      addItemMutation.mutate({
        orcamentoId,
        materialId: currentItem.materialId,
        quantidadeMaterial: Number(quantity),
        responsavelAdicao: session?.user?.name || "Sistema"
      });
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    const confirmed = await confirm({
      title: 'Remover material?',
      description: 'Tem certeza que deseja remover este item do orçamento? Esta ação não pode ser desfeita.',
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      variant: 'danger'
    });

    if (confirmed) {
      deleteItemMutation.mutate(itemId);
    }
  };

  const openAddDialog = (item: IInventario) => {
    const materialExists = materiais.some(m => m.material.id === item.materialId);
    if (materialExists) {
      toast.info("Este material já está no orçamento.");
      return;
    }
    setCurrentItem({ ...item, isEditing: false });
    setQuantity("1");
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: any) => {
    setCurrentItem({ ...item, isEditing: true });
    setQuantity(item.quantidadeMaterial.toString());
    setIsDialogOpen(true);
  };

  const isPending = addItemMutation.isPending || updateItemMutation.isPending;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Materiais do Orçamento</h2>
                <p className="text-sm text-gray-500">{materiais.length} itens adicionados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search Bar */}
          {!isPaid && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adicionar Material
              </label>
              <Autocomplete
                placeholder="Buscar por descrição do material..."
                startContent={<Search size={18} className="text-gray-400" />}
                value={searchTerm}
                onInputChange={handleSearch}
                items={searchResults}
                size="lg"
                classNames={{
                  base: "w-full",
                  listboxWrapper: "max-h-[300px]",
                }}
              >
                {(item: IInventario) => (
                  <AutocompleteItem 
                    key={item.id} 
                    onPress={() => openAddDialog(item)}
                    className="py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="font-medium">{item.material?.descricao}</span>
                    </div>
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <p className="text-xs text-gray-400 mt-2">
                Digite pelo menos 3 caracteres para buscar
              </p>
            </div>
          )}

          {/* Materials Table */}
          <MaterialsTable 
            materiais={materiais}
            isPaid={isPaid}
            onEdit={openEditDialog}
            onDelete={handleDeleteItem}
            orcamentoId={orcamentoId}
          />

          {/* Empty State */}
          {materiais.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum material adicionado</h3>
              <p className="text-sm text-gray-500">Use a busca acima para adicionar materiais ao orçamento</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quantity Dialog */}
      <AnimatePresence>
        {isDialogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDialogOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Modal Container - using flexbox for proper centering */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto max-h-[90vh] overflow-y-auto"
              >
              <button
                onClick={() => setIsDialogOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-indigo-600" />
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {currentItem?.isEditing ? 'Editar Quantidade' : 'Adicionar Material'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {currentItem?.material?.descricao || currentItem?.descricao || "Material"}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Ex: 10"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-center text-lg font-medium"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-medium border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <motion.button
                  onClick={handleConfirmAction}
                  disabled={isPending || Number(quantity) < 1}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                    ${isPending || Number(quantity) < 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }
                  `}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      {currentItem?.isEditing ? 'Atualizar' : 'Adicionar'}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog />
    </>
  );
}