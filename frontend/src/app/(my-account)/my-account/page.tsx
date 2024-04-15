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



export default function MyAccount({params}:any){
    const route = useRouter()
    const { data: session } = useSession();
  
    const[nomeCliente,setNomeCliente] = useState<string>()
    const[emailCliente,setEmailCliente] = useState<string>()
    const[telefone,setTelefone] = useState<string>()

    const[nomeOrçamento,setNomeOrçamento] = useState<string>("")


    const doc = new jsPDF()
    let date = dayjs()




  
  const handleNomeCliente = async(value:any)=>{

  }


  

   

return(
    <>

        <div className="justify-center flex flex-col h-[65vh] gap-4">
            <h1 className='text-center text-2xl mt-4'>Minhas Informações</h1>
            <div className='flex flex-row items-center  text-center mx-auto w-[600px] gap-w'>

                <Input
                    label="Nome Cliente"
                    labelPlacement='outside'
                    value={nomeCliente}
                    className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px] "
                    onValueChange={(x) => handleNomeCliente(x)}
                />

                <Input
                    label="Email Cliente"
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

            </div>

            <div className='flex flex-row justify-center mt-16'>
                <Button isDisabled={!nomeCliente}
                        className='bg-master_black text-white p-5 rounded-md font-bold text-2xl shadow-lg  '>
                    Atualizar
                </Button>
            </div>


        </div>
    </>
)


}
