"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import Excel, { BorderStyle } from 'exceljs';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { QRCode } from "react-qrcode-logo";
import { Card, Dropdown, Textarea } from 'flowbite-react';
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
import { IInventario } from '@/app/interfaces/IInventarios';
import IconBxTrashAlt from '@/app/assets/icons/IconBxTrashAlt';
import IconPlus from '@/app/assets/icons/IconPlus';
import { IItem } from '@/app/interfaces/IItem';
import jsPDF from 'jspdf'


import dayjs from 'dayjs';



export default function ManageBudges({params}:any){

    useEffect(()=>{
        getAllOrcamentos()
    },[])
    const route = useRouter()
    const { data: session } = useSession();
  
    const[orcamentos,setOrcamentos] = useState<any>()
    

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

const getAllOrcamentos = async ()=>{


 await axios.get(`${url}/Orcamentos`).then((r:AxiosResponse)=>{

  setOrcamentos(r.data)
}).catch(e=>console.log(e))

}




return(
    <>
      <h1 className='text-center text-2xl mt-4'>vv</h1>
    <div className=' flex flex-row items-center justify-center flex-wrap gap-16 self-center'>
      {orcamentos!=undefined &&  orcamentos.map((x:any)=>(



      <Card className="min-w-[270px] bg-white border-black border-1 shadow-md shadow-black">
      
        <div className="flex flex-col items-center pb-10">
      
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Orçamento N {x.id}</h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">{x.responsavelOrcamento}</span>
          <div className="mt-4 flex space-x-3 lg:mt-6">
            <p
              onClick={()=>route.push(`/edit-budge/${x.id}`)}
              className="inline-flex  text-lg items-center rounded-lg px-4 py-2 text-center  font-medium text-blue-700"
            >
              Editar
            </p>
           
          </div>
        </div>
      </Card>
      ))}
    </div>




     </>
)



}