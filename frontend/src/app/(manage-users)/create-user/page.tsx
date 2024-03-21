"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import Excel, { BorderStyle } from 'exceljs';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { QRCode } from "react-qrcode-logo";
import { Textarea } from 'flowbite-react';
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";

import { useSession } from 'next-auth/react';


import dayjs from 'dayjs';
import { IOrcamento } from '@/app/interfaces/IOrcamento';
import { Box, Flex } from '@radix-ui/themes';



export default function CreateUser({params}:any){
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


      
        
          <div className='  justify-center    flex flex-col h-[100vh] bg-gradient-to-t from-light_yellow from-3% via-transparent '>

          {/* <div className='bg-gradient-to-r from-indigo-500 from-10% via-transparent'> */}
          <div className=' flex-flex-col gap-4 rounded-md shadow-md shadow-black border-1 border-black p-8'>

            <h1 className='text-center text-2xl mt-4'>Informações Do usuario</h1>

            <Input
              labelPlacement='outside'
              value={emailCliente}
              className="border-1 border-black rounded-md shadow-sm shadow-black  max-w-[200px]"
              onValueChange={setEmailCliente}
              label="Email"
            />
            <Input
              labelPlacement='outside'
              value={emailCliente}
              className="border-1 border-black rounded-md shadow-sm shadow-black  max-w-[200px]"
              onValueChange={setEmailCliente}
              label="Email"
            />
          </div>
        </div>
   



     </>
)



}
