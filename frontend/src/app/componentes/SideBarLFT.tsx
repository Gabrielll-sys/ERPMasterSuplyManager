import React from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag,HiFilter, HiPencilAlt,HiQrcode,HiPencil } from 'react-icons/hi';
import GoogleIcon from "../assets/icons/GoogleIcon";
import { useRouter } from "next/navigation";
import { Sidebar } from "flowbite-react";
import Image from "next/image";

export default function SideBarLFT(props : any) {
    const route = useRouter()


    return (
  <>
  
 

  <Sidebar   className=" border-1 border-black border-l-1 h-svh z-[16] ml-[-5px] " aria-label="Sidebar with multi-level dropdown example ">
        <Sidebar.ItemGroup>
   
    <Button className="h-25 bg-white " >

    <Image  className="py-5 hover:scale-30 max-sm:mt-1 max-sm:w-[100px] max-sm:h-[80px] w-[130px] h-[105px]" src={require('../assets/logo_preta_sem_fundo.png')}  alt="logo master" />
    </Button>
    </Sidebar.ItemGroup>


      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item  href="/create-material" className="text-black hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" icon={HiPencil}>
            Criar Material
          </Sidebar.Item>
          <Sidebar.Collapse className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out"label=" Relatório Diários" icon={HiPencilAlt}>

            <Sidebar.Item className=" mt-3 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/create-budge" >
              Relatórios
            </Sidebar.Item>
            <Sidebar.Item className=" mt-3 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/manage-budges" >
             Criar Relatórios
            </Sidebar.Item>
            
          </Sidebar.Collapse>


          <Sidebar.Item className="text-black mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/search-inventory" icon={HiInbox}>
            Gestão de Inventário
          </Sidebar.Item>
          <Sidebar.Collapse className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out"label=" Orçamentos/Vendas" icon={HiPencilAlt}>

          <Sidebar.Item className=" mt-3 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/create-budge" >
              Criar Orçamento
          </Sidebar.Item>
          <Sidebar.Item className=" mt-3 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/manage-budges" >
              Orçamentos
          </Sidebar.Item>
          </Sidebar.Collapse>

          <Sidebar.Item className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/managing-os" icon={HiShoppingBag}>
            Gestão de OS
          </Sidebar.Item>
          <Sidebar.Item className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/generateMaterialQrcode" icon={HiQrcode}>
            Gerador De QrCode
          </Sidebar.Item>
          <Sidebar.Item className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/materials-relatory" icon={HiFilter}>
           Filtragem de Materiais
          </Sidebar.Item>
          <Sidebar.Collapse className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out"label=" Gestão De Usuários">

          <Sidebar.Item className=" mt-3 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/create-user" >
              Criar Usuário
          </Sidebar.Item>

          <Sidebar.Item className=" mt-3 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/manage-budges" >
              Gerenciar Usuários
          </Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Item className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/log-register" icon={HiPencil}>
            Registro de Ações
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  
  </>
    );
  }