"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import Excel, { BorderStyle } from 'exceljs';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { QRCode } from "react-qrcode-logo";
import { Card, Dropdown, Table, Textarea } from 'flowbite-react';
import React, { use, useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";


import dayjs from 'dayjs';
import { IOrcamento } from '@/app/interfaces/IOrcamento';
import {currentUser} from "@/app/services/Auth.services";
import {getUserById} from "@/app/services/User.Services";
import {IRelatorioDiario} from "@/app/interfaces/IRelatorioDiario";
import {createRelatorioDiario, getAllRelatoriosDiarios} from "@/app/services/RelatorioDiario.Services";



export default function Reports({params}:any){
  const[numeroOrcamento,setNumeroOrcamento] = useState<string>("")
  const[relatoriosDiarios,setRelatorioDiarios] = useState<IRelatorioDiario[]>()


    useEffect(()=>{
        getAll()
    },[])


    const route = useRouter()


const getAll = async ()=>{

    const res: any = await getAllRelatoriosDiarios()

    if(res) setRelatorioDiarios(res)

}
const handleCreateRelatorio = async()=>{
      const res = await createRelatorioDiario();
      if(res) await getAll();
}

return(
    <>
        <div className = "flex flex-col gap-5 justify-center">


      <h1 className='text-center text-2xl mt-4'>Relatórios Diários</h1>
        <Button  onPress={handleCreateRelatorio} className='  bg-master_black max-sm:w-[50%] md:w-[14%] mx-auto text-white rounded-md font-bold text-base  '>
            Criar novo relatório
        </Button>
        </div>
    <div className=' flex flex-row items-center justify-center flex-wrap gap-16 self-center mt-16'>
      
      { relatoriosDiarios!=undefined  && relatoriosDiarios.map((relatorioDiario:IRelatorioDiario)=>(

      <Card key={relatorioDiario.id}  className="min-w-[370px] hover:-translate-y-2 hover:bg-master_yellow transition duration-75  ease-in-out bg-white border-black border-1 shadow-md shadow-black">
      
        <div className="flex flex-col items-center pb-4">
      
          <h5 className="mb-1 text-xl font-xl mt-2 dark:text-white">Relatório Diário Nº {relatorioDiario.id}</h5>
          <span className="text-lg mt-2">Data Abertura:{dayjs(relatorioDiario.horarioAbertura).format("DD/MM/YYYY HH:mm:ss")}</span>
          <span className="text-lg mt-2">Status:{relatorioDiario.isFinished?"Relatório Concluído":"Relatório Em Análise"}</span>
          <div className="mt-4 flex space-x-3 lg:mt-6">
            <p
              onClick={()=>route.push(`/report/${relatorioDiario.id}`)}
              className="inline-flex hover:underline  text-lg items-center rounded-lg px-4 py-2 text-center  font-medium text-blue-700"
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
