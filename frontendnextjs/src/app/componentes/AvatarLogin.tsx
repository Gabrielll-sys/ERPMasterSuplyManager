"use client";
import React from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar,
    Button,
    NavbarItem,
  } from "@nextui-org/react";

import { signOut, useSession } from "next-auth/react";
import IconExit from "../assets/icons/IconExit";



export default function AvatarLogin({ children, ...props }: any) {
    const route = useRouter();
    const { data: session } = useSession();
    const iconClasses = "h-4";
    return (
        <Dropdown className="p-0 rounded-md shadow-none">
        <DropdownTrigger>
          <Avatar
            as="button"
            className=" mr-7"
            name={session.user.name ?? ""}
            src={session.user.image ?? ""}
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          variant="bordered"
          className="bg-light"
          color="success"
          disabledKeys={[""]}
        >
          <DropdownItem
            key="profile"
            className="text-end"
            color="default"
          >
            <p className="font-semibold text-tiny">
              {session.user.name}
            </p>
          </DropdownItem>
          
          
          <DropdownItem
            key="logout"
            color="danger"
            endContent={<IconExit className = {iconClasses} />}
            onClick={() => signOut()}
          >
            <p className="text-tiny p-1">Sair</p>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>



 
    );
  }