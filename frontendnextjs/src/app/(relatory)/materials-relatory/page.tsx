"use client"

import {Link, Button,Autocomplete, AutocompleteItem, Input } from '@nextui-org/react';

import { Snackbar } from '@mui/material';
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


import { useReactToPrint } from 'react-to-print';
import ArrowLeft from '@/app/assets/icons/ArrowLeft';
import { IFilterMaterial } from '@/app/interfaces/IFilterMaterial';

export default function MaterialRelatory(params:any){
   
    const route = useRouter()
   const componentRef: any = useRef();

  const [descricao,setDescricao] = useState<string>()
  const [marca,setMarca] = useState<string>()
  const [precoVendaMin,setPrecoVendaMin] = useState<string>()
  const [precoVendaMax,setPrecoVendaMax] = useState<string>()
  const [precoCustoMin,setPrecoCustoMin] = useState<string>()
  const [precoCustoMax,setPrecoCustoMax] = useState<string>()

 const handlePrint = useReactToPrint({
  content: () => componentRef.current,
  documentTitle: 'Visitor Pass',
  onAfterPrint: () => console.log('Printed PDF successfully!'),
 });

 const verifyNumberIsEmpty = (item:string | undefined)=>{
 
  return !item?.length ? null: Number(item?.replace(',','.')).toFixed(2)

}

const generateRelatory = async()=>{

const filtro  = {
    descricao: null,
    marca: null,

    precoVendaMin:verifyNumberIsEmpty(precoVendaMin),
    precoVendaMax:verifyNumberIsEmpty(precoVendaMax),
    precoCustoMin:verifyNumberIsEmpty(precoCustoMin),
    precoCustoMax:verifyNumberIsEmpty(precoCustoMax),



}
console.log(filtro)
  const materialCriado = await axios
  .post(`${url}/Materiais/filter-material`,filtro)
  .then((r) => {
    console.log(r.data)
    return  r.data
  })


}

    


     return (
      <>

       
       <Link
        size="sm"
        as="button"
        className="p-3 mt-4 text-base tracking-wide text-dark hover:text-success border border-transparent hover:border-success transition-all duration-200"
        onClick={() => route.back()}
      >
        <ArrowLeft /> Retornar
      </Link>
       <h1 className='text-center font-bold text-2xl mt-4'>Geração QrCode para Materiais </h1>

   
      
     <div className=' w-full flex flex-row justify-center mt-12 ga-4 items-center '>

     <Input
       
          label="Descricao do Material"
          className="w-[400px]"
          placeholder="0,00"
          labelPlacement="outside"
          value={descricao}
          onValueChange={setDescricao}
         
        />
     <Input
          label="Marca"
          className="w-32"
          placeholder="Ex: WEG"
          labelPlacement="outside"
          value={marca}
          onValueChange={setMarca}
         
        />
  

     </div>

       <div className=' w-full flex flex-row justify-center mt-12 ga-4 items-center '>
   
       <Input
          type="number"
          label="Preço custo min"
          className="w-32"
          value={precoCustoMin}
          onValueChange={setPrecoCustoMin}
          placeholder="0,00"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">R$</span>
            </div>
          }
        />

    <Input
          type="number"
          label="Preço custo max"
          className="w-32"
          placeholder="0,00"
          labelPlacement="outside"
          value={precoCustoMax}
          onValueChange={setPrecoCustoMax}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">R$</span>
            </div>
          }
        />
     
       <Input
          type="number"
          label="Preço venda min"
          className="w-32"
          placeholder="0,00" 
          value={precoVendaMin}
          onValueChange={setPrecoVendaMin}
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">R$</span>
            </div>
          }
        />
     <Input
          type="number"
          label="Preço venda max"
          className="w-32"
          value={precoVendaMax}
       
          onValueChange={setPrecoVendaMax}
          placeholder="0,00"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">R$</span>
            </div>
          }
        />
   
 
    
       
      
      </div>

   <div className='flex flex-row justify-center mt-10'>
     <Button className="text-white bg-master_black p-4 font-bold ml-5" onClick={()=>generateRelatory()}>
     Gerar relatório
     </Button>
     
   </div>


   
       

              </>
       
     );
}