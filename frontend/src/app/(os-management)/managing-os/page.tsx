"use client"
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody, CardFooter,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { url } from "../../api/webApiUrl";

import dayjs from "dayjs";


import IconCheckCircle from "@/app/assets/icons/IconCheckCircle";
import IconEdit from "@/app/assets/icons/IconEdit";
import { IOrderServico } from "@/app/interfaces/IOrderServico";
import { useSession } from "next-auth/react";
export default function OsManagement(){
   
    type Os = {
      id:number,
      numeroOs?:number,
      descricao?:string,
      responsavelAbertura?:string,
      isAuthorized?:boolean,
      dataAutorizacao?:any,
      dataAbertura?:any,
      dataFechamento?:any,
      observacoes:string,
      precoTotalEquipamentosOs:number
    }
  
  
    const route = useRouter()
    const { data: session } = useSession();
  
    const [ordemServicos,setOrdemServicos] = useState<any>([])
    const [descricaoOs, setDescricaoOs] = useState<string>("ssss");

    const [numeroOs,setNumeroOs] = useState<string>()
    const [openModal,setOpenModal] = useState<boolean>(false)
    const[numerosOs,setNumerosOs] = useState<any>()

  
    const [messageAlert, setMessageAlert] = useState();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [osModal,setOsModal] = useState<IOrderServico|undefined>(undefined)
    const [currentUser, setCurrentUser] = useState<any>(null);
 
  
  

  useEffect(()=>
  {
          
         //@ts-ignore
         const user = JSON.parse(localStorage.getItem("currentUser"));
         if(user != null)
         {
             setCurrentUser(user)
       
         }
  getAllOs()
    
  },[])
  useEffect(()=>
  {
  console.log(numeroOs)
    
  },[numeroOs])
 
  const handleModal = (value:any)=>{
    console.log(value)
    setOsModal(value)
    if(!openModal){

      setOpenModal(true)
    }
    else {

      setOpenModal(false)
      setOsModal(undefined)
    }
  }
  const getAllOs= async()=>{
    const listNumerosOs:string[] =[]

    const res = await axios.get(`${url}/OrdemServicos`).then(r=>{

      return r.data
    }).catch()
 

    for(let ordemServico of res){

      listNumerosOs.push(ordemServico.numeroOs)

    }
    listNumerosOs.sort()
    console.log(res)
    const revertedOs:IOrderServico[] = res; 
 
    setNumerosOs(listNumerosOs)
    setOrdemServicos(revertedOs)
  
  
  }
  
  const handleCreateOs = async()=>{
  
    const descricaoOsFormated = descricaoOs.trim().replace(/\s\s+/g, " ")
    const numeroOsFormated = numeroOs?.trim().replace(/\s\s+/g, " ")
  
    
    const OS =
    {
      
    descricao:`${descricaoOsFormated}`,
    numeroOs:numeroOsFormated,
    responsavelAbertura : currentUser?.userName,
    }

    
    const res = await axios.post(`${url}/OrdemServicos`,OS).then(x=>{
    
      return x.data
    }).catch()
    console.log(res)
    
    
      getAllOs()
  
  }

  return(
      <>
  
  <h1 className='text-center font-bold text-2xl mt-6' >Gerenciamento de OS</h1>
  
  <div className=' w-full flex flex-row justify-center mt-6 gap-5 '>
   
  

  
     <Autocomplete
         label="Numero OS "
         placeholder=""
         className="max-w-[160px]  border-1 border-black rounded-md shadow-sm shadow-black  "
          onValueChange={setNumeroOs}
          value={numeroOs}
          allowsCustomValue
       
   
       >
       
       {numerosOs?.map((item:any) => (
        
          <AutocompleteItem
            key={item}
           aria-label='teste'
            className="pointer-events-none"
            value={numeroOs}
            >
            {item}
          </AutocompleteItem>
        ))}
        </Autocomplete>
     <Autocomplete
         label="Nome da Ordem de Serviço "
         isDisabled={!ordemServicos}
         placeholder="Ordem Servicos"
         className="max-w-2xl  border-1 border-black rounded-md shadow-sm shadow-black "
          onValueChange={setDescricaoOs}
          value={descricaoOs}
          
           allowsCustomValue
        
   
       >
       
       {ordemServicos.map((item:Os) => (
        
          <AutocompleteItem
           key={item.id} 
           endContent={
            <>
             <IconEdit onClick={()=>route.push(`/editing-os/${item.id}`)} />
            </>}
           aria-label='teste'
            value={item.descricao}
            >
            {item.descricao}
          </AutocompleteItem>
        ))}
        </Autocomplete>



  </div>
  <div className='text-center mt-8 '>
      <Button 
       onPress={handleCreateOs} 
       isDisabled={numerosOs?.includes(numeroOs)}
       className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl '>
        Cria OS
      </Button>
      </div>

      <div className=" flex flex-row flex-wrap gap-12 mt-16 justify-center pb-40 " >
  { ordemServicos!=undefined && ordemServicos.map((os:Os)=>(

 <Card key={os.id} className="max-w-[400px] hover:bg-master_yellow hover:-translate-y-3 min-w-[300px] border-1 border-black  shadow-md shadow-black">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col w-full text-center">
          {os.isAuthorized && (

       <IconCheckCircle className="self-center" fill="green"/>
          )
          }
          
          <div className={`${os.isAuthorized?"mt-2":"mt-10"}`}>
            <p className="text-md text-black font-bold mt-2 p-1">{os.descricao}</p>
            <p className="text-base text-black font-bold p-1 ">Status:{os.isAuthorized?"Concluída":" Em andamento"}</p>
            <p className="text-base text-black font-bold p-1">Data abertura: {dayjs(os.dataAbertura).format("DD/MM/YYYY")}</p>
          </div>
        </div>
      </CardHeader>
      <Divider className="bg-black"/>
      <CardBody className="flex flex-col items-center justify-center">
        <p className="hover:underline text-black text-center" onClick={()=>handleModal(os)}>Observações</p>
      </CardBody>
      <Divider className="bg-black"/>
      <CardFooter>
      <Button color="danger" className=" mx-auto font-bold" variant="light" onPress={x=>route.push(`/editing-os/${os.id}`)}>
                    <IconEdit fill="black"/>
                </Button>
      </CardFooter>
    </Card>
  
  
  ))}
  </div>

    {osModal!=undefined &&(

      <Modal 
      size="3xl" 
      backdrop="blur"
      isOpen={openModal}
       onOpenChange={onOpenChange}
       classNames={{
        body: "py-6",
        base: "border-[#292f46] bg-[#ffff] dark:bg-[#19172c] text-black ",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
   
      }}>
        <ModalContent>
       
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">{osModal.descricao}</ModalHeader>
              <ModalBody>
                <p> 
                 Data de Abertura:{dayjs(osModal.dataAbertura).format("DD/MM/YYYY")}, aberta por:{osModal.responsavelAbertura }
                </p>
                <p> 
                 Data de Fechamento:{osModal.dataFechamento==null?"OS em andamento":dayjs(osModal.dataFechamento).format("DD/MM/YYYY")}
                </p>
                <p> 
                 Responsáveis Execução:{osModal.dataFechamento==""?"Sem registro":osModal?.responsaveisExecucao}
                </p>
                <p> 
                  {osModal.observacoes==null?"Sem observações no momento":osModal.observacoes}
                </p>

        {/* <p>{osModal.isAuthorized? osModal.precoTotalEquipamentosOs.toString().replace('.',','):""}</p> */}

              </ModalBody>
              <ModalFooter>
               <div className="flex flex-row justify-between w-full ">

                <p className="mt-2">Preço Custo : R${osModal.isAuthorized? osModal.precoCustoTotalOs?.toString().replace('.',','):""} ,Preço Venda : R${osModal.isAuthorized? osModal.precoVendaTotalOs?.toString().replace('.',','):""} </p>
                  <Button color="danger" className="hover:bg-yellow-300" variant="light" onPress={x=>handleModal(undefined)}>
                    Fechar
                  </Button>
               </div>
              </ModalFooter>
            </>
        </ModalContent>
      </Modal>
    )}
  
  
      </>
  )
  
  
  
  
  
  
}


