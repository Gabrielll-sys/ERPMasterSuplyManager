// src/app/componentes/NavBar.tsx (renomeado para ModernNavBar no exemplo anterior)
"use client";

import Link from "next/link";
import { useState, useEffect } from "react"; // useEffect não é mais necessário aqui para user
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import {
    Navbar, NavbarBrand, NavbarContent, NavbarItem, Button,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar
} from "@nextui-org/react";
import Image from "next/image";

// Ícones
import IconPersonFill from "../assets/icons/IconPersonFill";
import IconExit from "../assets/icons/IconExit";
import IconSideBar from "../assets/icons/IconSideBar";
import TaskIcon from "../assets/icons/TaskIcon"; // Certifique-se que este ícone existe

// Importa o NOVO Sidebar
import RadixSidebar from "./RadixSidebar"; // Ajuste o caminho se necessário

const ModernNavBar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const route = useRouter();
    const [showSideBar, setShowSideBar] = useState(false); // Estado para controlar a visibilidade

    const iconClasses = "text-xl";

    const handleLogout = () => {
        logout();
    };

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
                            className="text-white hover:bg-white/10"
                            onPress={() => setShowSideBar(true)} // Define como true para mostrar
                            aria-label="Toggle Sidebar"
                        >
                            <IconSideBar height="1.5em" width="1.5em" />
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
                                <DropdownItem key="tasks" startContent={<TaskIcon className={iconClasses} />} onClick={() => route.push('/my-tasks')} textValue="Minhas Tarefas">
                                    Minhas Tarefas
                                </DropdownItem>
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
