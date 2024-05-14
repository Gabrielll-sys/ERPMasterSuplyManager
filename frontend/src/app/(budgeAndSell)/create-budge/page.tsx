"use client"
import { Button, Input } from '@nextui-org/react';

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { url } from '@/app/api/webApiUrl';
import axios, { AxiosResponse } from "axios";
import "dayjs/locale/pt-br";
import { useSession } from 'next-auth/react';

import jsPDF from 'jspdf';

import { authHeader } from '@/app/_helpers/auth_headers';
import { IOrcamento } from '@/app/interfaces/IOrcamento';
import dayjs from 'dayjs';



export default function CreateBudge(){
    const route = useRouter()
    const { data: session } = useSession();
  
    const[nomeCliente,setNomeCliente] = useState<string>()
    const[emailCliente,setEmailCliente] = useState<string>()
    const[telefone,setTelefone] = useState<string>()
    const[cpfOrCnpj,setCpfOrCnpj] = useState<string>("")
    const[empresa,setEmpresa] = useState<string>()
    const [metodoPagamento,setMetodoPagamento] = useState<any>("")
    const [desconto,setDesconto] = useState<string>("")
    const [endereco,setEndereco] = useState<string>("")

    const [currentUser, setCurrentUser] = useState<any>();
    const[nomeOrçamento,setNomeOrçamento] = useState<string>("")
    
    const formasPagamento : string[] = ["Boleto", "PIX", "Cartão De Crédito", "Cartão De Débito"];
    const doc = new jsPDF()
    let date = dayjs()
    
useEffect(()=>{
  
 
    //@ts-ignore

    const user = JSON.parse(localStorage.getItem("currentUser"));
  
  console.log(user)
  if(user != null)
  {
      setCurrentUser(user)

  }
},[])


  
  const handleNomeCliente = async(value:any)=>{
    setNomeCliente(value)
    if(!value.length){
      setCpfOrCnpj("")
      setTelefone("")
      setEndereco("")
      setEmailCliente("")
   }

    await axios.get(`${url}/Orcamentos/buscaCliente?cliente=${value?.trim()}`,{headers:authHeader()}).then((r:AxiosResponse)=>{
      console.log(r.data)
     
       setCpfOrCnpj(r.data.cpfOrCnpj)
       setTelefone(r.data.telefone)
       setEndereco(r.data.endereco)
       setEmailCliente(r.data.emailCliente)

    
      
    }).catch(e=>console.log(e))
  }

const handleCreateBudge = async ()=>{

const orcamento : IOrcamento = {
  nomeCliente:nomeCliente?.trim().replace(/\s\s+/g, " "),
  emailCliente:emailCliente?.trim().replace(/\s\s+/g, " "),
  telefone:telefone,
  endereco:endereco.trim().replace(/\s\s+/g, " "),
  desconto:0,
  tipoPagamento:metodoPagamento==""?"PIX":metodoPagamento,
  responsavelOrcamento:currentUser.userName

}

const res = await axios.post(`${url}/Orcamentos`, orcamento,{headers:authHeader()}).then(r=>{

  route.push(`/edit-budge/${r.data.id}`)

}).catch(e=>console.log(e))

}
  

   
      



return(
    <>
        <div className="justify-center flex flex-col h-[65vh] gap-4">
    <h1 className='text-center text-2xl mt-4'>Informações Do Cliente</h1>
    <div className='flex flex-row justify-center mt-8'>

    <Input
        label = "Nome Cliente"
        labelPlacement='outside'
        value={nomeCliente}
        className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px] "
        onValueChange={(x)=>handleNomeCliente(x)}
      />

    <Input
         label = "Email Cliente"
        labelPlacement='outside'
        value={emailCliente}
        className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setEmailCliente}

      />
    <Input
        labelPlacement='outside'
        value={telefone}
        className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setTelefone}
        placeholder='99283-4235'
        label="Telefone" 
      />
    <Input
        labelPlacement='outside'
        value={endereco}
        className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setEndereco}
        placeholder='Rua Numero Bairro'
        label="Endereço" 
      />
  <Input
        labelPlacement='outside'
        value={cpfOrCnpj}
        className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setCpfOrCnpj}
        placeholder='155.507.22.42'
        label="CPF ou CNPJ" 
      />
    </div>


      <div className='flex flex-row justify-center mt-16'>
        <Button  isDisabled={!nomeCliente} onPress={handleCreateBudge} className='bg-master_black text-white p-7 rounded-md font-bold text-2xl shadow-lg  '>
           Criar Orçamento
        </Button>
      </div>

        </div>


     </>
)



}
