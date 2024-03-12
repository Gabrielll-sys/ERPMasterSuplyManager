"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import Excel, { BorderStyle } from 'exceljs';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { QRCode } from "react-qrcode-logo";
import { Card, Dropdown, Table, Textarea } from 'flowbite-react';
import { use, useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import { url } from '@/app/api/webApiUrl';

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

import jsPDF from 'jspdf'


import dayjs from 'dayjs';



export default function ManageBudges({params}:any){
  const[cliente,setCliente] = useState<string>("")
  const[numeroOrcamento,setNumeroOrcamento] = useState<string>()
  const[orcamentos,setOrcamentos] = useState<any>()
  const[orcamento,setOrcamento] = useState<any>("")

    useEffect(()=>{
        getAllOrcamentos()
    },[])

    useEffect(()=>{
        getOrcamentosByClient()
        if(cliente?.length==0){
          getAllOrcamentos()
        }
    },[cliente])

    useEffect(()=>{
        if(numeroOrcamento?.length==0){
          getAllOrcamentos()
        }
        getOrcamentoById()
    },[numeroOrcamento])
    const route = useRouter()
    const { data: session } = useSession();
  
    

    const[nomeOrçamento,setNomeOrçamento] = useState<string>("")

    const formasPagamento : string[] = ["Boleto", "PIX", "Cartão Crédito", "Cartão Débito"];
    const doc = new jsPDF()
    let date = dayjs()

    const bordas:any= {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    }



const getOrcamentosByClient = async()=>{
  setNumeroOrcamento("")

  if(cliente.length){

    await axios.get(`${url}/Orcamentos/buscaNomeCliente?cliente=${cliente}`).then((r:AxiosResponse)=>{
      setOrcamentos(r.data)
    }).catch(e=>console.log(e))
  }

}

const getAllOrcamentos = async ()=>{


 await axios.get(`${url}/Orcamentos`).then((r:AxiosResponse)=>{
  
  setOrcamentos(r.data)
}).catch(e=>console.log(e))

}

const getOrcamentoById = async()=>{
  setOrcamentos([])
  await axios.get(`${url}/Orcamentos/${numeroOrcamento}`).then((r:AxiosResponse)=>{
    console.log(r.data)
    setOrcamento(r.data)
  }).catch(e=>console.log(e))
}



return(
    <>
      <h1 className='text-center text-2xl mt-4'>Orçamentos</h1>
      <div className=' flex flex-row justify-center'>
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

      <Card key={x.id}  className="min-w-[370px] hover:bg-master_yellow hover:scale-110 bg-white border-black border-1 shadow-md shadow-black">
      
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

{orcamento!=undefined  && orcamento.id!=undefined && (

<Card key={orcamento.id} className="min-w-[370px] hover:bg-master_yellow hover:scale-110 bg-white border-black border-1 shadow-md shadow-black">

  <div className="flex flex-col items-center pb-4">

    <h5 className="mb-1 text-xl font-xl mt-2 dark:text-white">Orçamento Nº {orcamento.id}</h5>
    <span className="text-lg mt-2  ">{orcamento.nomeCliente}</span>
    <span className="text-lg mt-2">Data Orcamento:{dayjs(orcamento.dataOrcamento).format("DD/MM/YYYY HH:mm:ss")}</span>
    <span className="text-lg mt-2">Status:{orcamento.isPayed?"Orçamento Concluído":"Orçamento em Aberto"}</span>
    <div className="mt-4 flex space-x-3 lg:mt-6">
      <p
        onClick={()=>route.push(`/edit-budge/${orcamento.id}`)}
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