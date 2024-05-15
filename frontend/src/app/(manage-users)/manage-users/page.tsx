"use client"
import { Input } from '@nextui-org/react';

import "dayjs/locale/pt-br";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSession } from 'next-auth/react';

import { Flex } from '@radix-ui/themes';
import dayjs from 'dayjs';



export default function CreateUser(){
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

    const[nomeOrçamento,setNomeOrçamento] = useState<string>("")

    let date = dayjs()




   
      



return(
    <>
    <h1 className='text-center text-2xl mt-4'>Informações Do Cliente</h1>


      <Flex>
      <Input
        value={emailCliente}
        className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setEmailCliente}
        label="Email" 
      />
      </Flex>



     </>
)



}
