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
import { url } from '@/app/api/webApiUrl';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import  updateInventory from "../style/updateInventory.module.css";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import IMaterial from '@/app/interfaces/IMaterial';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios, { AxiosResponse } from "axios";
import imagem from '/src/app/assets/logo.png'
import { useReactToPrint } from 'react-to-print';
import ArrowLeft from '@/app/assets/icons/ArrowLeft';
import { IFilterMaterial } from '@/app/interfaces/IFilterMaterial';
import { IOrderServico } from '@/app/interfaces/IOrderServico';
import { useSession } from 'next-auth/react';
import { IInventario } from '@/app/interfaces/IInventarios';
import IconBxTrashAlt from '@/app/assets/icons/IconBxTrashAlt';
import IconPlus from '@/app/assets/icons/IconPlus';
import { IItem } from '@/app/interfaces/IItem';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import dayjs from 'dayjs';
import { IOrcamento } from '@/app/interfaces/IOrcamento';
import {currentUser} from "@/app/services/Auth.services";



export default function BudgeManagement({params}:any){
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

    const formasPagamento : string[] = ["Boleto", "PIX", "Cartão De Crédito", "Cartão De Débito"];
  const doc = new jsPDF()
    let date = dayjs()




  
  const handleNomeCliente = async(value:any)=>{
    setNomeCliente(value)
    if(!value.length){
      setCpfOrCnpj("")
      setTelefone("")
      setEndereco("")
      setEmailCliente("")
   }

    await axios.get(`${url}/Orcamentos/buscaCliente?cliente=${value?.trim()}`).then((r:AxiosResponse)=>{
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

const res = await axios.post(`${url}/Orcamentos`, orcamento).then(r=>{

  route.push(`/edit-budge/${r.data.id}`)

}).catch(e=>console.log(e))

}
  

   
      



return(
    <>
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
  {/* <h1 className='text-center text-2xl mt-7'>Informações do Orçamento</h1>
    <div className=' justify-center flex flex-row items-center gap-4'>

    <Input
        labelPlacement='outside'
        value={desconto}
        type='text'
        className="border-1 border-black rounded-md shadow-sm shadow-black  w-[200px]"
        onValueChange={setDesconto}
        placeholder='2.5%'
        label="Desconto" 
        endContent={<span>%</span>}
      />

  <Autocomplete
                    label="Método Pagamento $"
                
                    className=" w-[250px] border-1 border-black rounded-md shadow-sm shadow-black mt-10  "
                    allowsCustomValue
                      value={metodoPagamento}
                      onSelectionChange={setMetodoPagamento}
                  >
                  
                  {formasPagamento.map((item:any) => (
                    
                      <AutocompleteItem
                      key={item} 
                      aria-label='teste'
                      

                    
                        value={metodoPagamento}
                        >
                        {item}
                      </AutocompleteItem>
                    ))}
                    </Autocomplete>

    </div> */}
      <div className='flex flex-row justify-center mt-16'>
        <Button  isDisabled={!nomeCliente} onPress={handleCreateBudge} className='bg-master_black text-white p-7 rounded-md font-bold text-2xl shadow-lg  '>
           Criar Orçamento
        </Button>
      </div>




     </>
)



}
