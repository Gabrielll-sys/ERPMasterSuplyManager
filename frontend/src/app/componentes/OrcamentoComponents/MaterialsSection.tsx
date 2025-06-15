"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Componentes de UI
import { Card, Flex, Text, Button, Dialog, TextField } from '@radix-ui/themes';
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Search } from 'lucide-react';

// Componentes e Serviços
import { MaterialsTable } from './MaterialsTable';
import { searchByDescription } from '@/app/services/Material.Services';
import { createItemOrcamento, updateItemOrcamento, deleteItemOrcamento } from '@/app/services/ItensOrcamento.Service';
import { IInventario } from '@/app/interfaces/IInventarios';

// Props do componente
type MaterialsSectionProps = {
  orcamentoId: number;
  isPaid?: boolean;
  materiais: any[];
};

export function MaterialsSection({ orcamentoId, isPaid, materiais }: MaterialsSectionProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Estados locais da UI
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IInventario[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any | null>(null);
  const [quantity, setQuantity] = useState("1");

  // Lógica de busca
  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.length > 2) {
      const results = await searchByDescription(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Funções de callback para as mutações
  const onMutationSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ['materiaisOrcamento', orcamentoId] });
    setIsDialogOpen(false);
  };

  const onMutationError = (error: any, defaultMessage: string) => {
    console.error(defaultMessage, error);
    toast.error(`${defaultMessage}: ${error.response?.data?.message || error.message}`);
  };

  // Definição das Mutações
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

  // Handlers para disparar as ações
  const handleConfirmAction = () => {
    if (!currentItem) return;

    if (currentItem.isEditing) {
      // Chama a mutação de ATUALIZAÇÃO com o payload corrigido
      updateItemMutation.mutate({
        item: currentItem,
        novaQuantidade: Number(quantity),
      });
    } else {
      // Chama a mutação de CRIAÇÃO
      addItemMutation.mutate({
        orcamentoId,
        materialId: currentItem.materialId,
        quantidadeMaterial: Number(quantity),
        responsavelAdicao: session?.user?.name || "Sistema"
      });
    }
  };

  const handleDeleteItem = (itemId: number) => {
    if (window.confirm("Tem certeza que deseja remover este item do orçamento?")) {
      deleteItemMutation.mutate(itemId);
    }
  };

  // Funções para abrir os modais
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

  return (
    <Card size="4">
      <Flex direction="column" gap="4">
        <Text as="div" size="6" weight="bold">Materiais do Orçamento</Text>
        
        {!isPaid && (
          <Autocomplete
            label="Buscar material"
            placeholder="Digite para pesquisar..."
            startContent={<Search size={18} className="text-gray-400" />}
            value={searchTerm}
            onInputChange={handleSearch}
            items={searchResults}
            size="lg"
          >
            {(item: IInventario) => (
              <AutocompleteItem 
                key={item.id} 
                onPress={() => openAddDialog(item)}
              >
                {item.material?.descricao}
              </AutocompleteItem>
            )}
          </Autocomplete>
        )}

        <MaterialsTable 
          materiais={materiais}
          isPaid={isPaid}
          onEdit={openEditDialog}
          onDelete={handleDeleteItem}
          orcamentoId={orcamentoId} // Passamos o orcamentoId para a tabela
        />
      </Flex>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>{currentItem?.isEditing ? 'Editar Quantidade' : 'Adicionar Material'}</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {currentItem?.material?.descricao || "Carregando..."}
          </Dialog.Description>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Quantidade
              </Text>
              <TextField.Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Ex: 10"
                min="1"
              />
            </label>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancelar</Button>
            </Dialog.Close>
            <Button 
                onClick={handleConfirmAction} 
                disabled={addItemMutation.isLoading || updateItemMutation.isLoading}
            >
                {(addItemMutation.isLoading || updateItemMutation.isLoading) ? 'Salvando...' : (currentItem?.isEditing ? 'Atualizar' : 'Adicionar')}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Card>
  );
}