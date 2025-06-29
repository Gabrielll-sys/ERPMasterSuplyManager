"use client"
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiFilter, HiInbox, HiPencil, HiPencilAlt, HiQrcode, HiShoppingBag } from 'react-icons/hi';

import IconReport from "../assets/icons/IconReport";
import { createRelatorioDiario } from "../services/RelatorioDiario.Services";
import { Sidebar } from "flowbite-react";
import Image from "next/image";


export default function SideBarLFT(props : any) {

  const route = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null);
 
  
  
  useEffect(()=>{
      //@ts-ignore
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if(user != null)
  {
      setCurrentUser(user)

  }
  },[])

  const conditionsRoles = currentUser?.role == "Administrador" || currentUser?.role == "Diretor" || currentUser?.role == "SuporteTecnico"
  console.log(conditionsRoles)
//Quando criar o relatório,ira redirecionar direto para a page dele
  const handleCreateRelatorio = async()=>{
    const res = await createRelatorioDiario()

     route.push(`relatorios/${res.id}`)

  }


    return (
  <>
  
 

  <Sidebar   className=" border-1 border-black border-l-1 h-svh z-[16] ml-[-5px] " aria-label="Sidebar with multi-level dropdown example ">
        <Sidebar.ItemGroup>
   
    <Button className="h-25 bg-white " >

    <Image  className="py-5 hover:scale-30 max-sm:mt-1 max-sm:w-[100px] max-sm:h-[80px] w-[130px] h-[105px]" src={require('../assets/logo preta.jpg')}alt="logo master" />
    </Button>
    </Sidebar.ItemGroup>


      <Sidebar.Items >
        <Sidebar.ItemGroup >
          L58: <Sidebar.Item  href="/criar-material" className="text-black hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" icon={HiPencil}>
            Criar Material
          </Sidebar.Item>
            <Sidebar.Item className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/relatorios" icon = {IconReport} >
              Relatórios
            </Sidebar.Item>

          { conditionsRoles &&(
              <>
          L67: <Sidebar.Item className="text-black mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/busca-inventario" icon={HiInbox}>
            Gestão de Inventário
          </Sidebar.Item>
          <Sidebar.Collapse className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out"label=" Orçamentos/Vendas" icon={HiPencilAlt}>

          <Sidebar.Item className=" mt-3 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/criar-orcamento" >
              Criar Orçamento
          </Sidebar.Item>
          <Sidebar.Item className=" mt-3 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/gerenciar-orcamentos" >
              Orçamentos
          </Sidebar.Item>
          </Sidebar.Collapse>
              </>
          )}
            {conditionsRoles && (

          <Sidebar.Item className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/gerenciamento-ordem-servico" icon={HiShoppingBag}>
            Gestão de OS
          </Sidebar.Item>
            )}
          L87: <Sidebar.Item className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75 ease-in-out" href="/gerar-qrcode-material" icon={HiQrcode}>
            Gerador De QrCode
          </Sidebar.Item>
           

            {conditionsRoles && (
                <>
          {/* <Sidebar.Collapse className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out"label=" Gestão De Usuários" icon = {IconPersonFill}>


          <Sidebar.Item className=" mt-3 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/create-user"   >
              Criar Usuário
          </Sidebar.Item>

          <Sidebar.Item className=" mt-3 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/gerenciar-orcamentos" >
              Gerenciar Usuários
          </Sidebar.Item>
          </Sidebar.Collapse> */}
          L105: <Sidebar.Item className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/registro-de-logs" icon={HiPencil}>
            Registro de Ações
          </Sidebar.Item>
          <Sidebar.Collapse className=" mt-7 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out"label=" Utilitários" icon={HiPencilAlt}>
            L109: <Sidebar.Item className=" mt-3 hover:font-bold hover:-translate-y-1 hover:bg-master_yellow transition duration-75  ease-in-out" href="/motor-weg-atual" >
                Corrente Motor WEG
            </Sidebar.Item>
            </Sidebar.Collapse>
                </>
            )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  
  </>
    )
  }