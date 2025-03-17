"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Navbar
} from "@nextui-org/react";
import IconPersonFill from "../assets/icons/IconPersonFill";
import { authenticate, getUserLocalStorage } from "../services/Auth.services";
import { isTokenValid } from "../services/Auth.services";
import { useRouter } from "next/navigation";
import IconExit from "../assets/icons/IconExit";
import IconSideBar from "../assets/icons/IconSideBar";
import SideBarLFT from "./SideBarLFT";
import { useAuth } from "@/contexts/AuthContext";

const NavBar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const route = useRouter();
    const iconClasses = "h-4 text-2xl";
    const [showSideBar, setShowSideBar] = useState(false);

    return (
        <>
            <Navbar className="bg-master_black" maxWidth="full">
                <div className="flex justify-between w-full">
                    <div className="flex gap-4">
                        <Button
                            isIconOnly
                            className="bg-transparent"
                            onPress={() => setShowSideBar(!showSideBar)}
                        >
                            <IconSideBar />
                        </Button>
                    </div>

                    {isAuthenticated && user ? (
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    className="capitalize bg-transparent text-white"
                                >
                                    {user.userName}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Dropdown Variants"
                                color="default"
                                variant="solid"
                            >
                                <DropdownItem
                                    key="my-account"
                                    color="danger"
                                    variant="bordered"
                                    className="bg-light mt-2"
                                    endContent={<IconPersonFill className={iconClasses} />}
                                    onClick={() => route.push("/my-tasks")}
                                >
                                    <p className="text-base p-1 hover:underline">
                                        Minhas Tarefas Diárias
                                    </p>
                                </DropdownItem>

                                <DropdownItem
                                    key="logout"
                                    color="danger"
                                    endContent={<IconExit className={iconClasses} />}
                                    onClick={logout}
                                >
                                    <p className="text-base p-1 hover:underline">Sair</p>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <Link
                            className="mr-11 max-sm:mr-6 max-sm:text-base text-lg text-white rounded-md hover:scale-x-110 hover:underline my-auto"
                            href="/login"
                        >
                            Entrar
                        </Link>
                    )}
                </div>
            </Navbar>

            {showSideBar && <SideBarLFT setShowSideBar={setShowSideBar} />}
        </>
    );
};

export default NavBar;