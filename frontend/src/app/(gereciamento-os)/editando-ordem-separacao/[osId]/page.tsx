// src/app/(gereciamento-os)/editando-ordem-separacao/[osId]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from 'sonner';
import { Flex,  Callout, Box, Button } from '@radix-ui/themes';
import { ServerCrash, Send, CheckCircle2 } from 'lucide-react';
import { useCallback } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

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
    const registeredItemsText = registeredItems.map(item => ` ID.${item.material.id} --- ${item.material.descricao.slice(0,20)} --- ${item.quantidade} ${item.material.unidade || 'UN'} --- Local:${item.material.localizacao}`).join('\n');
    const nonRegisteredItemsText = nonRegisteredItems.map(item => `${item.descricaoNaoCadastrado}`).join('\n') --- ${item.quantidade}${item.unidade} ;
    
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
                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <Button size="3" color="violet" radius="full" className="shadow-lg" disabled={isSolicitingBaixa}>
                      {isSolicitingBaixa ? <Spinner size="sm" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                      {isSolicitingBaixa ? "Solicitando Baixa..." : "Solicitar Baixa da OS"}
                    </Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Portal>
                    <AlertDialog.Overlay className="bg-black/50 fixed inset-0 data-[state=open]:animate-overlayShow" />
                    <AlertDialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl focus:outline-none data-[state=open]:animate-contentShow">
                      <AlertDialog.Title className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Confirmar Baixa da OS
                      </AlertDialog.Title>
                      <AlertDialog.Description className="text-gray-600 dark:text-gray-300 mt-2">
                        Você está prestes a solicitar a baixa desta Ordem de Separação. Deseja continuar?
                      </AlertDialog.Description>
                      <div className="flex justify-end gap-4 mt-6">
                        <AlertDialog.Cancel asChild>
                          <button className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                            Cancelar
                          </button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                          <button onClick={() => solicitarBaixa()} className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">
                            Sim, Solicitar Baixa
                          </button>
                        </AlertDialog.Action>
                      </div>
                    </AlertDialog.Content>
                  </AlertDialog.Portal>
                </AlertDialog.Root>
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
