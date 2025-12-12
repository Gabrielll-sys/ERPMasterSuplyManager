"use client"
import { Button, Input } from '@nextui-org/react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "dayjs/locale/pt-br";
import { url } from '@/app/api/webApiUrl';
import { fetcher, poster } from '@/app/lib/api';
import { useSession } from 'next-auth/react';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import dayjs from 'dayjs';
import { IOrcamento } from '@/app/interfaces/IOrcamento';
import { toast } from 'sonner';



export default function CreateBudge({params}:any){
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
    const [isCreating, setIsCreating] = useState(false);

    const [currentUser, setCurrentUser] = useState<any>(null);
    const[nomeOrçamento,setNomeOrçamento] = useState<string>("")

    const formasPagamento : string[] = ["Boleto", "PIX", "Cartão De Crédito", "Cartão De Débito"];
    const doc = new jsPDF()
    let date = dayjs()

useEffect(()=>{
  const userStr = localStorage.getItem("currentUser");
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user != null) {
      setCurrentUser(user)
    }
  }
},[])


  
  const handleNomeCliente = async(value:any)=>{
    setNomeCliente(value)
    if(!value.length){
      setCpfOrCnpj("")
      setTelefone("")
      setEndereco("")
      setEmailCliente("")
      return;
   }

    try {
      const data = await fetcher<{
        cpfOrCnpj: string;
        telefone: string;
        endereco: string;
        emailCliente: string;
      }>(`${url}/Orcamentos/buscaCliente?cliente=${value?.trim()}`);

      setCpfOrCnpj(data.cpfOrCnpj)
      setTelefone(data.telefone)
      setEndereco(data.endereco)
      setEmailCliente(data.emailCliente)
    } catch (error) {
      // Error já é tratado pelo interceptor
    }
  }

const handleCreateBudge = async ()=>{
  setIsCreating(true);

  try {
    const orcamento : IOrcamento = {
      nomeCliente:nomeCliente?.trim().replace(/\s\s+/g, " "),
      emailCliente:emailCliente?.trim().replace(/\s\s+/g, " "),
      telefone:telefone,
      endereco:endereco.trim().replace(/\s\s+/g, " "),
      desconto:0,
      tipoPagamento:metodoPagamento==""?"PIX":metodoPagamento,
      responsavelOrcamento:currentUser.userName
    }

    const data = await poster<{ id: number }>(`${url}/Orcamentos`, orcamento);

    toast.success("Orçamento criado com sucesso!");
    route.push(`/edit-budge/${data.id}`);
  } catch (error) {
    // Error já é tratado pelo interceptor
  } finally {
    setIsCreating(false);
  }
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
        <Button
          isDisabled={!nomeCliente || isCreating}
          isLoading={isCreating}
          onPress={handleCreateBudge}
          className='bg-master_black text-white p-7 rounded-md font-bold text-2xl shadow-lg  '
        >
           {isCreating ? 'Criando...' : 'Criar Orçamento'}
        </Button>
      </div>

        </div>


     </>
)



}