"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import Excel, { BorderStyle } from 'exceljs';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { QRCode } from "react-qrcode-logo";
import {Table, Textarea} from 'flowbite-react';
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
import CardImageAtividadeRd from "@/app/componentes/CardImageAtividadeRd";
import IconPen from "@/app/assets/icons/IconPencil";



export default function Report({params}:any){
    const route = useRouter()
    const { data: session } = useSession();
  const[inputIsEditable,setInputIsEditable] = useState<boolean>(true)

    const[nomeCliente,setNomeCliente] = useState<string>()
    const[emailCliente,setEmailCliente] = useState<string>()
    const[telefone,setTelefone] = useState<string>()

    const formasPagamento : string[] = ["Boleto", "PIX", "Cartão De Crédito", "Cartão De Débito"];
  const doc = new jsPDF()
    let date = dayjs()




const handleCreateReport = async ()=>{

const orcamento : IOrcamento = {

}
}

const inputsIsEditable = ()=> {

}




return(
    <>

        <div className="justify-center flex flex-col  gap-4">
    <h1 className='text-center text-2xl mt-4'>Informações Do Cliente</h1>
    <div className='flex flex-row justify-center mt-8'>


    <Input
         label = "Email Cliente"
        labelPlacement='outside'
        value={emailCliente}
         isReadOnly={inputIsEditable}
        className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setEmailCliente}

      />
    <Input
        labelPlacement='outside'
        value={telefone}
        className="bg-transparent mt-10 ml-5 mr-5 w-[200px]"
        isReadOnly={inputIsEditable}
        onValueChange={setTelefone}
        placeholder='99283-4235'
        label="Telefone" 
      />

    </div>
            <IconPen onClick={(x)=>setInputIsEditable(false)} height={30} width={30} />

<div className='flex flex-row flex-wrap  justify-center gap-3 w-full'>

    <CardImageAtividadeRd/>
    <CardImageAtividadeRd/>
    <CardImageAtividadeRd/>
    <CardImageAtividadeRd/>
    <CardImageAtividadeRd/>
    <CardImageAtividadeRd/>

</div>


      <div className='flex flex-row justify-center mt-16'>
        <Button  isDisabled={!nomeCliente} onPress={handleCreateReport} className='bg-master_black text-white p-7 rounded-md font-bold text-2xl shadow-lg  '>
           Criar Orçamento
        </Button>
      </div>
            <Input
                labelPlacement='outside'
                value={telefone}
                className="bg-transparent mt-10 ml-5 mr-5 w-[200px]"
                isReadOnly={inputIsEditable}
                onValueChange={setTelefone}
                placeholder='99283-4235'
                label="Atividade"
            />
            <div className="overflow-x-auto self-center w-[90%] mt-5 ml-5 ">
                <Table  hoverable striped className="w-[100%] ">
                    <Table.Head className="border-1 border-black text-2xl text-center p-3 ">
                        Atividades
                    </Table.Head>
                    <Table.Head className="border-1 border-black text-2xl text-center ">
                        <Table.HeadCell className="text-center text-sm border-1 border-black  w-[100px]">Nº</Table.HeadCell>
                        <Table.HeadCell className="text-center border-1 border-black text-sm">Atividade</Table.HeadCell>

                    </Table.Head>
                    <Table.Body className="divide-y">
                            <Table.Row  className=" dark:border-gray-700 dark:bg-gray-800 ">
                                <Table.Cell className="  text-center font-medium text-gray-900 dark:text-white max-w-[120px]">
                                    teste
                                </Table.Cell>
                                <Table.Cell className="text-left text-black" >teste</Table.Cell>

                            </Table.Row>

                    </Table.Body>

                </Table>


            </div>

        </div>


     </>
)



}
