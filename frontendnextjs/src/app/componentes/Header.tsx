"use client"
import React, { useState,useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useReactToPrint } from 'react-to-print';
import Link from "next/link";
import Image from "next/image";
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

import IconQrCode from '@/app/assets/icons/IconQrCode';

import { useRouter } from "next/navigation";
import IconExit from "../assets/icons/IconExit";
import AvatarLogin from "./AvatarLogin";
import IconUser from "../assets/icons/IconUser";

const Header= ()=>{
    const { data: session } = useSession();
    const route = useRouter()
    const [isClicked, setIsClicked] = useState(false);
    const iconClasses = "h-4 text-2xl";
    const emails:string[] = ["gabrielpuneco@gmail.com"]
    const handleClick = () => {
      setIsClicked(!isClicked);
  
      route.push("/");
    };
  

return(
  <>


    <header  className=" h-24 bg-master_black">

<div className="ml-1  flex flex-row justify-between ">
    <Link href="/create-material">
    <Image  className="py-5 hover:scale-90" src={require('../assets/logo.png')} width={132} height={123} alt="logo master" />
    </Link>




{session && session.user ? (
  
 
  <Dropdown className="p-0 rounded-md shadow-none">
  <DropdownTrigger>
   
     <Image
        

  width={65}
  height={22}
  alt="Foto do Produto"
  className="rounded-full h-16 mr-6 mt-2 hover:scale-110  ring-1 ring-master_yellow"
  src={session.user.image ?? ""}
/>   
  </DropdownTrigger>
  <DropdownMenu
    aria-label="Profile Actions"
    variant="bordered"
    className="bg-light mt-2 border-2 border-black  "
    color="success"
    disabledKeys={[""]}
  >
    <DropdownItem
      key="profile"
      className="text-start"
      color="default"
      endContent={<IconUser className = {iconClasses} />}

    >
      <p className="font-semibold text-base p-5">
        {session.user.name}
      </p>
    </DropdownItem>

    <DropdownItem
      key="QrCodeMaterial"
      
      className="text-start"
      color="default"
      endContent={<IconQrCode/>}
      onClick={()=>route.push('/generateMaterialQrcode')}

    >
      <p className="font-semibold text-base p-5">
        Gerador código QR Code
      </p>
    </DropdownItem>
    
    
    <DropdownItem
      key="logout"
      color="danger"
      endContent={<IconExit className = {iconClasses} />}
      onClick={() => signOut()}
    >
      <p className="text-base p-1 hover:underline">Sair</p>
    </DropdownItem>
  </DropdownMenu>
</Dropdown>

)

:

(
<Link className="mr-11 text-lg text-white rounded-md hover:scale-x-110 hover:underline my-auto" href="" onClick={() => signIn("google")}>
                Entrar
              </Link>)
}
</div>

                </header>

                </>
)


}
export default Header;
