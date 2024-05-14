"use client"
import { url } from '@/app/api/webApiUrl';
import { Input } from '@nextui-org/react';
import axios, { AxiosResponse } from "axios";
import "dayjs/locale/pt-br";
import { Card } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import React from 'react';
import { useEffect,useState } from 'react';
import { IOrcamento } from '@/app/interfaces/IOrcamento';
import dayjs from 'dayjs';

import { authHeader } from '@/app/_helpers/auth_headers';



export default function ManageBudges(){
  const[cliente,setCliente] = useState<string>("")
  const[numeroOrcamento,setNumeroOrcamento] = useState<string>("")
  const[orcamentos,setOrcamentos] = useState<IOrcamento[]>()
  const[orcamento,setOrcamento] = useState<IOrcamento>()
  const [currentUser, setCurrentUser] = useState<any>(null);
 
  
  
    useEffect(()=>{
        getAllOrcamentos()
         //@ts-ignore
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if(user != null)
    {
        setCurrentUser(user)
  
    }
    },[])

    useEffect(()=>{
        getOrcamentosByClient()
        if(cliente == ""){
          getAllOrcamentos()
        }
    },[cliente])

    useEffect(()=>{
    
        if(numeroOrcamento==""){
          getAllOrcamentos()
        }
        else{
        getOrcamentoById()

          setOrcamentos(undefined)
        }
    },[numeroOrcamento])

    const route = useRouter()
    const { data: session } = useSession();
  
    

const getOrcamentosByClient = async()=>{
  setNumeroOrcamento("")
  setOrcamentos(undefined)
  if(cliente.length && cliente!=""){

    await axios.get(`${url}/Orcamentos/buscaNomeCliente?cliente=${cliente}`,{headers:authHeader()}).then((r:AxiosResponse)=>{
   
      if(r.data.length==1) {
        setOrcamentos([])
        setOrcamento(r.data[0])
      }
      else if (r.data.length>1){
    
        setOrcamentos(r.data)
      }
      
    }).catch(e=>console.log(e))
  }

}

const getAllOrcamentos = async ()=>{

if(cliente == "" && numeroOrcamento == "")
{

  await axios.get(`${url}/Orcamentos`,{headers:authHeader()}).then((r:AxiosResponse)=>{
 
   console.log(r.data)
   if(r.data.length==1) {
     setOrcamento(r.data[0])
   }
   else if (r.data.length>1){


     setOrcamentos(r.data)
   }
 }).catch(e=>console.log(e))
}

}

const getOrcamentoById = async()=>{
 
  if(numeroOrcamento != undefined){

    await axios.get(`${url}/Orcamentos/${numeroOrcamento}`,{headers:authHeader()}).then((r:AxiosResponse)=>{

      setOrcamentos([])
      setOrcamento(r.data)
      
    }).catch(e=>console.log(e))
  }
}

return(
    <>
      <h1 className='text-center text-2xl mt-4' onClick={()=>console.log(orcamento)}>Orçamentos</h1>
      <div className=' flex  flex-row justify-center'>
        <Input
          value={numeroOrcamento}
          type='number'
          className="border-1 border-black rounded-lg shadow-sm shadow-black mt-10 ml-5 mr-5 min-w-[170px] max-w-[170px]"
          onValueChange={setNumeroOrcamento}
          label="Numero Do Orçamento"
        />
        <Input
          value={cliente}
          className="border-1 border-black rounded-lg shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
          onValueChange={setCliente}
          placeholder='Ex:Brastorno'
          label="Nome do Cliente"
        />
      </div>
    <div className=' flex flex-row items-center justify-center flex-wrap gap-16 self-center mt-16'>
      
      {orcamentos!=undefined && orcamentos.length>1&& orcamentos.map((x:any)=>(

      <Card key={x.id}  className="min-w-[370px] hover:-translate-y-2 hover:bg-master_yellow transition duration-75  ease-in-out bg-white border-black border-1 shadow-md shadow-black">
      
        <div className="flex flex-col items-center pb-4">
      
          <h5 className="mb-1 text-xl font-xl mt-2 dark:text-white">Orçamento Nº {x.id}</h5>
          <span className="text-lg mt-2  ">{x.nomeCliente}</span>
          <span className="text-lg mt-2">Data Orcamento:{dayjs(x.dataOrcamento).format("DD/MM/YYYY HH:mm:ss")}</span>
          <span className="text-lg mt-2">Status:{x.isPayed?"Orçamento Concluído":"Orçamento em Aberto"}</span>
          <div className="mt-4 flex space-x-3 lg:mt-6">
            <p
              onClick={()=>route.push(`/edit-budge/${x.id}`)}
              className="inline-flex hover:underline  text-lg items-center rounded-lg px-4 py-2 text-center  font-medium text-blue-700"
            >
              Editar
            </p>
           
          </div>
        </div>
      </Card>
      ))}

{orcamento?.id!=undefined && !orcamentos?.length && (
<Card  key={orcamento?.id} className="min-w-[370px] hover:bg-master_yellow hover:scale-110 bg-white border-black border-1 shadow-md shadow-black">

  <div className="flex flex-col items-center pb-4">

    <h5 className="mb-1 text-xl font-xl mt-2 dark:text-white">Orçamento Nº {orcamento?.id}</h5>
    <span className="text-lg mt-2  ">{orcamento?.nomeCliente}</span>
    <span className="text-lg mt-2">Data Orcamento:{dayjs(orcamento?.dataOrcamento).format("DD/MM/YYYY HH:mm:ss")}</span>
    <span className="text-lg mt-2">Status:{orcamento?.isPayed?"Orçamento Concluído":"Orçamento em Aberto"}</span>
    <div className="mt-4 flex space-x-3 lg:mt-6">
      <p
        onClick={()=>route.push(`/edit-budge/${orcamento?.id}`)}
        className="inline-flex hover:underline  text-lg items-center rounded-lg px-4 py-2 text-center  font-medium text-blue-700"
      >
        Editar
      </p>
     
    </div>
  </div>
</Card>
)}
    </div>


     </>
)


}
