"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input,Textarea, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import Excel, { BorderStyle } from 'exceljs';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { QRCode } from "react-qrcode-logo";

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
import axios from "axios";
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



export default function BudgeManagement({params}:any){
    const route = useRouter()
    const { data: session } = useSession();
  
    const[nomeCliente,setNomeCliente] = useState<string>()
    const[emailCliente,setEmailCliente] = useState<string>()
    const[telefone,setTelefone] = useState<string>()
    const[cpfOrCnpj,setCpfOrCnpj] = useState<string>()
    const[empresa,setEmpresa] = useState<string>()
    const [metodoPagamento,setMetodoPagamento] = useState<any>("boleto")
    const [desconto,setDesconto] = useState<number>(0)

    const[nomeOrçamento,setNomeOrçamento] = useState<string>("")


  const doc = new jsPDF()
    let date = dayjs()

    const bordas:any= {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    }

const createBudge = async ()=>{

const orcamento = {
desconto:desconto,
dataOrcamento : dayjs(date).format("DD/MM/YYYY").toString(),

}

const res = await axios.post(`${url}/Orcamentos`, orcamento).then(r=>{


}).catch(e=>console.log(e))

}
   const createItemOrcamento = async()=>{

    const item ={
      quantidadeMaterial:2,
      materialId:20,


    }


   }
      



return(
    <>
    <h1 className='text-center text-2xl mt-4'>Informações Do Cliente</h1>
    <div className='flex flex-row justify-center  '>
    <Input
        value={nomeCliente}
        className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setNomeCliente}
        label="Nome" 
      />
    <Input
        value={emailCliente}
        className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setEmailCliente}
        label="Email" 
      />
    <Input
        value={telefone}
        className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setTelefone}
        placeholder='99283-4235'
        label="Telefone" 
      />
  <Input
        value={cpfOrCnpj}
        type='number'
        className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setCpfOrCnpj}
        placeholder='155.507.22.42'
        label="CPF ou CNPJ" 
      />
  <Input
        value={empresa}
        type='text'
        className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setEmpresa}
        placeholder='Microsft'
        label="Empresa" 
      />
    </div>
  <h1 className='text-center text-2xl mt-7'>Informações do Orçamento</h1>
    <div className='  flex flex-col items-center'>

    <Input
        value={empresa}
        type='text'
        className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setEmpresa}
        placeholder='Microsft'
        label="Empresa" 
      />

    <CheckboxGroup
      label="Select cities"
      orientation="horizontal"
      color="secondary"

      value={metodoPagamento}
      onValueChange={setMetodoPagamento}
    >
      <Checkbox value="boleto-bancario">Boleto Bancário</Checkbox>
      <Checkbox value="pix">Pix</Checkbox>
      <Checkbox value="cartao-credito">Cartão Crédito</Checkbox>
      <Checkbox value="cartao-débito">Cartão Débito</Checkbox>
    </CheckboxGroup>
    </div>




     </>
)



}