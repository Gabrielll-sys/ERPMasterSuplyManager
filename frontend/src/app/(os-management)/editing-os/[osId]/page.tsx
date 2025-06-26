// src/app/(os-management)/editing-os/[osId]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from 'sonner';
import { Flex,  Callout, Box, Button } from '@radix-ui/themes';
import { ServerCrash, Send, CheckCircle2 } from 'lucide-react';
import { useCallback } from 'react';

// --- Nossos novos hooks e componentes ---
import { useOsDetails } from "@/app/hooks/useOsDetails";
import { OsHeader } from '@/app/componentes/OrdemSeparacaoComponents/OsHeader'; // Supondo que você criou este
import { OsDetailsForm } from '@/app/componentes/OrdemSeparacaoComponents/OsDetailsForm'; // E este
import { MaterialList } from "@/app/componentes/OrdemSeparacaoComponents/MaterialList";
import { MaterialSearchAndAdd } from "@/app/componentes/OrdemSeparacaoComponents/MaterialSearchAndAdd";
import { Spinner } from "@nextui-org/react";


export default function EditingOsPage({ params }: { params: { osId: string } }) {
  const router = useRouter();
  const osId = parseInt(params.osId, 10);


  const {
    os,
    isLoadingOs,
    isOsError,
    registeredItems,
    nonRegisteredItems,
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    addItemToOs,
    isAddingItem,
    deleteItemFromOs,
    updateDetails,
 isUpdatingDetails,
 solicitarBaixa,
 isSolicitingBaixa,
  } = useOsDetails(osId);

  // 🎓 CONCEITO: useCallback para memorizar funções.
  // 🤔 PORQUÊ: Garante que a função não seja recriada a cada render, otimizando performance
  // quando passada como prop para componentes filhos, especialmente os que usam React.memo.
  const handleGenerateWhatsAppMessage = useCallback(() => {
    if (!os) return;
    const registeredItemsText = registeredItems.map(item => `- ${item.quantidade} ${item.material.unidade || 'UN'} de ${item.material.descricao} na ${item.material.localizacao}`).join('\n');
    const nonRegisteredItemsText = nonRegisteredItems.map(item => `- ${item.quantidade} UN de ${item.descricaoNaoCadastrado}`).join('\n');
    
    let message = `*Lista de Materiais para Ordem De Separação: ${os.id} da ${os.descricao}*\n\n`;
    if (registeredItemsText) message += "*Materiais Cadastrados:*\n" + registeredItemsText + '\n\n';
    if (nonRegisteredItemsText) message += "*Materiais Não Cadastrados:*\n" + nonRegisteredItemsText;

    
    window.open(`https://api.whatsapp.com/send?phone=553195077302&text=${encodeURIComponent(message)}`, '_blank');
  }, [registeredItems, nonRegisteredItems, os]);


  if (isLoadingOs) return <Flex justify="center" align="center" className="h-screen"><Spinner label="Carregando OS..." size="lg" /></Flex>;
  if (isOsError || !os) return <Flex justify="center" align="center" className="h-screen p-8"><Callout.Root color="red" size="2"><Callout.Icon><ServerCrash /></Callout.Icon><Callout.Text>Erro ao carregar dados da Ordem de Serviço.</Callout.Text></Callout.Root></Flex>;

  const canEdit = !os.isAuthorized;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <Toaster richColors position="top-right" />
      <Box className="max-w-7xl mx-auto">
        
        {/* Componentes de UI recebendo dados e funções como props */}
        <OsHeader os={os} onBack={() => router.back()} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-5 space-y-6">
            <OsDetailsForm 
              os={os}
              onSave={updateDetails}
              isSaving={isUpdatingDetails}
              disabled={!canEdit}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-7 space-y-6">
            {canEdit && (
              <MaterialSearchAndAdd
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                searchResults={searchResults}
                isSearching={isSearching}
                onAddMaterial={(data) => addItemToOs(data)}
                onAddNonRegistered={(data) => addItemToOs(data)}
                isAdding={isAddingItem}
              />
            )}
            <MaterialList
              title="Materiais Cadastrados"
              items={registeredItems}
              canDelete={canEdit}
              onDeleteItem={deleteItemFromOs}
            />
            <MaterialList
              title="Materiais Não Cadastrados"
              items={nonRegisteredItems}
              canDelete={canEdit}
              onDeleteItem={deleteItemFromOs}
            />
          </motion.div>
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-center md:mx-auto justify-end gap-4 mt-8">
          <AnimatePresence>
            {os &&   (registeredItems.length > 0 || nonRegisteredItems.length > 0)  && (
              <motion.div initial={{ scale: 0.8, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.8, y: 50, opacity: 0 }}>
                <Button size="3" color="violet" radius="full" className="shadow-lg" onClick={() => solicitarBaixa()} disabled={isSolicitingBaixa}>
                  {isSolicitingBaixa ? <Spinner size="sm" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                  {isSolicitingBaixa ? "Solicitando Baixa..." : "Solicitar Baixa da OS"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(registeredItems.length > 0 || nonRegisteredItems.length > 0) && (
              <motion.div initial={{ scale: 0.8, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.8, y: 50, opacity: 0 }}>
                <Button size="3" color="green" radius="full" className="shadow-lg" onClick={handleGenerateWhatsAppMessage}>
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Lista via WhatsApp
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Box>
    </motion.div>
  );
}