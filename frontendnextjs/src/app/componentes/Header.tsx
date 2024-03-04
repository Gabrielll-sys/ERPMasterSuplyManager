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

import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable,HiFilter, HiPencilAlt,HiQrcode } from 'react-icons/hi';
import IconQrCode from '@/app/assets/icons/IconQrCode';

import { useRouter } from "next/navigation";
import IconExit from "../assets/icons/IconExit";
import AvatarLogin from "./AvatarLogin";
import IconUser from "../assets/icons/IconUser";
import TodoListPen from "../assets/icons/TodoListPen";
import IconFilter from "../assets/icons/IconFilter";
import IconMoneyBill from "../assets/icons/IconMoneyBill";
import IconSideBar from "../assets/icons/IconSideBar";

const Header= ()=>{
    const { data: session } = useSession();
    const route = useRouter()
    const [isClicked, setIsClicked] = useState(false);
    const iconClasses = "h-4 text-2xl";
    const emails:string[] = ["gabrielpuneco@gmail.com"]
    const [showSideBar,setShowSideBar]= useState(false)
  
  
const handleSideBar= ()=>{

if(showSideBar){
  setShowSideBar(false)
}
  
else setShowSideBar(true)

}
return(
  <>


    <header  className=" h-24 bg-master_black  font-bold">

<div className="ml-1  flex flex-row justify-between ">

  <Button  onMouseEnter={x=>setShowSideBar(true)} className="bg-master_black mt-6" >
    <IconSideBar  className=" rounded-lg h-10 text-white"  />
  </Button>
{showSideBar && (
  <Sidebar  onMouseLeave={x=>setShowSideBar(false)} className="bg-master_black  h-svh absolute z-10 ml-[-5px] " aria-label="Sidebar with multi-level dropdown example ">
        <Sidebar.ItemGroup>
   
    <Button className="bg-master_black h-20" onPress={handleSideBar}>

    <Image  className="py-5 hover:scale-30 max-sm:mt-1 max-sm:w-[100px] max-sm:h-[80px] w-[130px] h-[100px]" src={require('../assets/logo.png')}  alt="logo master" />
    </Button>
    </Sidebar.ItemGroup>


      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item  href="/create-material" className="text-white hover:font-bold" icon={HiChartPie}>
            Criar Material
          </Sidebar.Item>
       
          <Sidebar.Item className="text-white mt-7 hover:font-bold" href="/search-inventory" icon={HiInbox}>
            Gerenciar Inventário
          </Sidebar.Item>
          <Sidebar.Collapse className="text-white mt-7"label=" Orçamentos/Vendas" icon={HiPencilAlt}>

          <Sidebar.Item className="text-white mt-3 hover:font-bold" href="/create-budge" >
              Criar Orçamento
          </Sidebar.Item>
          <Sidebar.Item className="text-white mt-3 hover:font-bold" href="/manage-budges" >
              Orçamentos
          </Sidebar.Item>
          </Sidebar.Collapse>

          <Sidebar.Item className="text-white mt-7 hover:font-bold" href="/managing-os" icon={HiShoppingBag}>
            Gerencia de OS
          </Sidebar.Item>
          <Sidebar.Item className="text-white mt-7 hover:font-bold" href="/generateMaterialQrcode" icon={HiQrcode}>
            Gerador De QrCode
          </Sidebar.Item>
          <Sidebar.Item className="text-white mt-7 hover:font-bold" href="/materials-relatory" icon={HiFilter}>
           Filtragem de Materiais
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
)}


  


{session && session.user ? (
  
 
  <Dropdown className="p-0 rounded-md shadow-none border-2 border-black">
  <DropdownTrigger>
   
     <Image
  width={65}
  height={22}
  alt="Foto do Produto"
  className="rounded-full h-16 mr-6 mt-2 hover:scale-110  ring-2 ring-gray-400"
  src={session.user.image ?? ""}
/>   
  </DropdownTrigger>
  <DropdownMenu
    aria-label="Profile Actions"
    variant="bordered"
    className="bg-light mt-2   "
    color="success"
    disabledKeys={[""]}
  >
    <DropdownItem
      key="profile"
      className="text-start pointer-events-none"
      color="default"
      endContent={<IconUser className = {iconClasses} />}

    >
      <p className="font-semibold text-base p-5">
        {session.user.name}
      </p>
    </DropdownItem>

    {/* <DropdownItem
      key="ManagingOs"
      
      className="text-start hover:underline"
      color="default"
      endContent={<TodoListPen/>}
      onClick={()=>route.push('/managing-os')}

    >
      <p className="font-semibold text-base p-5">
       Gerenciamento de OS
      </p>
    </DropdownItem>
    <DropdownItem
      key="MaterialsRelatory"
      
      className="text-start hover:underline"
      color="default"
      endContent={<IconFilter/>}
      onClick={()=>route.push('/materials-relatory')}

    >
      <p className="font-semibold text-base p-5">
       Filtragem de Materiais
      </p>
    </DropdownItem>
    <DropdownItem
      key="MaterialsRelatory"
      
      className="text-start hover:underline"
      color="default"
      endContent={<IconMoneyBill/>}
      onClick={()=>route.push('/budge-management')}

    >
      <p className="font-semibold text-base p-5">
      Gerenciador de Orçamentos
      </p>
    </DropdownItem>
    
    <DropdownItem
      key="QrCodeMaterial"
      
      className="text-start hover:underline"
      color="default"
      endContent={<IconQrCode/>}
      onClick={()=>route.push('/generateMaterialQrcode')}

    >
      <p className="font-semibold text-base p-5">
        Gerador código QR Code
      </p>
    </DropdownItem>
     */}
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
<Link className="mr-11 max-sm:mr-6 max-sm:text-base text-lg text-white rounded-md hover:scale-x-110 hover:underline my-auto" href="" onClick={() => signIn("google")}>
                Entrar
              </Link>)
}
</div>

                </header>

                </>
)


}
export default Header;