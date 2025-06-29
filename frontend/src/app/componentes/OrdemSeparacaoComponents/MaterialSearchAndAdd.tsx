// src/app/(os-management)/editing-os/[osId]/components/MaterialSearchAndAdd.tsx
"use client";

import { useState } from 'react';
import { Flex, TextField, Button, Box, Text, Card, ScrollArea, Select } from '@radix-ui/themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, PackagePlus } from 'lucide-react';
import { IInventario } from '@/app/interfaces';
import { Spinner } from '@nextui-org/react';

// 🎓 CONCEITO: Componente Controlado vs. Não Controlado.
// 🤔 PORQUÊ: Este componente é "controlado" pela página pai através de props.
// Ele não busca dados, apenas exibe o que recebe e notifica o pai sobre as ações do usuário.
interface MaterialSearchAndAddProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  searchResults: IInventario[];
  isSearching: boolean;
  onAddMaterial: (data: { materialId: number; quantidade: number }) => void;
  onAddNonRegistered: (data: { descricaoNaoCadastrado: string; quantidade: number; unidade: string }) => void;
  isAdding: boolean;
}

export function MaterialSearchAndAdd({
  searchTerm,
  onSearchTermChange,
  searchResults,
  isSearching,
  onAddMaterial,
  onAddNonRegistered,
  isAdding,
}: MaterialSearchAndAddProps) {
  // --- Estado local para o item selecionado e o formulário de adição ---
  const [selectedMaterial, setSelectedMaterial] = useState<IInventario | null>(null);
  const [quantity, setQuantity] = useState<number | "">(1);
  const [nonRegisteredDesc, setNonRegisteredDesc] = useState('');
  const [unidade, setUnidade] = useState("UN");

  // 🎓 CONCEITO: Fluxo de UX Não-Bloqueante.
  // 🤔 PORQUÊ: Em vez de um `prompt()`, integramos o formulário de quantidade na UI.
  // O usuário seleciona um item, e o formulário aparece, sem interromper o fluxo.
  const handleSelectMaterial = (material: IInventario) => {
    setSelectedMaterial(material);
    onSearchTermChange(''); // Limpa a busca para fechar o popover de resultados
  };

  const handleAddClick = () => {
    if (selectedMaterial && Number(quantity) > 0) {
      onAddMaterial({ materialId: Number(selectedMaterial.material.id), quantidade: Number(quantity) });
      setSelectedMaterial(null);
      setQuantity(1);
    }
  };
  
  const handleAddNonRegisteredClick = () => {
    if (nonRegisteredDesc.trim() && Number(quantity) > 0) {
        onAddNonRegistered({ descricaoNaoCadastrado: nonRegisteredDesc.trim(), quantidade: Number(quantity), unidade: unidade });
        setNonRegisteredDesc('');
        setQuantity(1);
    }
  }

  return (
    <Card>
      <Flex direction="column" p="4" gap="4">
        {/* --- SEÇÃO DE BUSCA DE MATERIAL CADASTRADO --- */}
        <Text weight="bold" size="4">Adicionar Material Cadastrado</Text>
        <Box position="relative">
          <TextField.Root>
            <TextField.Slot><Search size={16} /></TextField.Slot>
            <TextField.Input
              placeholder="Busque por descrição..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
          </TextField.Root>
          <AnimatePresence>
            {searchTerm.length > 2 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '4px' }}
              >
                <Card>
                  <ScrollArea style={{ maxHeight: 200 }}>
                    {isSearching && <Flex justify="center" p="4"><Spinner /></Flex>}
                    {!isSearching && searchResults.length === 0 && <Text as="div"  color="gray">Nenhum resultado.</Text>}
                    {searchResults.map((item) => (
                      <Box key={item.material.id} onClick={() => handleSelectMaterial(item)} className="p-2 hover:bg-gray-100 cursor-pointer rounded">
                        <Text>{item.material.descricao}</Text>
                      </Box>
                    ))}
                  </ScrollArea>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* --- FORMULÁRIO DE ADIÇÃO (APARECE APÓS SELECIONAR) --- */}
        <AnimatePresence>
          {selectedMaterial && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Flex gap="3" align="end" mt="3">
                <Box className="flex-grow">
                  <Text size="2" color="gray">Item Selecionado</Text>
                  <Text as="p" weight="bold">{selectedMaterial.material.descricao}</Text>
                </Box>
                <TextField.Root className="w-24 max-sm:w-full">
                  <TextField.Slot>Qtd:</TextField.Slot>
                  <TextField.Input
                    inputMode="numeric" 
                    pattern="[0-9]*"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                  />
                </TextField.Root>
                <Button onClick={handleAddClick} disabled={isAdding}>
                  <Plus size={16} /> {isAdding ? 'Adicionando...' : 'Adicionar'}
                </Button>
              </Flex>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SEÇÃO DE ADIÇÃO DE MATERIAL NÃO CADASTRADO --- */}
        <Text weight="bold" size="4" mt="4">Adicionar Item Não Cadastrado</Text>
        <Flex direction={{ initial: 'column', sm: 'row' }} gap="3" align="end">
            <TextField.Root className="flex-grow">
                <TextField.Slot><PackagePlus className="text-slate-400" /></TextField.Slot>
                <TextField.Input placeholder="Descrição do novo item" value={nonRegisteredDesc} onChange={(e) => setNonRegisteredDesc(e.target.value)} />
            </TextField.Root>
            <TextField.Root className="w-full sm:w-24">
                <TextField.Input type="number" placeholder="Qtd." value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" />
            </TextField.Root>
            <Select.Root value={unidade} onValueChange={setUnidade}>
              <Select.Trigger placeholder="Unidade" />
              <Select.Content>
                <Select.Item value="UN">UN</Select.Item>
                <Select.Item value="M">M</Select.Item>
                <Select.Item value="RL">RL</Select.Item>
                <Select.Item value="PC">PC</Select.Item>
                <Select.Item value="MT">MT</Select.Item>
              </Select.Content>
            </Select.Root>
            <Button onClick={handleAddNonRegisteredClick} disabled={!nonRegisteredDesc.trim() || isAdding}>
                <Plus className="w-4 h-4 mr-1" /> {isAdding ? 'Adicionando...' : 'Adicionar'}
            </Button>
        </Flex>
      </Flex>
    </Card>
  );
}