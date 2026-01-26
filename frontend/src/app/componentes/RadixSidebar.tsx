// src/app/componentes/RadixSidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Lucide Icons
import {
  X,
  ChevronDown,
  ChevronRight,
  PackagePlus,
  FileText,
  Boxes,
  Calculator,
  PlusCircle,
  List,
  ClipboardList,
  ClipboardCheck,
  QrCode,
  ScrollText,
  Settings,
  Zap,
  Home,
  LogOut
} from 'lucide-react';

interface RadixSidebarProps {
  show: boolean;
  setShowSideBar: (show: boolean) => void;
}

interface UserInfo {
  role?: string;
  nome?: string;
}

interface MenuItemType {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: MenuItemType[];
  adminOnly?: boolean;
}

const RadixSidebar: React.FC<RadixSidebarProps> = ({ show, setShowSideBar }) => {
  const router = useRouter();
  const pathname = usePathname();
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

  const isAdmin = currentUser?.role === "Administrador" || currentUser?.role === "Diretor" || currentUser?.role === "SuporteTecnico";

  const handleNavigation = (path: string) => {
    router.push(path);
    setShowSideBar(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    router.push("/login");
    setShowSideBar(false);
  };

  const toggleCollapse = (key: string) => {
    setOpenCollapse(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Menu items configuration
  const menuItems: MenuItemType[] = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Criar Material', href: '/create-material', icon: PackagePlus },
    { label: 'Relatórios', href: '/reports', icon: FileText },
    { label: 'Gestão de Inventário', href: '/search-inventory', icon: Boxes, adminOnly: true },
    {
      label: 'Orçamentos',
      icon: Calculator,
      adminOnly: true,
      children: [
        { label: 'Novo Orçamento', href: '/create-budge', icon: PlusCircle },
        { label: 'Gerenciar', href: '/manage-budges', icon: List },
      ]
    },
    { label: 'Ordem de Separação', href: '/managing-os', icon: ClipboardList, adminOnly: true },
    { label: 'Solicitação de Serviço', href: '/managing-requests', icon: ClipboardCheck },
    {
      label: 'APR',
      icon: ClipboardList,
      children: [
        { label: 'Nova APR', href: '/apr/nova', icon: PlusCircle },
        { label: 'Gerenciar APR', href: '/apr', icon: List },
      ]
    },
    {
      label: 'Checklists',
      icon: ClipboardCheck,
      children: [
        { label: 'Montagem e Teste', href: '/checklist-montagem', icon: ClipboardCheck },
        { label: 'Instalação', href: '/checklist-instalacao', icon: ClipboardCheck },
      ]
    },
    { label: 'Gerador QR Code', href: '/generateMaterialQrcode', icon: QrCode },
    { label: 'Registro de Ações', href: '/log-register', icon: ScrollText, adminOnly: true },
    {
      label: 'Utilitários',
      icon: Settings,
      adminOnly: true,
      children: [
        { label: 'Corrente Motor WEG', href: '/current-motor-weg', icon: Zap },
      ]
    },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  const overlayVariants = {
    open: { opacity: 1, pointerEvents: "auto" as const },
    closed: { opacity: 0, pointerEvents: "none" as const },
  };

  const MenuItem = ({ item, depth = 0 }: { item: MenuItemType; depth?: number }) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openCollapse[item.label];
    const isActive = item.href && pathname === item.href;

    if (item.adminOnly && !isAdmin) return null;

    if (hasChildren) {
      return (
        <div>
          <button
            onClick={() => toggleCollapse(item.label)}
            className={`
              w-full flex items-center justify-between px-4 py-3 rounded-xl
              text-gray-700 hover:bg-gray-100 transition-all duration-200
              ${depth > 0 ? 'pl-10' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-2"
              >
                {item.children!.map((child) => (
                  <MenuItem key={child.label} item={child} depth={depth + 1} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <button
        onClick={() => item.href && handleNavigation(item.href)}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
          ${isActive 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
            : 'text-gray-700 hover:bg-gray-100'
          }
          ${depth > 0 ? 'pl-6' : ''}
        `}
      >
        <div className={`
          w-9 h-9 rounded-lg flex items-center justify-center
          ${isActive ? 'bg-white/20' : 'bg-gray-100'}
        `}>
          <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
        </div>
        <span className="font-medium text-sm">{item.label}</span>
        {isActive && (
          <div className="ml-auto w-2 h-2 rounded-full bg-white" />
        )}
      </button>
    );
  };

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
            transition={{ duration: 0.3 }}
            onClick={() => setShowSideBar(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            key="sidebar"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900">
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => handleNavigation('/')} 
                  className="cursor-pointer flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Boxes className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Master ERP</h2>
                    <p className="text-gray-400 text-xs">Sistema de Gestão</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSideBar(false)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* User Info */}
              {currentUser && (
                <div className="mt-4 p-3 bg-white/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {currentUser.nome?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">
                        {currentUser.nome || 'Usuário'}
                      </p>
                      <p className="text-gray-400 text-xs">{currentUser.role || 'Colaborador'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {menuItems.map((item) => (
                <MenuItem key={item.label} item={item} />
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <span className="font-medium text-sm">Sair</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RadixSidebar;
