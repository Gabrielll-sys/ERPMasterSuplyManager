// src/app/componentes/NavBar.tsx (renomeado para ModernNavBar no exemplo anterior)
"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import {
    Navbar, NavbarBrand, NavbarContent, NavbarItem, Button,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar
} from "@nextui-org/react";
import Image from "next/image";

// Lucide Icons (mais modernos e profissionais)
import { Menu, User, LogOut, Users, Settings } from 'lucide-react';

// Ícones personalizados (mantidos para compatibilidade)
import IconPersonFill from "../assets/icons/IconPersonFill";
import IconExit from "../assets/icons/IconExit";
import TaskIcon from "../assets/icons/TaskIcon";
import IconUsers from "../assets/icons/IconUsers";

// Importa o NOVO Sidebar
import RadixSidebar from "./RadixSidebar";

// Roles permitidas para gerenciar usuários
const ADMIN_ROLES = ["Administrador", "Diretor", "SuporteTecnico"];

const ModernNavBar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const route = useRouter();
    const [showSideBar, setShowSideBar] = useState(false); // Estado para controlar a visibilidade

    const iconClasses = "text-xl";

    const handleLogout = () => {
        logout();
    };

    // Verifica se o usuário pode gerenciar outros usuários
    const canManageUsers = useMemo(() => {
        return user && ADMIN_ROLES.includes(user.role);
    }, [user]);

    return (
        <>
            <Navbar
                maxWidth="full"
                className="bg-master_black text-white"
                classNames={{ wrapper: "px-4" }}
            >
                <NavbarContent justify="start">
                    <NavbarItem>
                        <Button
                            isIconOnly
                            variant="light"
                            className="text-white hover:bg-white/10 transition-colors"
                            onPress={() => setShowSideBar(true)}
                            aria-label="Abrir Menu"
                        >
                            <Menu className="w-6 h-6" strokeWidth={2} />
                        </Button>
                    </NavbarItem>
                 
                </NavbarContent>

                <NavbarContent justify="end">
                    {isAuthenticated && user ? (
                        <Dropdown placement="bottom-end">
                           {/* ... Dropdown do usuário igual ao anterior ... */}
                            <DropdownTrigger>
                                <Avatar
                                    isBordered as="button" className="transition-transform text-xl hover:scale-105 "
                                    color="secondary" size="md"

                                    src={user.avatarUrl || ""}
                                    name={user.userName?.charAt(0).toUpperCase() || 'U'}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2" textValue={`Signed in as ${user.userName}`}>
                                    <p className="font-semibold">Logado como</p>
                                    <p className="font-semibold">{user.userName}</p>
                                </DropdownItem>
                                {canManageUsers ? (
                                    <DropdownItem key="admin-users" startContent={<IconUsers className={iconClasses} />} onClick={() => route.push('/admin-users')} textValue="Gerenciar Usuários">
                                        Gerenciar Usuários
                                    </DropdownItem>
                                ) : null}
                                <DropdownItem key="settings" startContent={<IconPersonFill className={iconClasses} />} onClick={() => route.push('/my-account')} textValue="Minha Conta">
                                    Minha Conta
                                </DropdownItem>
                                <DropdownItem key="logout" color="danger" startContent={<IconExit className={iconClasses} />} onClick={handleLogout} textValue="Sair">
                                    Sair
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <NavbarItem>
                            <Button as={Link} color="primary" href="/login" variant="flat" className="bg-master_yellow text-master_black font-bold">
                                Entrar
                            </Button>
                        </NavbarItem>
                    )}
                </NavbarContent>
            </Navbar>

            {/* Renderiza o NOVO Sidebar passando o estado e a função para fechá-lo */}
            <RadixSidebar show={showSideBar} setShowSideBar={setShowSideBar} />
        </>
    );
};

export default ModernNavBar;

