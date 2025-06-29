// src/app/componentes/RadixSidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Radix UI Themes e Icons
import { Box, Flex, Text, Heading, Button, Separator, ScrollArea, IconButton } from '@radix-ui/themes';
import {
  CaretDownIcon,
  CaretRightIcon,
  Pencil1Icon,       // Exemplo para Criar Material
  ReaderIcon,        // Exemplo para Relatórios
  ArchiveIcon,       // Exemplo para Inventário
  PieChartIcon,      // Exemplo para Orçamentos/Vendas
  ContainerIcon,     // Exemplo para Gestão OS
  CodeIcon,        // Exemplo para Gerador QR
  ListBulletIcon,    // Exemplo para Registro de Ações
  MixerHorizontalIcon, // Exemplo para Utilitários
  LightningBoltIcon, // Exemplo para Corrente Motor
  Cross1Icon         // Para fechar
} from '@radix-ui/react-icons';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

// Serviços (se necessário para alguma lógica dinâmica)
// import { createRelatorioDiario } from "../services/RelatorioDiario.Services";

interface RadixSidebarProps {
  show: boolean;
  setShowSideBar: (show: boolean) => void;
}

interface UserInfo {
    role?: string;
    // outras propriedades do usuário
}

const RadixSidebar: React.FC<RadixSidebarProps> = ({ show, setShowSideBar }) => {
  const route = useRouter();
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [openCollapse, setOpenCollapse] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      try {
        setCurrentUser(JSON.parse(userString));
      } catch (error) {
        console.error("Erro ao parsear usuário do localStorage:", error);
      }
    }
  }, []);

  const conditionsRoles = currentUser?.role === "Administrador" || currentUser?.role === "Diretor" || currentUser?.role === "SuporteTecnico";

  const handleNavigation = (path: string) => {
    route.push(path);
    setShowSideBar(false); // Fecha a sidebar ao navegar
  };

  const toggleCollapse = (key: string) => {
    setOpenCollapse(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Variantes para animação do Framer Motion
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  const overlayVariants = {
      open: { opacity: 1, pointerEvents: "auto" as const },
      closed: { opacity: 0, pointerEvents: "none" as const },
  };


  // Função para criar item de menu
  const MenuItem = ({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) => (
      <Button
        variant="ghost" // Ou 'soft'
        color="gray"
        highContrast
        onClick={() => handleNavigation(href)}
        className="w-full justify-start text-left px-3 py-5 text-base hover:bg-accent-3" // Aumentei o padding e tamanho texto
        size="3"
       >
        <Icon className="mr-3 h-5 w-5" /> {children}
      </Button>
  );

  // Função para criar item de menu colapsável
   const CollapseItem = ({ label, icon: Icon, children, collapseKey }: { label: string; icon: React.ElementType; children: React.ReactNode; collapseKey: string }) => (
    <>
        <Button
           variant="ghost"
           color="gray"
           highContrast
           onClick={() => toggleCollapse(collapseKey)}
           className="w-full justify-between text-left px-3 py-5 text-base hover:bg-accent-3"
           size="3"
        >
           <Flex align="center" gap="3">
             <Icon className="h-5 w-5" /> {label}
           </Flex>
           {openCollapse[collapseKey] ? <CaretDownIcon /> : <CaretRightIcon />}
        </Button>
        <AnimatePresence>
         {openCollapse[collapseKey] && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="pl-6 flex flex-col gap-1 overflow-hidden" // Adicionado overflow-hidden
             >
                {children}
            </motion.div>
         )}
        </AnimatePresence>
    </>
);

  return (
      <AnimatePresence>
         {show && (
            <>
             {/* Overlay */}
             <motion.div
                 key="overlay"
                 variants={overlayVariants}
                 initial="closed"
                 animate="open"
                 exit="closed"
                 transition={{ duration: 1 }}
                 onClick={() => setShowSideBar(false)}
                 className="fixed inset-0 bg-black/50 z-40" // z-index menor que a sidebar
             />

             {/* Sidebar */}
             <motion.div
                 key="sidebar"
                 variants={sidebarVariants}
                 initial="closed"
                 animate="open"
                 exit="closed"
                 transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                 className="fixed top-0 left-0 h-full w-72 bg-gray-100 dark:bg-gray-900 shadow-lg z-50 border-r border-gray-200 dark:border-gray-700" // z-index maior
             >
                 <ScrollArea type="auto" scrollbars="vertical" style={{ height: '100%' }}>
                     <Flex direction="column" gap="2" p="4">
                         {/* Cabeçalho com Logo e Botão Fechar */}
                         <Flex justify="between" align="center" mb="4">
                           <Box onClick={() => handleNavigation('/')} className="cursor-pointer">
                             <Image
                                 className="hover:opacity-80"
                                 src={require('../assets/logo preta.jpg')} // Use seu logo
                                 alt="Logo Master"
                                 width={130}
                                 height={50} // Ajuste altura
                                 style={{ height: 'auto' }} // Mantem proporção
                             />
                           </Box>
                             <IconButton variant="ghost" color="gray" onClick={() => setShowSideBar(false)} aria-label="Fechar Sidebar">
                                 <Cross1Icon height="20" width="20" />
                             </IconButton>
                         </Flex>

                         <Separator my="2" size="4" />

                          {conditionsRoles && (
                          <MenuItem href="/criar-material" icon={Pencil1Icon}>
                           Criar Material
                         </MenuItem>
                         )}
             
                
                         <MenuItem href="/relatorios" icon={ReaderIcon}>
                           Relatórios
                         </MenuItem>

                         {conditionsRoles && (
                             <>
                                 <MenuItem href="/busca-inventario" icon={ArchiveIcon}>
                                     Gestão de Inventário
                                 </MenuItem>

                                 <CollapseItem label="Orçamentos/Vendas" icon={PieChartIcon} collapseKey="orcamentos">
                                     <MenuItem href="/orcamento-e-venda/criar-orcamento" icon={PlusCircleIcon}> {/* Reutilizando ícone */}
                                         Criar Orçamento
                                     </MenuItem>
                                     <MenuItem href="/orcamento-e-venda/gerenciar-orcamentos" icon={ListBulletIcon}> {/* Reutilizando ícone */}
                                         Orçamentos
                                     </MenuItem>
                                 </CollapseItem>

                                 <MenuItem href="/gerenciamento-ordem-separacao" icon={ContainerIcon}>
                                    Ordem De Separação
                                 </MenuItem>
                             </>
                         )}

                         <MenuItem href="/gerar-qrcode-material" icon={CodeIcon}>
                           Gerador De QrCode
                         </MenuItem>

                         {conditionsRoles && (
                             <>
                                 <MenuItem href="/registro-log" icon={ListBulletIcon}>
                                     Registro de Ações
                                 </MenuItem>

                                 <CollapseItem label="Utilitários" icon={MixerHorizontalIcon} collapseKey="utilitarios">
                                      <MenuItem href="/corrente-motor-weg" icon={LightningBoltIcon}>
                                          Corrente Motor WEG
                                      </MenuItem>
                                      {/* Adicione outros utilitários aqui */}
                                 </CollapseItem>
                             </>
                         )}
                     </Flex>
                 </ScrollArea>
             </motion.div>
            </>
         )}
      </AnimatePresence>
  );
};

export default RadixSidebar;